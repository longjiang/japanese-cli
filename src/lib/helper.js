
import Config from '@/lib/config'

export default {
  loaderMessages: [],
  lastId: 0,
  async loaded(callback) {
    let loadedEDict = await window.EDictLoads
    let loadedHanzi = await window.hanziLoads
    let loadedUnihan = await window.unihanLoads
    callback(loadedEDict, loadedHanzi, loadedUnihan)
  },
  unescape(html) {
    return $('<div/>')
      .html(html)
      .text()
  },
  uniqueId() {
    this.lastId += 1
    return this.lastId
  },
  // json or plain text only, and returns object
  proxy(url, callback) {
    $.ajax(Config.proxy + '?' + url).done(function(response) {
      callback(response.data)
    })
  },
  // html only, and returns html
  scrape(url, callback) {
    $.ajax(Config.scrape + '?' + url).done(function(response) {
      // We use 'ownerDocument' so we don't load the images and scripts!
      // https://stackoverflow.com/questions/15113910/jquery-parse-html-without-loading-images
      var ownerDocument = document.implementation.createHTMLDocument('virtual')
      var $html = $(response, ownerDocument)
      var text = $html.find('a').text()
      callback($html, response, text)
    })
  },
  highlight(text, word, level = false) {
    let levelAttr = level ? ` data-level="${level}"` : ''
    if (text) {
      return text.replace(
        word,
        `<span ${levelAttr} class="highlight">${word}</span>`
      )
    }
  },
  highlightMultiple(text, words, level) {
    if (text && words && words.length > 0) {
      for (let word of words) {
        text = this.highlight(text, word, level)
      }
      return text
    } else {
      return text
    }
  },
  /* http://hackingui.com/front-end/a-pure-css-solution-for-multiline-text-truncation/ */
  ellipsizeTextBox(el) {
    var wordArray = el.innerHTML.split(' ')
    while (el.scrollHeight > el.offsetHeight) {
      wordArray.pop()
      el.innerHTML = wordArray.join(' ') + '...'
    }
  },
  saved(candidate) {
    return window.JapaneseZeroToHeroApp.$store.getters.hasSavedWord(candidate.id)
  },
  addSaved(candidate) {
    window.JapaneseZeroToHeroApp.$store.dispatch('addSavedWord', candidate.id)
  },
  removeSaved(candidate) {
    window.JapaneseZeroToHeroApp.$store.dispatch('removeSavedWord', candidate.id)
  },
  unique(names) {
    var uniqueNames = []
    $.each(names, function(i, el) {
      if ($.inArray(el, uniqueNames) === -1) uniqueNames.push(el)
    })
    return uniqueNames
  },
  randomArrayItem(array, start = 0, length = false) {
    length = length || array.length
    array = array.slice(start, length)
    let index = Math.floor(Math.random() * array.length)
    return array[index]
  },
  loaderMessage(message) {
    this.loaderMessages.push(message)
    console.log('loaderMessage()', message)
    if (this.loaderMessages.length > 4) {
      $('.loading-messages').html(
        `<b>10 more beats...</b><br>It gets faster next time.`
      )
    } else {
      $('.loading-messages').html(`${message}`)
    }
  },
  ucFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }
}
