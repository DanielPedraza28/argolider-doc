<template>
  <div class="flex flex-col bg-gray-50 text-black">
    <main class="flex-grow px-4 pt-4 pb-2">
      <div class="max-w-6xl mx-auto">
        <AppNavigationTabs
          :steps="steps"
          :currentStep="currentStep"
          @cambiarPaso="manejarCambioDePestaña"
        />

        <div class="bg-gray-100 p-6 rounded shadow max-h-[70vh] overflow-y-auto">
          <component
            :is="currentComponent"
            v-model="formData"
            @archivoEliminado="registrarArchivoParaEliminar"
            @archivoTemporal="registrarArchivoTemporal"
            @validacionPaso="pasoValido = $event"
          />
        </div>

        <div class="flex justify-between items-center mt-6">
          <div class="flex gap-4">
            <button
              class="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-600 disabled:opacity-50"
              @click="previousStep"
              :disabled="currentStep === 0"
            >
              Anterior
            </button>

            <button
              v-if="modoEdicion"
              class="px-6 py-2 bg-white text-black border border-black rounded hover:bg-gray-100"
              @click="cancelarEdicion"
            >
              Cancelar edición
            </button>

            <button
              v-if="!modoEdicion"
              class="px-6 py-2 bg-white text-black border border-black rounded hover:bg-gray-100"
              @click="cancelarCreacion"
            >
              Cancelar creación
            </button>
          </div>

          <div class="flex gap-2">
            <button
              v-if="modoEdicion"
              :disabled="isSaving"
              class="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
              @click="saveForm"
            >
              Guardar cambios
            </button>
            <button
              v-else
              :disabled="isSaving"
              class="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
              @click="handleNext"
            >
              {{ isLastStep ? 'Finalizar y Guardar' : 'Siguiente' }}
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>


<script>
import AppNavigationTabs from './layout/AppNavigationTabs.vue'
import PasoIdentificacion from './steps/PasoIdentificacion.vue'
import PasoEstadoAdministrativo from './steps/PasoEstadoAdministrativo.vue'
import PasoAvaluoImpuestos from './steps/PasoAvaluoImpuestos.vue'
import PasoServiciosPublicos from './steps/PasoServiciosPublicos.vue'
import PasoInventarioJuridico from './steps/PasoInventarioJuridico.vue'
import PasoTecnicoComplementarios from './steps/PasoTecnicoComplementarios.vue'
import PasoResumen from './steps/PasoResumen.vue'

import { db, storage } from '../firebase/config'
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore'
import { ref as storageRef, deleteObject } from 'firebase/storage'

