<template>
  <div class="p-4 border rounded bg-white">
    <h2 class="text-xl font-bold mb-6 text-center">Paso 2: Administración y Arrendamiento</h2>

    <!-- Estado y propietarios -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <!-- Estado -->
      <div>
        <label class="block mb-1 font-medium">Estado *</label>
        <select v-model="localData.estado" class="w-full p-2 border rounded">
          <option value="">Seleccione</option>
          <option>Arrendado</option>
          <option>Disponible</option>
          <option>En venta</option>
          <option>No aplica</option>
        </select>
      </div>

      <!-- Porcentaje de propietarios -->
      <div>
        <label class="block mb-1 font-medium">% de cada propietario</label>
        <div class="space-y-2">
          <div
            v-for="(propietario, index) in localData.propietariosPorcentaje"
            :key="index"
            class="flex items-center gap-2"
          >
            <input
              v-model="propietario.nombre"
              type="text"
              placeholder="Nombre"
              class="w-1/2 p-2 border rounded"
            />
            <div class="relative w-1/3">
              <input
                v-model.number="propietario.porcentaje"
                type="number"
                placeholder="%"
                class="w-full p-2 border rounded pr-6"
                min="0"
                max="100"
                @input="emitirValidacion"
              />
              <span class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
            </div>
            <button
              type="button"
              class="text-red-600 font-bold"
              @click="eliminarPropietario(index)"
            >
              ✕
            </button>
          </div>

          <div class="flex justify-between items-center mt-2">
            <button
              type="button"
              class="px-3 py-1 bg-black text-white rounded hover:bg-gray-800 text-sm"
              @click="agregarPropietario"
            >
              + Añadir propietario
            </button>

            <span
              class="text-sm font-medium"
              :class="sumaPorcentajes > 100 ? 'text-red-600' : 'text-gray-600'"
            >
              Total: {{ sumaPorcentajes }}%
            </span>
          </div>

          <p v-if="errorPorcentaje" class="text-red-600 text-sm mt-1">
            No se puede añadir otro propietario. El total supera el 100%.
          </p>
        </div>
      </div>
    </div>

    <!-- Condicional: solo si está arrendado -->
    <div v-if="localData.estado === 'Arrendado'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label class="block mb-1 font-medium">Nombre de Arrendatarios</label>
        <input v-model="localData.nombreArrendatarios" type="text" class="w-full p-2 border rounded" />
      </div>

      <div>
        <label class="block mb-1 font-medium">Canon de Arrendamiento</label>
        <input v-model="localData.canonArrendamiento" type="number" class="w-full p-2 border rounded" />
      </div>

      <div>
        <label class="block mb-1 font-medium">Área Arrendada según Contrato</label>
        <input v-model="localData.areaArrendada" type="number" class="w-full p-2 border rounded" />
      </div>

      <div>
        <label class="block mb-1 font-medium">Fecha de Inicio</label>
        <input v-model="localData.fechaInicio" type="date" class="w-full p-2 border rounded" />
      </div>

      <div>
        <label class="block mb-1 font-medium">Fecha de Terminación</label>
        <input v-model="localData.fechaTerminacion" type="date" class="w-full p-2 border rounded" />
      </div>

      <div>
        <label class="block mb-1 font-medium">Número de Prórroga</label>
        <input v-model="localData.numeroProrroga" type="number" class="w-full p-2 border rounded" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PasoAdministracion',
  props: ['modelValue'],
  data() {
    return {
      errorPorcentaje: false,
    };
  },
  computed: {
    localData: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      }
    },
    sumaPorcentajes() {
      return this.localData.propietariosPorcentaje?.reduce((sum, p) => sum + (p.porcentaje || 0), 0) || 0;
    }
  },
  watch: {
    sumaPorcentajes() {
      this.emitirValidacion();
    }
  },
  methods: {
    agregarPropietario() {
      if (this.sumaPorcentajes >= 100) {
        this.errorPorcentaje = true;
        return;
      }
      this.errorPorcentaje = false;
      if (!this.localData.propietariosPorcentaje) {
        this.localData.propietariosPorcentaje = [];
      }
      this.localData.propietariosPorcentaje.push({ nombre: '', porcentaje: 0 });
      this.emitirValidacion();
    },
    eliminarPropietario(index) {
      this.localData.propietariosPorcentaje.splice(index, 1);
      this.errorPorcentaje = false;
      this.emitirValidacion();
    },
    emitirValidacion() {
      const esValido = this.sumaPorcentajes <= 100;
      this.$emit('validacionPaso', esValido);
    }
  }
};
</script>
