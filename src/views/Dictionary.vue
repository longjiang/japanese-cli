<template>
  <div class="main focus" v-cloak :key="'entry-' + entryKey">
    <div class="jumbotron jumbotron-fluid bg-white pt-5 pb-3 mb-0">
      <div class="container focus-exclude">
        <div class="row">
          <div class="col-sm-12">
            <div class="text-center">
              <h2 class="mb-4">For the love of Japanese words.</h2>
              <Loader ref="loader" class="mb-5" />
            </div>
            <SearchCompare :searchEntry="entry" class="mb-5" />
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="saved()"
      class="jumbotron jumbotron-fluid pt-3 pb-3 bg-secondary"
    >
      <div class="container focus-exclude text-center text-light">
        <Paginator
          :items="$store.state.savedWords"
          :findCurrent="item => item.join(',').replace(/ /g, '_') === entry.id"
          :url="
            item => `#/dictionary/EDict/${item.join(',').replace(/ /g, '_')}`
          "
          title="Saved Words"
        />
      </div>
    </div>
    <div v-if="entry">
      <div class="text-center">
        <Loader class="mt-5" />
      </div>
      <div class="container mb-4">
        <div class="row">
          <div class="col-sm-12 text-center">
            <EntryHeader :entry="entry"></EntryHeader>
            <DefinitionsList
              class="mt-4"
              :definitions="[entry.english]"
            ></DefinitionsList>
          </div>
        </div>
      </div>

      <!-- <EntryDisambiguation> already finds some pretty good suggestions. -->
      <!-- <EntryRelated class="mb-5" :entry="entry"></EntryRelated> -->

      <div class="container">
        <div class="row">
          <div class="col-sm-12">
            <EntryCharacters
              v-if="entry.kanji"
              class="mb-4"
              :text="entry.kanji"
              :pinyin="entry.kana"
            ></EntryCharacters>

            <WebImages
              class="mt-5"
              :text="entry.kanji"
              :entry="entry"
              limit="10"
            ></WebImages>

            <Collocations
              class="mt-5 mb-5"
              :text="entry.kanji"
              :level="entry.level"
            ></Collocations>
            <Concordance
              class="mt-5 mb-5"
              :text="entry.kanji"
              :level="entry.level"
            ></Concordance>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-6">
            <Korean
              v-if="entry.kanji && entry.kanji !== 'NULL'"
              class="mb-5"
              :text="entry.kyujitai"
            />
          </div>
          <div class="col-sm-6">
            <Chinese
              v-if="entry.kanji && entry.kanji !== 'NULL'"
              class="mb-5"
              :text="entry.kyujitai"
            />
          </div>
        </div>
      </div>
      <!-- <InstagramButton :entry="entry" class="mb-5"></InstagramButton> -->
    </div>
  </div>
</template>

<script>
import EntryCharacters from '@/components/EntryCharacters.vue'
import EntryDisambiguation from '@/components/EntryDisambiguation.vue'
import Concordance from '@/components/Concordance.vue'
import Collocations from '@/components/Collocations.vue'
import EntryHeader from '@/components/EntryHeader.vue'
import WebImages from '@/components/WebImages.vue'
import SearchCompare from '@/components/SearchCompare.vue'
import DefinitionsList from '@/components/DefinitionsList'
import Korean from '@/components/Korean'
import Chinese from '@/components/Chinese'
import Paginator from '@/components/Paginator'
import Helper from '@/lib/helper'

export default {
  components: {
    SearchCompare,
    EntryCharacters,
    EntryDisambiguation,
    Collocations,
    Concordance,
    EntryHeader,
    DefinitionsList,
    Paginator,
    Korean,
    Chinese,
    WebImages
  },
  props: {
    method: {
      type: String
    },
    args: {
      type: String
    }
  },
  data() {
    return {
      entry: undefined,
      characters: [],
      character: {},
      unsplashSrcs: [],
      unsplashSearchTerm: '',
      entryKey: 0 // used to force re-render this component
    }
  },
  methods: {
    saved() {
      return false
      // return this.entry && this.$store.getters.hasSavedWord(this.entry.id)
    },
    show(entry) {
      this.entryKey += 1
      this.entry = entry
      document.title = `${entry.kanji} - ${
        entry.english
      } | Japanese Zero to Hero`
    },
    route() {
      $('#japanesezerotohero')[0].scrollIntoView()
      if (this.method && this.args) {
        if (this.method === 'edict') {
          if (this.args === 'random') {
            this.random()
          } else {
            Helper.loaded(LoadedEDict => {
              let entry = LoadedEDict.get(this.args)
              this.show(entry)
            })
          }
        } else {
          if (!this.entry) {
            this.random()
          }
        }
      }
    },
    random() {
      Helper.loaded(LoadedEDict => {
        let entry = LoadedEDict.random()
        location.hash = `/dictionary/edict/${entry.id}`
      })
    }
  },
  watch: {
    $route() {
      if (this.$route.name === 'dictionary') {
        this.route()
      }
    }
  },
  mounted() {
    if (this.$route.name === 'dictionary') {
      this.route()
    }
  }
}
</script>

<style></style>