export default {
  name: 'StepperForm',
  components: {
    AppNavigationTabs,
    PasoIdentificacion,
    PasoEstadoAdministrativo,
    PasoAvaluoImpuestos,
    PasoServiciosPublicos,
    PasoInventarioJuridico,
    PasoTecnicoComplementarios,
    PasoResumen
  },
  props: {
    fichaId: {
      type: String,
      default: null
    },
    fichaData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      isSaving: false,
      currentStep: 0,
      modoEdicion: false,
      pasoValido: true,
      archivosParaEliminar: [],
      archivosTemporales: [],
      steps: [
        'Identificación',
        'Administración y Arrendamiento',
        'Avalúo e Impuestos',
        'Servicios Públicos',
        'Inventario y Estado Jurídico',
        'Estado Técnico y Complementarios',
        'Resumen Final'
      ],
      formData: {
        numeroInterno: '', nombrePropiedad: '', tipo: '', direccion: '', ciudad: '',
        matriculaInmobiliaria: '', documentoMatriculaInmobiliariaUrl: '', chip: '',
        nombrePropietarios: [], porcentajePropietarios: '',
        estado: '', fechaInicio: '', fechaTerminacion: '', numeroProrroga: '',
        nombreArrendatarios: '', canonArrendamiento: '', areaArrendada: '',
        avaluoCatastralActual: '', avaluoCatastralAnterior: '', avaluoComercialUltimo: '',
        fechaAvaluoComercial: '', validacionValorizacion: '',
        fechaCalculoImpuesto: '', valorImpuestoPredial: '', observacionesDeudaImpuestos: '',
        energiaNombreProveedor: '', energiaDireccionFactura: '', energiaCuentas: [], energiaMedidores: [], energiaObservaciones: '',
        aguaNombreProveedor: '', aguaDireccionFactura: '', aguaCuentas: [], aguaMedidores: [], aguaObservaciones: '',
        gasNombreProveedor: '', gasDireccionFactura: '', gasCuentas: [], gasMedidores: [], gasObservaciones: '',
        claseInventario: '', fechaUltimoInventario: '', documentoClaseInventarioUrl: '',
        documentoEstadoTecnicoUrl: '',
        tipoProceso: '', descripcionProceso: '',
        fechaLicenciaInicial: '', fechaModificacion: '', descripcionEstadoLicencia: '',
        latitud: '', longitud: '',
        nombresAntiguos: [], imagenes: []
      }
    }
  },
  computed: {
    currentComponent() {
      return [
        PasoIdentificacion,
        PasoEstadoAdministrativo,
        PasoAvaluoImpuestos,
        PasoServiciosPublicos,
        PasoInventarioJuridico,
        PasoTecnicoComplementarios,
        PasoResumen
      ][this.currentStep]
    },
    isLastStep() {
      return this.currentStep === this.steps.length - 1
    }
  },
  mounted() {
    if (this.fichaId && Object.keys(this.fichaData).length) {
      this.formData = JSON.parse(JSON.stringify(this.fichaData))
      this.modoEdicion = true
      sessionStorage.setItem('modoEdicionActiva', 'true')
    }

    window.addEventListener('beforeunload', this.protegerCierre)
  },
  unmounted() {
    window.removeEventListener('beforeunload', this.protegerCierre)
  },
  methods: {
    protegerCierre(event) {
      const hayDatos = Object.values(this.formData).some(val => val && val.length !== 0)
      const estaEditando = sessionStorage.getItem('modoEdicionActiva') === 'true'
      if (estaEditando || hayDatos) {
        event.preventDefault()
        event.returnValue = ''
      }
    },
    manejarCambioDePestaña(index) {
      if (this.modoEdicion) {
        this.currentStep = index
      }
    },
    previousStep() {
      if (this.currentStep > 0) this.currentStep--
    },
    handleNext() {
      if (!this.validarPaso()) return
      if (this.isLastStep) {
        this.saveForm()
      } else {
        this.currentStep++
      }
    },
    cancelarEdicion() {
      if (confirm('¿Seguro que deseas cancelar la edición? Se perderán los cambios no guardados.')) {
        this.resetForm()
        this.currentStep = 0
        this.modoEdicion = false
        sessionStorage.removeItem('modoEdicionActiva')
        this.$router.replace('/').then(() => {
          this.$router.replace('/fichas')
        })
      }
    },
    cancelarCreacion() {
      if (confirm('¿Seguro que deseas cancelar la creación de esta ficha?')) {
        this.resetForm()
        this.currentStep = 0
        sessionStorage.removeItem('modoEdicionActiva')
      }
    },
    validarPaso() {
      const d = this.formData
      if (this.currentStep === 0) {
        if (!d.numeroInterno || !d.nombrePropiedad || !d.tipo || !d.direccion || !d.ciudad) {
          alert('Por favor completa todos los campos obligatorios en Identificación')
          return false
        }
      } else if (this.currentStep === 1 && !d.estado) {
        alert('Por favor selecciona el Estado')
        return false
      }
      if (!this.pasoValido) {
        alert('Hay errores en el paso actual que deben corregirse antes de continuar.')
        return false
      }
      return true
    },
    registrarArchivoParaEliminar(url) {
      if (url && !this.archivosParaEliminar.includes(url)) {
        this.archivosParaEliminar.push(url)
      }
    },
    registrarArchivoTemporal(url) {
      if (url && !this.archivosTemporales.includes(url)) {
        this.archivosTemporales.push(url)
      }
    },
    resetForm() {
      this.eliminarListaArchivos(this.archivosTemporales)
      const camposIniciales = this.$options.data().formData
      for (const key in camposIniciales) {
        this.formData[key] = JSON.parse(JSON.stringify(camposIniciales[key]))
      }
      this.formData.documentoEstadoTecnicoUrl = ''
      this.archivosParaEliminar = []
      this.archivosTemporales = []
      sessionStorage.removeItem('modoEdicionActiva')
    },
    async eliminarListaArchivos(lista) {
      for (const url of lista) {
        try {
          const baseUrl = "https://firebasestorage.googleapis.com/v0/b/"
          const bucket = storage.app.options.storageBucket
          const pathStart = `${baseUrl}${bucket}/o/`
          const encodedPath = url.replace(pathStart, '').split('?')[0]
          const decodedPath = decodeURIComponent(encodedPath)
          const archivoRef = storageRef(storage, decodedPath)
          await deleteObject(archivoRef)
        } catch (error) {
          console.error('Error al eliminar archivo:', url, error)
        }
      }
    },
    async saveForm() {
      if (this.isSaving) return
      this.isSaving = true

      const d = this.formData

      // Validación campos obligatorios de identificación
      if (!d.numeroInterno || !d.nombrePropiedad || !d.tipo || !d.direccion || !d.ciudad) {
        alert('Por favor completa todos los campos obligatorios en Identificación')
        this.isSaving = false
        return
      }

      // Validación del porcentaje total de propietarios
      const totalPorcentaje = Array.isArray(d.propietariosPorcentaje)
        ? d.propietariosPorcentaje.reduce((sum, p) => {
            const valor = parseFloat(p.porcentaje)
            return sum + (isNaN(valor) ? 0 : valor)
          }, 0)
        : 0

      if (totalPorcentaje > 100) {
        alert(`La suma de los porcentajes de propietarios es ${totalPorcentaje}%. No puede superar el 100%.`)
        this.isSaving = false
        return
      }

      try {
        const fichaConFecha = {
          fechaCreacion: new Date().toISOString(),
          ...this.formData,
          documentoMatriculaInmobiliariaUrl: this.formData.documentoMatriculaInmobiliariaUrl || '',
          documentoClaseInventarioUrl: this.formData.documentoClaseInventarioUrl || '',
          imagenes: (this.formData.imagenes || []).map(img => img.name || img)
        }

        if (this.modoEdicion && this.fichaId) {
          const ref = doc(db, 'predios', this.fichaId)
          await updateDoc(ref, fichaConFecha)
        } else {
          await addDoc(collection(db, 'predios'), fichaConFecha)
        }

        await this.eliminarListaArchivos(this.archivosParaEliminar)
        this.archivosParaEliminar = []
        this.archivosTemporales = []

        alert(this.modoEdicion ? '✅ Cambios guardados' : '✅ Ficha guardada correctamente')
        this.resetForm()
        this.currentStep = 0
        this.modoEdicion = false
        sessionStorage.removeItem('modoEdicionActiva')
        this.$router.push('/fichas')
      } catch (error) {
        console.error('Error al guardar en Firebase:', error)
        alert('Ocurrió un error al guardar. Revisa la consola.')
      } finally {
        this.isSaving = false
      }
    },
  }
}
</script>

<style scoped>
button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>