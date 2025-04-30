<template>
  <div class="p-4 border rounded bg-white">
    <h2 class="text-xl font-bold mb-6 text-center">Paso 8: Estado Técnico</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Fecha Licencia Inicial -->
      <div>
        <label class="block mb-1 font-medium">Fecha Licencia Inicial</label>
        <input v-model="localData.fechaLicenciaInicial" type="date" class="w-full p-2 border rounded" />
      </div>

      <!-- Fecha Modificación -->
      <div>
        <label class="block mb-1 font-medium">Fecha Modificación</label>
        <input v-model="localData.fechaModificacion" type="date" class="w-full p-2 border rounded" />
      </div>

      <!-- Descripción de Estado Técnico -->
      <div class="md:col-span-2">
        <label class="block mb-1 font-medium">Descripción de estado de licencia y/o modificación</label>
        <textarea v-model="localData.descripcionEstadoLicencia" rows="4" class="w-full p-2 border rounded"></textarea>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PasoEstadoTecnico',
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
