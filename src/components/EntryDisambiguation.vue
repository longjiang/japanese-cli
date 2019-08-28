<template>
  <div>
    <div v-if="similarWords.length > 0">
      <div class="widget-title">Compare with</div>
      <div class="jumbotron-fluid bg-light p-4">
        <WordList
          collapse="10"
          :words="similarWords"
          :compareWith="entry"
          :key="wordsKey"
          :traditional="entry.simplified.length === 1"
        ></WordList>
        <hr/>
        <div class="text-center">
          <a
            class="btn show-more focus-exclude"
            :href="`#/explore/related/${entry.identifier}`"
            :data-bg-hsk="entry.hsk"
          >
            <i class="glyphicon glyphicon-fullscreen"></i> Explore Related Words
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import WordList from '@/components/WordList.vue'
import Helper from '@/lib/helper'

export default {
  components: {
    WordList
  },
  props: ['entry'],
  mounted() {
    
  },
  watch: {
    similarWords() {
      this.wordsKey++
    }
  },
  data() {
    return {
      wordsKey: 0,
      similarWords: []
    }
  },
  methods: {
  }
}
</script>
