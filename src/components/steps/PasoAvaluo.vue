<template>
  <div class="p-4 border rounded bg-white">
    <h2 class="text-xl font-bold mb-6 text-center">Paso 3: Avalúo</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Avalúo Catastral Año Actual (Obligatorio) -->
      <div>
        <label class="block mb-1 font-medium">Avalúo Catastral Año Actual *</label>
        <input v-model="localData.avaluoCatastralActual" type="number" class="w-full p-2 border rounded" />
      </div>

      <!-- Avalúo Catastral Año Anterior -->
      <div>
        <label class="block mb-1 font-medium">Avalúo Catastral Año Anterior</label>
        <input v-model="localData.avaluoCatastralAnterior" type="number" class="w-full p-2 border rounded" />
      </div>

      <!-- Avalúo Comercial Último -->
      <div>
        <label class="block mb-1 font-medium">Avalúo Comercial Último</label>
        <input v-model="localData.avaluoComercialUltimo" type="number" class="w-full p-2 border rounded" />
      </div>

      <!-- Fecha del Avalúo Comercial (Condicional) -->
      <div v-if="localData.avaluoComercialUltimo">
        <label class="block mb-1 font-medium">Fecha del Avalúo Comercial</label>
        <input v-model="localData.fechaAvaluoComercial" type="date" class="w-full p-2 border rounded" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PasoAvaluo',
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
