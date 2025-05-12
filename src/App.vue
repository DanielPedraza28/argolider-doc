<template>
  <div class="flex flex-col bg-gray-50 text-black min-h-screen font-sans">
    <AppHeader />
    <AppTopNav />

    <main class="flex-grow overflow-y-auto">
      <div class="max-w-5xl mx-auto px-4">
        <router-view :key="$route.fullPath + reloadKey" />
      </div>
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
  },
  methods: {
    validarFormularioCompleto(data) {
      if (!data.numeroInterno || !data.nombrePropiedad || !data.tipo || !data.direccion || !data.ciudad) {
        alert('Por favor completa todos los campos obligatorios en Identificación')
        return false
      }

      const totalPorcentaje = data.nombrePropietarios?.reduce((sum, p) => sum + Number(p.porcentaje || 0), 0)
      if (totalPorcentaje > 100) {
        alert('La suma de los porcentajes de propietarios no puede superar el 100%.')
        return false
      }

      return true
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

html, body {
  margin: 0;
  padding: 0;
  min-height: 100%;
  font-family: 'Inter', sans-serif;
  background-color: #f9fafb;
}

#app {
  min-height: 100%;
}
</style>
