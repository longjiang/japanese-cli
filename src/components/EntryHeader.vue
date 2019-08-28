<template>
  <!-- ANCHOR img/anchors/entry.png  -->
  <div class="entry-head-wrapper" v-if="entry">
    <div>
      <div class="entry-word-wrapper" style="display:inline-block">
        <div class="mb-2">
          <Star :word="entry"></Star>
          <Speak class="ml-1" :text="entry.kana" />
        </div>
        <div v-if="entry.kana && entry.kana !== 'NULL'" class="mt-1">
          <span class="ml-2 entry-kanji">{{ entry.kana }}</span>
        </div>
        <div v-if="entry.kanji && entry.kanji !== 'NULL'">
          <a :href="`#/dictionary/EDict/${entry.id}`">
            <span class="entry-word" data-level="outside">{{
              entry.kanji
            }}</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Helper from '@/lib/helper'

export default {
  props: {
    entry: {
      type: Object
    },
    minimal: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      Helper
    }
  }
}
</script>

<style lang="scss">
.entry-pinyin {
  font-size: 1.1rem;
}

.entry-word {
  font-size: 3rem;
  font-weight: bold;
  line-height: 1;
  margin: 0.5rem 0;
}

.entry-kanji {
  font-size: 1.5rem;
}

@media (max-width: 768px) {
  .entry-word {
    font-size: 3rem;
  }
}

.entry-word img {
  width: 4.8rem;
  border: 1px solid #ccc;
}

.entry-word-wrapper a {
  color: inherit;
  text-decoration: inherit;
}

.entry-head-wrapper {
  position: relative;
}
</style>
