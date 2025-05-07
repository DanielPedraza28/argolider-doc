<template>
  <div class="max-w-4xl mx-auto bg-white p-8 rounded shadow-md">
    <h2 class="text-2xl font-semibold text-center mb-2">Paso 1: Identificación del Predio</h2>
    <p class="text-center text-sm text-gray-500 mb-6">Por favor completa la información básica del predio</p>

    <div class="grid grid-cols-1 gap-4">
      <div>
        <label>Número Interno *</label>
        <input v-model="form.numeroInterno" type="text" required />
      </div>

      <div>
        <label>Nombre de Propiedad *</label>
        <input v-model="form.nombrePropiedad" type="text" required />
      </div>

      <div>
        <label>Tipo de Predio *</label>
        <select v-model="form.tipo" required>
          <option value="" disabled>Seleccione</option>
          <option>Lote</option>
          <option>Edificio</option>
          <option>Local</option>
          <option>Oficina</option>
        </select>
      </div>

      <div>
        <label>Dirección *</label>
        <input v-model="form.direccion" type="text" required />
      </div>

      <div>
        <label>Ciudad *</label>
        <select v-model="form.ciudad" required>
          <option value="" disabled>Seleccione</option>
          <option>Bogotá</option>
          <option>Medellín</option>
          <option>Cali</option>
          <option>Barranquilla</option>
          <option>Cartagena</option>
          <option>Santa Marta</option>
          <option>Manizales</option>
          <option>Pereira</option>
          <option>Armenia</option>
          <option>Villavicencio</option>
          <option>Ibagué</option>
          <option>Bucaramanga</option>
          <option>Cúcuta</option>
          <option>Popayán</option>
          <option>Pasto</option>
          <option>Neiva</option>
        </select>
      </div>

      <div>
        <label>Número Matrícula Inmobiliaria</label>
        <input v-model="form.matriculaInmobiliaria" type="text" />
      </div>

      <div>
        <label>CHIP</label>
        <input v-model="form.chip" type="text" />
      </div>

      <!-- Propietarios -->
      <div class="border-t pt-4 mt-6">
        <label class="block font-semibold mb-2">Propietarios del Predio</label>
        <div
          v-for="(propietario, index) in form.nombrePropietarios"
          :key="index"
          class="flex items-center gap-4 mb-2"
        >
          <input v-model="form.nombrePropietarios[index]" type="text" placeholder="Nombre del propietario" class="flex-1" />
          <div class="flex items-center">
            <input v-model="form.porcentajePropietarios[index]" type="number" min="0" max="100" placeholder="%" class="w-20 mr-1" />
            <span>%</span>
          </div>
          <button type="button" class="text-red-600 font-bold" @click="eliminarPropietario(index)">✕</button>
        </div>
        <button
          type="button"
          class="mt-2 bg-black text-white px-4 py-1 rounded hover:bg-gray-800"
          @click="agregarPropietario"
        >
          + Agregar Propietario
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PasoIdentificacion',
  props: {
    modelValue: Object
  },
  computed: {
    form: {
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
      if (!Array.isArray(this.form.nombrePropietarios)) {
        this.form.nombrePropietarios = []
      }
      if (!Array.isArray(this.form.porcentajePropietarios)) {
        this.form.porcentajePropietarios = []
      }
      this.form.nombrePropietarios.push('')
      this.form.porcentajePropietarios.push('')
    },
    eliminarPropietario(index) {
      if (Array.isArray(this.form.nombrePropietarios)) {
        this.form.nombrePropietarios.splice(index, 1)
      }
      if (Array.isArray(this.form.porcentajePropietarios)) {
        this.form.porcentajePropietarios.splice(index, 1)
      }
    }
  }
}
</script>

<style scoped>
label {
  display: block;
  font-weight: 600;
  margin-bottom: 4px;
}
input,
select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
}
</style>
