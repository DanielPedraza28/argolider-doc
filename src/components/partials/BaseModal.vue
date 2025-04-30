<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
    <div class="bg-white rounded-lg shadow-lg w-96 p-6 text-center">
      <h2 class="text-xl font-bold mb-4">{{ titulo }}</h2>
      <p class="mb-6">{{ mensaje }}</p>

      <div class="flex justify-around">
        <button @click="$emit('cancelar')" class="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-600">
          Cancelar
        </button>
        <button @click="$emit('confirmar')" class="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
          Confirmar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseModal',
  props: {
    titulo: String,
    mensaje: String
  }
}
</script>
