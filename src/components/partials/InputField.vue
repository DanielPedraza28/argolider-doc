<template>
  <div class="flex flex-col">
    <label :for="label" class="text-sm font-medium text-gray-700 mb-1">{{ label }}</label>
    <input
      :type="type"
      :id="label"
      :placeholder="placeholder"
      :value="internalValue"
      @input="updateValue($event.target.value)"
      class="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
    />
  </div>
</template>

<script>
export default {
  props: {
    modelValue: [String, Number],
    label: String,
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  computed: {
    internalValue() {
      return this.modelValue;
    }
  },
  methods: {
    updateValue(value) {
      this.$emit('update:modelValue', value);
    }
  }
};
</script>
