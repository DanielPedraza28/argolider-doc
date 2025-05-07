<template>
  <div class="flex flex-col bg-gray-50 text-black">
    <main class="flex-grow px-4 pt-4 pb-2">
      <div class="max-w-6xl mx-auto">
        <!-- Navegación del Stepper -->
        <AppNavigationTabs :steps="steps" :currentStep="currentStep" />

        <!-- Componente del paso -->
        <div class="bg-gray-100 p-6 rounded shadow max-h-[70vh] overflow-y-auto">
          <component :is="currentComponent" v-model="formData" />
        </div>


        <!-- Navegación -->
        <div class="flex justify-between items-center mt-6">
          <button
            class="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-600 disabled:opacity-50"
            @click="previousStep"
            :disabled="currentStep === 0"
          >
            Anterior
          </button>

          <button
            class="px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
            @click="handleNext"
          >
            {{ isLastStep ? 'Finalizar y Guardar' : 'Siguiente' }}
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
import { db } from '../firebase/config'
import { collection, addDoc } from 'firebase/firestore'

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
  data() {
    return {
      currentStep: 0,
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
        matriculaInmobiliaria: '', chip: '', nombrePropietarios: [], porcentajePropietarios: '',
        estado: '', fechaInicio: '', fechaTerminacion: '', numeroProrroga: '',
        nombreArrendatarios: '', canonArrendamiento: '', areaArrendada: '',
        avaluoCatastralActual: '', avaluoCatastralAnterior: '', avaluoComercialUltimo: '',
        fechaAvaluoComercial: '', validacionValorizacion: '',
        fechaCalculoImpuesto: '', valorImpuestoPredial: '', observacionesDeudaImpuestos: '',
        energiaNombreProveedor: '', energiaDireccionFactura: '', energiaCuentas: [], energiaMedidores: [], energiaObservaciones: '',
        aguaNombreProveedor: '', aguaDireccionFactura: '', aguaCuentas: [], aguaMedidores: [], aguaObservaciones: '',
        gasNombreProveedor: '', gasDireccionFactura: '', gasCuentas: [], gasMedidores: [], gasObservaciones: '',
        claseInventario: '', fechaUltimoInventario: '',
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
    async saveForm() {
      try {
        const fichaConFecha = {
          fechaCreacion: new Date().toISOString(),
          ...this.formData,
          imagenes: (this.formData.imagenes || []).map(img => img.name || img)
        }
        await addDoc(collection(db, 'predios'), fichaConFecha)
        alert('✅ Ficha guardada correctamente en Firebase')
        this.resetForm()
        this.currentStep = 0
      } catch (error) {
        console.error('❌ Error al guardar en Firebase:', error)
        alert('Ocurrió un error al guardar. Revisa la consola.')
      }
    },
    resetForm() {
      this.formData = JSON.parse(JSON.stringify(this.$options.data().formData))
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
