<template>
  <div class="flex flex-col bg-gray-50 text-black">
    <main class="flex-grow px-4 pt-4 pb-2">
      <div class="max-w-6xl mx-auto">
        <AppNavigationTabs :steps="steps" :currentStep="currentStep" />

        <div class="bg-gray-100 p-6 rounded shadow max-h-[70vh] overflow-y-auto">
          <component
            :is="currentComponent"
            v-model="formData"
            @archivoEliminado="registrarArchivoParaEliminar"
            @archivoTemporal="registrarArchivoTemporal"
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

          <button
            class="px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
            @click="handleNext"
          >
            {{ isLastStep ? (modoEdicion ? 'Guardar Cambios' : 'Finalizar y Guardar') : 'Siguiente' }}
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import PasoIdentificacion from './steps/PasoIdentificacion.vue'
import PasoEstadoAdministrativo from './steps/PasoEstadoAdministrativo.vue'
import PasoAvaluo from './steps/PasoAvaluo.vue'
import PasoImpuestos from './steps/PasoImpuestos.vue'
import PasoServiciosPublicos from './steps/PasoServiciosPublicos.vue'
import PasoInventarios from './steps/PasoInventarios.vue'
import PasoEstadoJuridico from './steps/PasoEstadoJuridico.vue'
import PasoEstadoTecnico from './steps/PasoEstadoTecnico.vue'
import PasoDatosComplementarios from './steps/PasoDatosComplementarios.vue'
import PasoResumen from './steps/PasoResumen.vue'
import AppNavigationTabs from './layout/AppNavigationTabs.vue'

import { db, storage } from '../firebase/config'
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore'
import { ref as storageRef, deleteObject } from 'firebase/storage'

export default {
  name: 'StepperForm',
  components: {
    AppNavigationTabs,
    PasoIdentificacion,
    PasoEstadoAdministrativo,
    PasoAvaluo,
    PasoImpuestos,
    PasoServiciosPublicos,
    PasoInventarios,
    PasoEstadoJuridico,
    PasoEstadoTecnico,
    PasoDatosComplementarios,
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
      currentStep: 0,
      modoEdicion: false,
      archivosParaEliminar: [],
      archivosTemporales: [],
      steps: [
        'Identificación',
        'Estado Administrativo',
        'Avalúo',
        'Impuestos',
        'Servicios Públicos',
        'Inventarios',
        'Estado Jurídico',
        'Estado Técnico',
        'Datos Complementarios',
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
        PasoAvaluo,
        PasoImpuestos,
        PasoServiciosPublicos,
        PasoInventarios,
        PasoEstadoJuridico,
        PasoEstadoTecnico,
        PasoDatosComplementarios,
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
  },
  methods: {
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
        console.log('🧹 modoEdicionActiva eliminado al cancelar')
        this.$router.push('/fichas')
      }
    },
    cancelarCreacion() {
      if (confirm('¿Seguro que deseas cancelar la creación de esta ficha?')) {
        this.resetForm()
        this.currentStep = 0
        sessionStorage.removeItem('modoEdicionActiva')
        console.log('🧹 Creación cancelada y archivos temporales limpiados')
        // No redirigir a otra pestaña
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
      return true
    },
    registrarArchivoParaEliminar(url) {
      if (url && !this.archivosParaEliminar.includes(url)) {
        this.archivosParaEliminar.push(url)
        console.log('❌ Archivo marcado para eliminar:', url)
      }
    },
    registrarArchivoTemporal(url) {
      if (url && !this.archivosTemporales.includes(url)) {
        this.archivosTemporales.push(url)
        console.log('📎 Archivo temporal registrado:', url)
      }
    },
    async eliminarListaArchivos(lista) {
      for (const url of lista) {
        try {
          console.log('🧹 Intentando eliminar:', url)

          const baseUrl = "https://firebasestorage.googleapis.com/v0/b/"
          const bucket = storage.app.options.storageBucket
          const pathStart = `${baseUrl}${bucket}/o/`
          const encodedPath = url.replace(pathStart, '').split('?')[0]
          const decodedPath = decodeURIComponent(encodedPath)

          const archivoRef = storageRef(storage, decodedPath)
          await deleteObject(archivoRef)

          console.log('✅ Archivo eliminado de Firebase Storage:', decodedPath)
        } catch (error) {
          console.error('❌ Error al eliminar archivo:', url, error)
        }
      }
    },
    async saveForm() {
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
        console.log('🧹 modoEdicionActiva eliminado después de guardar')
        this.$router.push('/fichas')
      } catch (error) {
        console.error('❌ Error al guardar en Firebase:', error)
        alert('Ocurrió un error al guardar. Revisa la consola.')
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
      console.log('🧹 Campos limpiados con resetForm()')
    }
  }
}
</script>

<style scoped>
button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
