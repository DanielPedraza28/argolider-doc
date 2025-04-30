<template>
  <div class="p-4 border rounded bg-white">
    <h2 class="text-xl font-bold mb-6 text-center">Paso 4: Impuestos</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- ¿Está al día en valorización? (Select) -->
      <div>
        <label class="block mb-1 font-medium">¿Está al día en valorización?</label>
        <select v-model="localData.validacionValorizacion" class="w-full p-2 border rounded">
          <option value="">Seleccione</option>
          <option>Sí</option>
          <option>No</option>
          <option>No Aplica</option>
        </select>
      </div>

      <!-- Fecha de cálculo de impuesto -->
      <div>
        <label class="block mb-1 font-medium">Fecha de cálculo de impuesto</label>
        <input v-model="localData.fechaCalculoImpuesto" type="date" class="w-full p-2 border rounded" />
      </div>

      <!-- Valor de impuesto predial -->
      <div>
        <label class="block mb-1 font-medium">Valor de impuesto predial al corte</label>
        <input
          v-model="localData.valorImpuestoPredial"
          type="text"
          @blur="formatearValor"
          class="w-full p-2 border rounded"
        />
      </div>

      <!-- Observaciones -->
      <div class="md:col-span-2">
        <label class="block mb-1 font-medium">Observaciones sobre el estado de deuda de impuestos</label>
        <textarea v-model="localData.observacionesDeudaImpuestos" rows="3" class="w-full p-2 border rounded"></textarea>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PasoImpuestos',
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
  },
  methods: {
    formatearValor() {
      const raw = this.localData.valorImpuestoPredial?.toString().replace(/\D/g, '') || ''
      if (raw) {
        const number = parseInt(raw)
        this.localData.valorImpuestoPredial = new Intl.NumberFormat('es-CO').format(number)
      }
    }
  }
}
</script>
