<template>
  <div class="flex items-center justify-center mb-10 overflow-x-auto">
    <ul class="flex space-x-6">
      <li
        v-for="(step, index) in steps"
        :key="index"
        class="flex items-center"
      >
        <div class="flex items-center">
          <div
            class="w-8 h-8 flex items-center justify-center rounded-full border-2 text-sm font-bold"
            :class="{
              'bg-black text-white border-black': currentStep === index,
              'bg-white text-gray-500 border-gray-300': currentStep !== index
            }"
          >
            {{ index + 1 }}
          </div>
          <span
            class="ml-2 text-sm font-medium"
            :class="currentStep === index ? 'text-black' : 'text-gray-500'"
          >
            {{ step }}
          </span>
        </div>
        <div
          v-if="index < steps.length - 1"
          class="w-6 h-px bg-gray-300 mx-3 hidden md:block"
        ></div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'AppNavigationTabs',
  props: {
    steps: Array,
    currentStep: Number
  }
}
</script>

<style scoped>
::-webkit-scrollbar {
  display: none;
}
</style>
