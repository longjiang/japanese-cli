<template>
  <font-awesome-icon
    icon="volume-up"
    class="focus-exclude speak"
    @click="speak(text)"
  />
</template>
<script>
export default {
  data() {
    return {}
  },
  props: ['text'],
  methods: {
    speak(text) {
      var utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'ja-JP'
      speechSynthesis.speak(utterance)
    }
  }
}
</script>

<style>
.speak {
  cursor: pointer;
  color: #aaa;
}

.speak:hover {
  color: inherit;
}
</style>
