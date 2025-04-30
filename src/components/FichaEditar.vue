<template>
  <div class="min-h-screen flex flex-col bg-white text-black">
    <header class="bg-black text-white p-4 text-center text-2xl font-bold">
      Editar Ficha del Predio
    </header>

    <main class="flex-grow p-6 bg-gray-50">
      <div class="max-w-6xl mx-auto">
        <div v-if="cargando" class="text-center py-10">Cargando datos...</div>

        <div v-else>
          <div class="bg-white p-6 rounded shadow">
            <component :is="currentComponent" v-model="formData" />
          </div>

          <div class="flex justify-between mt-8">
            <button
              class="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-600"
              @click="anteriorPaso"
              :disabled="pasoActual === 0"
            >
              Anterior
            </button>
            <button
              class="px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
              @click="siguientePaso"
            >
              {{ pasoActual === pasos.length - 1 ? 'Guardar Cambios' : 'Siguiente' }}
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { db } from '@/firebase/config'
import { doc, getDoc, updateDoc } from 'firebase/firestore'

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

export default {
  name: 'FichaEditar',
  components: {
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
      cargando: true,
      pasoActual: 0,
      pasos: [
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
      ],
      formData: {}
    }
  },
  computed: {
    currentComponent() {
      return this.pasos[this.pasoActual]
    }
  },
  methods: {
    async cargarFicha() {
      const id = this.$route.params.id
      const ref = doc(db, 'predios', id)
      const snap = await getDoc(ref)
      if (snap.exists()) {
        this.formData = snap.data()
      } else {
        alert('Ficha no encontrada')
        this.$router.push('/fichas')
      }
      this.cargando = false
    },
    anteriorPaso() {
      if (this.pasoActual > 0) this.pasoActual--
    },
    async siguientePaso() {
      if (this.pasoActual === this.pasos.length - 1) {
        try {
          const id = this.$route.params.id
          const ref = doc(db, 'predios', id)
          const data = {
            ...this.formData,
            imagenes: (this.formData.imagenes || []).map(img => img.name || img)
          }
          await updateDoc(ref, data)
          alert('✅ Cambios guardados')
          this.$router.push('/fichas')
        } catch (err) {
          console.error(err)
          alert('❌ Error al guardar cambios')
        }
      } else {
        this.pasoActual++
      }
    }
  },
  mounted() {
    this.cargarFicha()
  }
}
</script>