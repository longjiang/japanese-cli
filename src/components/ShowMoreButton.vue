<template>
  <button
    v-if="visible()"
    class="show-more btn-medium btn-gray collapsed focus-exclude"
    v-on:click="showMoreClick"
  >
    <span class="label-expand">
      <slot>Show {{ count() }} More</slot>
    </span>
    <span class="label-collapse">Collapse</span>
  </button>
</template>

<script>

export default {
  props: {
    length: {
      default: false
    },
    min: {
      default: false
    }
  },
  methods: {
    showMoreClick(e) {
      var $button = $(e.currentTarget)
      $button.siblings('[data-collapse-target]').toggleClass('collapsed')
      $button.toggleClass('collapsed')
    },
    count() {
      if (this.length) {
        return this.length - this.min
      } else {
        return ''
      }
    },
    visible() {
      if (!this.length) {
        return true
      } else if (this.min < this.length) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>
