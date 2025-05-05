<template>
  <div class="bg-gray-50 min-h-screen py-10">
    <div class="max-w-3xl mx-auto bg-white p-10 rounded-xl shadow-lg">
      <h2 class="text-2xl font-bold text-center mb-2">Paso 1: Identificación del Predio</h2>
      <p class="text-center text-sm text-gray-600 mb-6">Por favor completa la información básica del predio</p>
      <div class="border-b mb-8"></div>

      <div class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium mb-1">Número Interno *</label>
            <input v-model="localData.numeroInterno" type="text" class="w-full max-w-[95%] p-2 border border-gray-300 rounded" />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Nombre de Propiedad *</label>
            <input v-model="localData.nombrePropiedad" type="text" class="w-full max-w-[95%] p-2 border border-gray-300 rounded" />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Tipo de Predio *</label>
            <select v-model="localData.tipo" class="w-full max-w-[95%] p-2 border border-gray-300 rounded">
              <option value="">Seleccione</option>
              <option>Lote</option>
              <option>Edificio</option>
              <option>Local</option>
              <option>Oficina</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Dirección *</label>
            <input v-model="localData.direccion" type="text" class="w-full max-w-[95%] p-2 border border-gray-300 rounded" />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Ciudad *</label>
            <select v-model="localData.ciudad" class="w-full max-w-[95%] p-2 border border-gray-300 rounded">
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

          <div>
            <label class="block text-sm font-medium mb-1">Número Matrícula Inmobiliaria</label>
            <input v-model="localData.matriculaInmobiliaria" type="text" class="w-full max-w-[95%] p-2 border border-gray-300 rounded" />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">CHIP</label>
            <input v-model="localData.chip" type="text" class="w-full max-w-[95%] p-2 border border-gray-300 rounded" />
          </div>
        </div>

        <!-- Propietarios -->
        <div class="pt-6">
          <h3 class="text-lg font-semibold mb-4">Propietarios del Predio</h3>
          <div
            v-for="(propietario, index) in localData.nombrePropietarios"
            :key="index"
            class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-4"
          >
            <input
              v-model="propietario.nombre"
              type="text"
              placeholder="Nombre del Propietario"
              class="p-2 border border-gray-300 rounded"
            />
            <div class="flex items-center">
              <input
                v-model="propietario.porcentaje"
                type="number"
                min="0"
                max="100"
                placeholder="%"
                class="p-2 border border-gray-300 rounded w-full"
              />
              <span class="ml-2">%</span>
            </div>
            <button
              @click="eliminarPropietario(index)"
              class="bg-red-600 hover:bg-red-800 text-white px-3 py-2 rounded text-sm"
            >
              🗑 Eliminar
            </button>
          </div>
          <button
            @click="agregarPropietario"
            class="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded text-sm mt-2 mb-8"
          >
            + Agregar Propietario
          </button>
        </div>
      </div>
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
