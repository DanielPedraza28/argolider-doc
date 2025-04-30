<template>
  <div class="p-4 border rounded bg-white">
    <h2 class="text-xl font-bold mb-6 text-center">Paso 6: Inventarios</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Clase de Inventario -->
      <div>
        <label class="block mb-1 font-medium">Clase de Inventario</label>
        <input v-model="localData.claseInventario" type="text" class="w-full p-2 border rounded" />
      </div>

      <!-- Fecha del Último Inventario -->
      <div>
        <label class="block mb-1 font-medium">Fecha del Último Inventario</label>
        <input v-model="localData.fechaUltimoInventario" type="date" class="w-full p-2 border rounded" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PasoInventarios',
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
