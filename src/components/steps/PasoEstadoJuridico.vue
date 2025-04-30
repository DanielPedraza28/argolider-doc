<template>
  <div class="p-4 border rounded bg-white">
    <h2 class="text-xl font-bold mb-6 text-center">Paso 7: Estado Jurídico</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Tipo de Proceso -->
      <div class="md:col-span-2">
        <label class="block mb-1 font-medium">Tipo de Proceso</label>
        <input v-model="localData.tipoProceso" type="text" class="w-full p-2 border rounded" />
      </div>

      <!-- Descripción del Proceso -->
      <div class="md:col-span-2">
        <label class="block mb-1 font-medium">Descripción del Proceso</label>
        <textarea v-model="localData.descripcionProceso" rows="4" class="w-full p-2 border rounded"></textarea>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PasoEstadoJuridico',
  props: ['modelValue'],
  computed: {
    localData: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  }
}
</script>
