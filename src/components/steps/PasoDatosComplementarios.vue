<template>
  <div class="p-4 border rounded bg-white">
    <h2 class="text-xl font-bold mb-6 text-center">Paso 9: Datos Complementarios</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Coordenadas -->
      <div>
        <label class="block mb-1 font-medium">Latitud</label>
        <input v-model="localData.latitud" type="text" class="w-full p-2 border rounded" />
      </div>

      <div>
        <label class="block mb-1 font-medium">Longitud</label>
        <input v-model="localData.longitud" type="text" class="w-full p-2 border rounded" />
      </div>
    </div>

    <!-- Nombres Antiguos -->
    <div class="mt-8">
      <h3 class="text-lg font-semibold mb-4">Historial de Nombres Antiguos</h3>
      <div v-for="(nombre, index) in localData.nombresAntiguos" :key="index" class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-center">
        <input v-model="nombre.nombre" type="text" placeholder="Nombre Antiguo" class="p-2 border rounded" />
        <input v-model="nombre.anioHasta" type="number" placeholder="Año Hasta" class="p-2 border rounded" />
        <button @click="eliminarNombreAntiguo(index)" class="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-800">
          🗑 Eliminar
        </button>
      </div>
      <button @click="agregarNombreAntiguo" class="px-4 py-2 bg-black text-white rounded hover:bg-gray-800">
        + Agregar Nombre Antiguo
      </button>
    </div>

    <!-- Imágenes -->
    <div class="mt-8">
      <h3 class="text-lg font-semibold mb-4">Imágenes del Predio</h3>
      <input type="file" multiple @change="guardarImagenes" class="block w-full text-sm text-gray-500" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'PasoDatosComplementarios',
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
    agregarNombreAntiguo() {
      if (!this.localData.nombresAntiguos) {
        this.localData.nombresAntiguos = []
      }
      this.localData.nombresAntiguos.push({ nombre: '', anioHasta: '' })
    },
    eliminarNombreAntiguo(index) {
      this.localData.nombresAntiguos.splice(index, 1)
    },
    guardarImagenes(event) {
      this.localData.imagenes = Array.from(event.target.files)
    }
  }
}
</script>
