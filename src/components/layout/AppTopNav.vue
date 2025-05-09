<template>
  <nav class="bg-black text-white flex justify-center space-x-6 py-3">
    <a
      href="#"
      class="px-4 py-2 rounded hover:bg-gray-800 text-sm font-medium"
      :class="{ 'bg-gray-800': isActive('/') }"
      @click.prevent="handleNuevaFicha"
    >
      Nueva Ficha
    </a>

    <router-link
      to="/fichas"
      class="px-4 py-2 rounded hover:bg-gray-800 text-sm font-medium"
      :class="{ 'bg-gray-800': isActive('/fichas') }"
    >
      Listado de Fichas
    </router-link>
  </nav>
</template>

<script>
export default {
  name: 'AppTopNav',
  methods: {
    isActive(route) {
      return this.$route.path === route
    },
    handleNuevaFicha() {
      const bloqueado = sessionStorage.getItem('modoEdicionActiva') === 'true'
      if (bloqueado) {
        alert('Debes guardar o cancelar la ficha actual antes de crear una nueva.')
      } else {
        this.$router.push('/')
      }
    }
  }
}
</script>

<style scoped>
a {
  transition: all 0.2s ease-in-out;
}
</style>
