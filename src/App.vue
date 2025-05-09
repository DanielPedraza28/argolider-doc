<template>
  <div class="flex flex-col bg-white text-black min-h-screen">
    <AppHeader />
    <AppTopNav />

    <main class="flex-grow overflow-y-auto">
      <router-view :key="$route.fullPath + reloadKey" />
    </main>

    <AppFooter />
  </div>
</template>

<script>
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
import AppTopNav from './components/layout/AppTopNav.vue'

export default {
  components: {
    AppHeader,
    AppTopNav,
    AppFooter
  },
  data() {
    return {
      reloadKey: ''
    }
  },
  watch: {
    $route(to, from) {
      const isVolverEditar = to.path.startsWith('/ficha/editar') && from.path.startsWith('/ficha/editar')
      const isVolverCrear = to.path === '/' && from.path === '/'
      if (isVolverEditar || isVolverCrear) {
        this.reloadKey = Date.now().toString()
      }
    }
  }
}
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden; /* evita scroll innecesario */
}

#app {
  height: 100%;
  overflow: hidden;
}
</style>
