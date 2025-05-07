<template>
  <div class="flex flex-col bg-white text-black min-h-screen">
    <AppHeader />
    <AppTopNav />

    <main class="flex-grow overflow-y-auto">
      <router-view />
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
