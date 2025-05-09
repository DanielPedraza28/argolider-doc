<template>
  <main class="flex-grow p-6 bg-gray-50">
    <div class="max-w-6xl mx-auto">
      <h2 class="text-center text-2xl font-semibold mb-6">Editar Ficha del Predio</h2>

      <div v-if="cargando" class="text-center py-10">Cargando datos...</div>

      <div v-else>
        <StepperForm :ficha-id="$route.params.id" :fichaData="formData" />
      </div>
    </div>
  </main>
</template>

<script>
import { db } from '@/firebase/config'
import { doc, getDoc } from 'firebase/firestore'
import StepperForm from './StepperForm.vue'

export default {
  name: 'FichaEditar',
  components: {
    StepperForm
  },
  data() {
    return {
      cargando: true,
      formData: {}
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
    }
  },
  mounted() {
    this.cargarFicha()
  }
}
</script>
