<template>
  <nav class="bg-gray-100 px-6 py-2 shadow-sm">
    <div class="flex space-x-6 text-sm font-medium">
      <router-link
        to="/"
        class="hover:text-black"
        :class="{ 'text-black font-bold border-b-2 border-black': $route.path === '/' }"
      >
        Registrar Ficha
      </router-link>
      <router-link
        to="/listado"
        class="hover:text-black"
        :class="{ 'text-black font-bold border-b-2 border-black': $route.path === '/listado' }"
      >
        Listado de Fichas
      </router-link>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'AppNavigationTabs'
}
</script>
