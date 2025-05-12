<template>
  <div class="p-4 border rounded bg-white">
    <h2 class="text-xl font-bold mb-6 text-center">Paso 3: Avalúo e Impuestos</h2>

    <!-- Recuadro Avalúo -->
    <div class="mb-8 p-4 border rounded bg-gray-50 shadow-sm">
      <h3 class="text-lg font-semibold mb-4 border-b pb-1">Avalúo</h3>
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

    <!-- Recuadro Impuestos -->
    <div class="p-4 border rounded bg-gray-50 shadow-sm">
      <h3 class="text-lg font-semibold mb-4 border-b pb-1">Impuestos</h3>
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
          <textarea
            v-model="localData.observacionesDeudaImpuestos"
            rows="3"
            class="w-full p-2 border rounded"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PasoAvaluoImpuestos',
  props: ['modelValue'],
  computed: {
    localData: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      }
    }
  },
  methods: {
    formatearValor() {
      const raw = this.localData.valorImpuestoPredial?.toString().replace(/\D/g, '') || '';
      if (raw) {
        const number = parseInt(raw);
        this.localData.valorImpuestoPredial = new Intl.NumberFormat('es-CO').format(number);
      }
    }
  }
};
</script>
