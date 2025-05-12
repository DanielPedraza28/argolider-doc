<template>
  <div class="flex justify-center space-x-8 mb-10">
    <div
      v-for="(step, index) in steps"
      :key="index"
      class="flex items-center space-x-2 cursor-pointer"
      @click="$emit('cambiarPaso', index)"
    >
      <div
        :class="[
          'w-8 h-8 rounded-full flex items-center justify-center font-bold',
          currentStep === index ? 'bg-black text-white' : 'bg-gray-300 text-gray-700'
        ]"
      >
        {{ index + 1 }}
      </div>
      <span :class="currentStep === index ? 'text-black font-semibold' : 'text-gray-600'">
        {{ step }}
      </span>
      <div
        v-if="index < steps.length - 1"
        class="w-6 h-0.5 bg-gray-300"
      ></div>
    </div>
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
