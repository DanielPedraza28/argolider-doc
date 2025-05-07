<template>
  <section class="mb-10">
    <h3 class="text-xl font-bold mb-4 border-b pb-2">{{ titulo }}</h3>
    <slot>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="(campo, i) in campos" :key="i">
          <p class="text-sm text-gray-600 font-semibold">{{ campo[0] }}</p>
          <p class="text-gray-800">{{ campo[1] || '—' }}</p>
        </div>
      </div>
    </slot>
  </section>
</template>

<script>
export default {
  name: 'FichaSeccion',
  props: {
    titulo: String,
    campos: {
      type: Array,
      default: () => []
    }
  }
}
</script>
