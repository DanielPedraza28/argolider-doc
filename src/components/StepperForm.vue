<template>
  <div class="min-h-screen flex flex-col bg-white text-black">
    <header class="bg-black text-white p-4 text-center text-2xl font-bold">
      Gestión Documental Inmobiliaria - Argolider
    </header>

    <main class="flex-grow p-6 bg-gray-50">
      <div class="max-w-6xl mx-auto">
        <!-- Navegación del Stepper con componente -->
          <AppNavigationTabs :steps="steps" :currentStep="currentStep" />


        <!-- Componente actual -->
        <div class="bg-gray-100 p-6 rounded shadow">
          <component :is="currentComponent" v-model="formData" />
        </div>

        <!-- Botones de navegación -->
        <div class="flex justify-between mt-8">
          <button class="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-600" @click="previousStep" :disabled="currentStep === 0">
            Anterior
          </button>

          <button class="px-6 py-2 bg-black text-white rounded hover:bg-gray-800" @click="handleNext">
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
import { db } from '../firebase/config'
import { collection, addDoc } from 'firebase/firestore'
import AppNavigationTabs from './layout/AppNavigationTabs.vue'


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
        numeroInterno: '', nombrePropiedad: '', tipo: '', direccion: '', ciudad: '', matriculaInmobiliaria: '', chip: '', nombrePropietarios: [], porcentajePropietarios: '', estado: '', fechaInicio: '', fechaTerminacion: '', numeroProrroga: '', nombreArrendatarios: '', canonArrendamiento: '', areaArrendada: '', avaluoCatastralActual: '', avaluoCatastralAnterior: '', avaluoComercialUltimo: '', fechaAvaluoComercial: '', validacionValorizacion: '', fechaCalculoImpuesto: '', valorImpuestoPredial: '', observacionesDeudaImpuestos: '', energiaNombreProveedor: '', energiaDireccionFactura: '', energiaCuentas: [], energiaMedidores: [], energiaObservaciones: '', aguaNombreProveedor: '', aguaDireccionFactura: '', aguaCuentas: [], aguaMedidores: [], aguaObservaciones: '', gasNombreProveedor: '', gasDireccionFactura: '', gasCuentas: [], gasMedidores: [], gasObservaciones: '', claseInventario: '', fechaUltimoInventario: '', tipoProceso: '', descripcionProceso: '', fechaLicenciaInicial: '', fechaModificacion: '', descripcionEstadoLicencia: '', latitud: '', longitud: '', nombresAntiguos: [], imagenes: []
      }
    }
  },
  computed: {
    currentComponent() {
      const components = [
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
      ]
      return components[this.currentStep]
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
      } else if (this.currentStep === 1) {
        if (!d.estado) {
          alert('Por favor selecciona el Estado')
          return false
        }
        if (d.estado === 'Arrendado' && !d.fechaInicio) {
          alert('Si el estado es Arrendado, la Fecha de Inicio es obligatoria')
          return false
        }
      } else if (this.currentStep === 2) {
        if (!d.avaluoCatastralActual) {
          alert('El avalúo catastral actual es obligatorio')
          return false
        }
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
      const original = this.$options.data().formData
      this.formData = JSON.parse(JSON.stringify(original))
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
