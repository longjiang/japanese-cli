import Papa from 'papaparse'

export default {
  _csv: '../data/edict.tsv.txt',
  _data: [],
  load() {
    return new Promise(resolve => {
      Papa.parse(this._csv, {
        download: true,
        header: true,
        complete: results => {
          this._data = results.data.sort((a, b) =>
            a.kana && b.kana ? a.kana.length - b.kana.length : 0
          )
          let kyujitai = new Kyujitai(error => {
            this.kyujitai = kyujitai
            resolve(this)
          })
        }
      })
    })
  },
  unique(array) {
    var uniqueArray = []
    for (let i in array) {
      if (!uniqueArray.includes(array[i])) uniqueArray.push(array[i])
    }
    return uniqueArray
  },
  get(id) {
    let entry = this._data.find(row => row.id === id)
    entry.kyujitai = this.kyujitai.decode(entry.kanji)
    return entry
  },
  isChinese(text) {
    if (this.matchChinese(text)) return true
  },
  matchChinese(text) {
    return text.match(
      // eslint-disable-next-line no-irregular-whitespace
      /[\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u3005\u3007\u3021-\u3029\u3038-\u303B‌​\u3400-\u4DB5\u4E00-\u9FCC\uF900-\uFA6D\uFA70-\uFAD9]+/g
    )
  },
  randomArrayItem(array, start = 0, length = false) {
    length = length || array.length
    array = array.slice(start, length)
    let index = Math.floor(Math.random() * array.length)
    return array[index]
  },
  random() {
    return this.randomArrayItem(this._data)
  },
  lookupByCharacter(char) {
    return this._data.filter(row => row.kanji && row.kanji.includes(char))
  },
  lookupKana(kana) {
    const candidates = this._data.filter(row => {
      return row.kana === kana
    })
    return candidates
  },
  lookupByPattern(pattern) {
    // pattern like '～体'
    var results = []
    if (pattern.includes('～')) {
      const regexPattern = '^' + pattern.replace(/～/gi, '.+') + '$'
      const regex = new RegExp(regexPattern)
      results = this._data.filter(word => regex.test(word.kana))
    } else {
      results = this._data.filter(word => word.kana.includes(pattern))
    }
    return results
  },
  lookupFuzzy(text, limit = false) {
    text = text.trim()
    let results = []
    if (this.isChinese(text)) {
      results = this._data.filter(row => row.kanji && row.kanji.includes(text))
    } else {
      results = this._data.filter(row => {
        return (
          (row.kana && row.kana.includes(text)) ||
          (row.english && row.english.includes(text))
        )
      })
    }
    if (results) {
      if (limit) {
        results = results.slice(0, limit)
      }
      return results
    }
  }
}
