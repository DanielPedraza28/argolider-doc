<template>
  <div class="p-4 border rounded bg-white">
    <h2 class="text-xl font-bold mb-6 text-center">Paso 1: Identificación del Predio</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Número Interno -->
      <div>
        <label class="block mb-1 font-medium">Número Interno *</label>
        <input v-model="localData.numeroInterno" type="text" class="w-full p-2 border rounded" />
      </div>

      <!-- Nombre de Propiedad -->
      <div>
        <label class="block mb-1 font-medium">Nombre de Propiedad *</label>
        <input v-model="localData.nombrePropiedad" type="text" class="w-full p-2 border rounded" />
      </div>

      <!-- Tipo de Predio (Select) -->
      <div>
        <label class="block mb-1 font-medium">Tipo de Predio *</label>
        <select v-model="localData.tipo" class="w-full p-2 border rounded">
          <option value="">Seleccione</option>
          <option>Lote</option>
          <option>Edificio</option>
          <option>Local</option>
          <option>Oficina</option>
        </select>
      </div>

      <!-- Dirección -->
      <div>
        <label class="block mb-1 font-medium">Dirección *</label>
        <input v-model="localData.direccion" type="text" class="w-full p-2 border rounded" />
      </div>

      <!-- Ciudad (Select) -->
      <div>
        <label class="block mb-1 font-medium">Ciudad *</label>
        <select v-model="localData.ciudad" class="w-full p-2 border rounded">
          <option value="">Seleccione</option>
          <option>Bogotá</option>
          <option>Medellín</option>
          <option>Cali</option>
          <option>Barranquilla</option>
          <option>Cartagena</option>
          <option>Bucaramanga</option>
          <option>Pereira</option>
          <option>Manizales</option>
          <option>Santa Marta</option>
          <option>Villavicencio</option>
          <option>Montería</option>
          <option>Cúcuta</option>
          <option>Neiva</option>
          <option>Ibagué</option>
          <option>Pasto</option>
        </select>
      </div>

      <!-- Matrícula Inmobiliaria -->
      <div>
        <label class="block mb-1 font-medium">Número Matrícula Inmobiliaria</label>
        <input v-model="localData.matriculaInmobiliaria" type="text" class="w-full p-2 border rounded" />
      </div>

      <!-- CHIP -->
      <div>
        <label class="block mb-1 font-medium">CHIP</label>
        <input v-model="localData.chip" type="text" class="w-full p-2 border rounded" />
      </div>
    </div>

    <!-- Propietarios y Porcentaje Dinámicos -->
    <div class="mt-8">
      <h3 class="text-lg font-semibold mb-4">Propietarios del Predio</h3>
      <div v-for="(propietario, index) in localData.nombrePropietarios" :key="index" class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-center">
        <input v-model="propietario.nombre" type="text" placeholder="Nombre del Propietario" class="p-2 border rounded" />
        <div class="flex items-center">
          <input v-model="propietario.porcentaje" type="number" min="0" max="100" placeholder="%" class="p-2 border rounded w-full" />
          <span class="ml-2">%</span>
        </div>
        <button @click="eliminarPropietario(index)" class="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-800">
          🗑 Eliminar
        </button>
      </div>
      <button @click="agregarPropietario" class="px-4 py-2 bg-black text-white rounded hover:bg-gray-800">
        + Agregar Propietario
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PasoIdentificacion',
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
    agregarPropietario() {
      if (!this.localData.nombrePropietarios) {
        this.localData.nombrePropietarios = []
      }
      this.localData.nombrePropietarios.push({ nombre: '', porcentaje: '' })
    },
    eliminarPropietario(index) {
      this.localData.nombrePropietarios.splice(index, 1)
    }
  }
}
</script>
