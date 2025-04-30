<template>
  <div class="min-h-screen flex flex-col bg-gray-50 text-black">
    <!-- Menú de navegación superior -->
    <header class="bg-black text-white px-6 py-4 flex justify-between items-center">
      <h1 class="text-xl font-bold">Argolider | Gestión Inmobiliaria</h1>
      <nav class="space-x-4">
        <router-link to="/" class="hover:underline">📋 Crear Ficha</router-link>
        <router-link to="/fichas" class="hover:underline">📁 Listado</router-link>
      </nav>
    </header>

    <main class="flex-grow p-4">
      <router-view />
    </main>

    <footer class="bg-black text-white text-center py-3 text-sm">
      © 2025 Argolider - Todos los derechos reservados
    </footer>
  </div>
</template>
