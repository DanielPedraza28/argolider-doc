<template>
  <div class="min-h-screen flex flex-col bg-white text-black">
    <AppHeader />
    
    <main class="flex-grow p-4">
      <router-view />
    </main>

    <AppFooter />
  </div>
</template>

<script>
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'

export default {
  components: {
    AppHeader,
    AppFooter
  }
}
</script>

<style>
/* ❌ Elimina cualquier scoped o estilo local que esté dando conflicto */
</style>
