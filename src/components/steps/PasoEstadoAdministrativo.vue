<template>
  <div class="p-4 border rounded bg-white">
    <h2 class="text-xl font-bold mb-6 text-center">Paso 2: Estado Administrativo</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Estado (Select) -->
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
    </div>

    <!-- Campos condicionales -->
    <div v-if="localData.estado === 'Arrendado'" class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
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
  name: 'PasoEstadoAdministrativo',
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
