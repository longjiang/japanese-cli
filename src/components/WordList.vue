<template>
  <div>
    <ul
      :class="{
        wordlist: true,
        'list-unstyled': true,
        collapsed: collapse > 0
      }"
      data-collapse-target
    >
      <li class="wordlist-item" v-for="word in words">
        <Star v-if="word && star === true" :word="word" class="mr-1"></Star>
        <a
          v-if="compareWith"
          :href="`#/compare/edict/${compareWith.id},${word.id}`"
          class="btn btn-small mr-2"
          >Compare</a
        >
        <a v-if="word" :href="`#/dictionary/edict/${word.id}`">
          <span
            class="wordlist-item-word"
            data-level="outside"
            v-if="!highlight && word.kanji && word.kanji !== 'NULL'"
            >{{ word.kanji }}</span
          ><span
            class="wordlist-item-word"
            v-if="highlight && word.kanji && word.kanji !== 'NULL'"
            v-html="Helper.highlight(word.kanji, highlight, 'outside')"
          ></span
          ><span class="wordlist-item-word ml-1">{{ word.kana }}</span
          >&nbsp;
          <span v-if="word.english && word.english !== 'NULL'" class="wordlist-item-english">
            {{ word.english }}
          </span>
        </a>
      </li>
    </ul>
    <ShowMoreButton
      v-if="collapse > 0"
      :length="words.length"
      :min="collapse"
    />
  </div>
</template>
<script>
import Helper from '@/lib/helper'
export default {
  data() {
    return {
      Helper
    }
  },
  props: {
    words: {
      type: Array
    },
    compareWith: {
      default: false
    },
    traditional: {
      default: false
    },
    highlight: {
      default: false
    },
    collapse: {
      default: 0
    },
    star: {
      default: true
    },
    level: {
      default: false
    }
  }
}
</script>

<style>
.wordlist-item a {
  color: inherit;
}

.wordlist-item a:hover {
  text-decoration: none;
}

.wordlist-item-word {
  font-weight: bold;
  font-size: 1.4em;
}

.wordlist-item-english {
  font-style: italic;
  color: #aaa;
}
</style>
