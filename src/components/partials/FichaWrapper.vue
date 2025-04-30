<template>
  <div class="bg-white border border-gray-300 rounded-xl shadow-lg p-8 mb-10">
    <h2 class="text-2xl font-bold mb-6 text-center text-black tracking-wide uppercase">
      {{ title }}
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'FichaWrapper',
  props: {
    title: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
/* Espacio para personalización adicional si lo necesitas */
</style>
