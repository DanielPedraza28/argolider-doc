<template>
  <div class="p-4 border rounded bg-white">
    <h2 class="text-xl font-bold mb-6 text-center">Paso 5: Servicios Públicos</h2>

    <div v-for="tipo in ['energia', 'agua', 'gas']" :key="tipo" class="mb-10">
      <h3 class="text-lg font-semibold mb-4 capitalize">{{ tipo }}</h3>

      <!-- Nombre del proveedor -->
      <div class="mb-4">
        <label class="block mb-1 font-medium">Nombre del Proveedor</label>
        <input v-model="localData[tipo + 'NombreProveedor']" type="text" class="w-full p-2 border rounded" />
      </div>

      <!-- Dirección de factura -->
      <div class="mb-4">
        <label class="block mb-1 font-medium">Dirección de la factura</label>
        <input v-model="localData[tipo + 'DireccionFactura']" type="text" class="w-full p-2 border rounded" />
      </div>

      <!-- Cuentas dinámicas -->
      <div class="mb-4">
        <label class="block mb-1 font-medium">N. Cuenta(s)</label>
        <div v-for="(cuenta, index) in localData[tipo + 'Cuentas']" :key="'cuenta-' + tipo + '-' + index" class="flex gap-2 mb-2">
          <input v-model="localData[tipo + 'Cuentas'][index]" type="text" class="w-full p-2 border rounded" />
          <button @click="eliminarItem(tipo + 'Cuentas', index)" class="px-2 py-1 bg-red-600 text-white rounded">🗑</button>
        </div>
        <button @click="agregarItem(tipo + 'Cuentas')" class="text-sm text-blue-600 hover:underline">+ Agregar cuenta</button>
      </div>

      <!-- Medidores dinámicos -->
      <div class="mb-4">
        <label class="block mb-1 font-medium">N. Medidor(es)</label>
        <div v-for="(medidor, index) in localData[tipo + 'Medidores']" :key="'medidor-' + tipo + '-' + index" class="flex gap-2 mb-2">
          <input v-model="localData[tipo + 'Medidores'][index]" type="text" class="w-full p-2 border rounded" />
          <button @click="eliminarItem(tipo + 'Medidores', index)" class="px-2 py-1 bg-red-600 text-white rounded">🗑</button>
        </div>
        <button @click="agregarItem(tipo + 'Medidores')" class="text-sm text-blue-600 hover:underline">+ Agregar medidor</button>
      </div>

      <!-- Observaciones -->
      <div>
        <label class="block mb-1 font-medium">Observaciones sobre el servicio</label>
        <textarea v-model="localData[tipo + 'Observaciones']" rows="4" class="w-full p-2 border rounded"></textarea>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PasoServiciosPublicos',
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
    agregarItem(campo) {
      if (!this.localData[campo]) {
        this.localData[campo] = []
      }
      this.localData[campo].push('')
    },
    eliminarItem(campo, index) {
      this.localData[campo].splice(index, 1)
    }
  }
}
</script>
