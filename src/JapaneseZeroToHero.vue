<template>
  <div id="japanesezerotohero">
    <div class="container-fluid bg-dark pt-4 pl-0 pr-0">
      <div class="container">
        <div class="row">
          <div class="col-sm-12 text-center">
            <router-link to="/"
              ><img
                src="/img/logo-ja-zth-light.png"
                alt="Japanese Zero to Hero"
                class="logo"
            /></router-link>
          </div>
        </div>
        <div class="row mt-3" v-cloak>
          <div class="col-sm-12">
            <Nav />
          </div>
        </div>
      </div>
    </div>
    <SubNav class="pt-4" />
    <keep-alive>
      <router-view ref="routerView" />
    </keep-alive>

    <footer class="container-fluid bg-dark text-light pt-4 pb-4">
      <div class="container">
        <div class="row">
          <div class="col-sm-12">
            <div class="zerotohero">
              <a
                v-for="language in languages"
                :href="language.url"
                target="_blank"
                class="mr-4"
                ><img
                  :src="
                    `${Config.server}img/logo-${language.code}-zth-light.png`
                  "
                  :alt="`${language.name} Zero to Hero`"
                  class="logo-footer"
              /></a>
            </div>
            <hr class="border-light mt-0" style="opacity: 0.5" />
            <p>
              <b>Zero to Hero Education, Canada.</b>
            </p>
            <p>
              <b>Credits:</b> Japanese-English dictionary data from Joe Speigle's
              open-source project
              <a href="https://github.com/garfieldnate/edict">edict</a>.
            </p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import Config from '@/lib/config'
import Helper from '@/lib/helper'
import EDict from '@/lib/edict'
import Hanzi from '@/lib/hanzi'
import Unihan from '@/lib/unihan'
import Nav from '@/components/Nav'
import SubNav from '@/components/SubNav'

export default {
  components: {
    Nav,
    SubNav
  },
  data() {
    return {
      languages: [],
      Config
    }
  },
  beforeMount() {
    $.getJSON(`${Config.server}data/languages.json`, response => {
      this.languages = response
    })
    window.EDictLoads = EDict.load()
    window.hanziLoads = Hanzi.load()
    window.unihanLoads = Unihan.load()
  },
  mounted() {
    Helper.loaderMessage('App mounted.')
    window.JapaneseZeroToHeroApp = this
    Helper.loaded(LoadedEdict => {
      this.loaded = true
      window.EDict = LoadedEdict
    })
  }
}
</script>

<style>
.logo {
  height: 6rem;
}
.logo-footer {
  height: 4rem;
  margin-bottom: 2rem;
}
</style>
