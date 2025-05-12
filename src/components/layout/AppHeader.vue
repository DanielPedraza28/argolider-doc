<template>
  <header class="bg-black text-white px-6 py-4 shadow flex items-center justify-between">
    <!-- Logo y título -->
    <div class="flex items-center gap-4">
      <img src="@/assets/logo-argolider.png" alt="Logo Argolider" class="h-10 w-auto" />
      <h1 class="text-xl sm:text-2xl font-semibold tracking-wide">
        Argolider <span class="font-light text-gray-300">| Gestión Inmobiliaria</span>
      </h1>
    </div>

    <!-- Navegación -->
    <nav class="hidden md:flex gap-4">
      <router-link
        to="/"
        class="px-4 py-2 rounded text-sm font-medium hover:bg-white hover:text-black transition"
        exact-active-class="bg-white text-black"
      >
        Nueva Ficha
      </router-link>
      <router-link
        to="/fichas"
        class="px-4 py-2 rounded text-sm font-medium hover:bg-white hover:text-black transition"
        exact-active-class="bg-white text-black"
      >
        Listado de Fichas
      </router-link>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'AppHeader'
}
</script>
