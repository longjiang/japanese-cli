import Helper from './helper'
import Config from './config'
import SketchEngine from './sketch-engine'

export default {
  corpra: [
    {
      language: 'Japanese',
      name: 'Japanese Web 2011 (jaTenTen11)',
      words: 8432256578,
      code: 'jptenten11_suw_comainu_v2',
      note: 'Featured.'
    },
    {
      language: 'Japanese',
      name: 'CHILDES Japanese Corpus',
      words: 1578068,
      code: 'childes_jpn',
      note: 'Spoken.'
    },
    {
      language: 'Japanese',
      name: 'Japanese Web (jpWaC)',
      words: 336867039,
      code: 'jpwac2',
      note: 'Web.'
    },
    {
      language: 'Japanese',
      name: 'Japanese Web 2011 (jaTenTen11, sample)',
      words: 301407652,
      code: 'jptenten11_suw_comainu_v2_sample',
      note: 'Web.'
    },
    {
      language: 'Japanese',
      name: 'Japanese Web 2011 sample (jaTenTen11, LUW)',
      words: 163837671,
      code: 'jptenten11_luw_sample',
      note: 'Web.'
    },
    {
      language: 'Japanese',
      name: 'OPUS2 Japanese',
      words: 5455106,
      code: 'opus2_ja',
      note: 'Parallel. That means <b>English translation</b> is available.'
    }
  ],
  corpname() {
    return localStorage.getItem('jzhCorpname') || 'jptenten11_suw_comainu_v2'
  },
  collocationDescription(word) {
    return {
      'noun/noun': `noun/noun`,
      suffix: `suffix`,
      particle: `particle`,
      pronomの: `pronomの`,
      のpronom: `のpronom`,
      をverb: `をverb`,

      にverb: `にverb`,
      はverb: `はverb`,
      がverb: `がverb`,
      modifier_Ana: `modifier_Ana`,
      coord: `coord`,
      をverbする: `をverbする`,

      がverbする: `がverbする`,
      とverb: `とverb`,
      Adn: `Adn`,
      modifier_Ai: `modifier_Ai`,
      はverbする: `はverbする`,
      prefix: `prefix`,

      へのpronom: `へのpronom`,
      でverb: `でverb`,
      にverbする: `にverbする`,
      'modifier_N-Ana': `modifier_N-Ana`,
      'N-Ana_modifies_N': `N-Ana_modifies_N`,
      へverb: `へverb`,

      modifier_Ano: `modifier_Ano`,
      'modifier_N-Ai': `Ai`,
      'N-Ai_modifies_N': `N-Ai_modifies_N`,
      がAdj_cont: `がAdj_cont`,
      からverb: `からverb`,
      pronomとの: `pronomとの`,

      とverbする: `とverbする`,
      pronomへの: `pronomへの`,
      'のAi+N': `のAi+N`,
      pronomでの: `pronomでの`,
      // NがのAi: `NがのAi`, // For some reason this Gramrel type does not have Word.cm
      // 'Ai+1': `Ai+1`, // For some reason this Gramrel type does not have Word.cm

      でverbする: `でverbする`,
      pronomからの: `pronomからの`,
      // 'N+Ai+N': `N+Ai+N`, // For some reason this Gramrel type does not have Word.cm
      '-N-のAi+N': `-N-のAi+N`,
      とのpronom: `とのpronom`,
      がAdj_concl: `がAdj_concl`,

      はAdj_concl: `はAdj_concl`,
      からverbする: `からverbする`,
      'がAi+N': `がAi+N`,
      '-N-がAi+N': `-N-がAi+N`,
      // 'NがのAi+1': `NがのAi+1`, // For some reason this Gramrel type does not have Word.cm
      からのpronom: `からのpronom`,

      modifier_Adj的: `modifier_Adj的`,
      'Ai+2': `Ai+2`,
      '2+Ai': `2+Ai`
    }
  },
  wsketch(term, callback) {
    $.getJSON(
      `${
        Config.sketchEngineProxy
      }?https://api.sketchengine.eu/bonito/run.cgi/wsketch?corpname=preloaded/${this.corpname()}&lemma=${term}`,
      function(response) {
        if (response.data.Gramrels && response.data.Gramrels.length > 0) {
          for (let Gramrel of response.data.Gramrels) {
            Gramrel.Words = Gramrel.Words.filter(Word => Word.cm !== '')
            for (let Word of Gramrel.Words) {
              if (Word.cm) {
                Word.cm = Word.cm.replace(/-\w( ?)/gi, '')
              }
            }
          }
        }
        callback(response.data)
      }
    )
  },
  concordance(term, callback) {
    let parallel = this.corpname().startsWith('opus')
    let requestJSON = parallel
      ? `{"attrs":"word","structs":"s,g","refs":"=doc.subcorpus","ctxattrs":"word","viewmode":"align","usesubcorp":"","freqml":[{"attr":"word","ctx":"0","base":"kwic"}],"fromp":1,"pagesize":1000,"concordance_query":[{"queryselector":"iqueryrow","sel_aligned":["opus2_en"],"cql":"","iquery":"${term}","queryselector_opus2_en":"iqueryrow","iquery_opus2_en":"","pcq_pos_neg_opus2_en":"pos","filter_nonempty_opus2_en":"on"}]}`
      : `{"lpos":"","wpos":"","default_attr":"word","attrs":"word","refs":"=doc.website","ctxattrs":"word","attr_allpos":"all","usesubcorp":"","viewmode":"kwic","cup_hl":"q","cup_err":"true","cup_corr":"","cup_err_code":"true","structs":"s,g","gdex_enabled":0,"fromp":1,"pagesize":50,"concordance_query":[{"queryselector":"iqueryrow","iquery":"${term}"}],"kwicleftctx":"100#","kwicrightctx":"100#"}`
    $.post(
      `${
        Config.sketchEngineProxy
      }?https://app.sketchengine.eu/bonito/run.cgi/concordance?corpname=preloaded/${this.corpname()}`,
      {
        json: requestJSON
      },
      function(response) {
        try {
          const data = JSON.parse(response).data
          var result = []
          for (let Line of data.Lines.slice(0, 500)) {
            let line =
              Line.Left.map(item => (item ? item.str : '')).join('') +
              Line.Kwic[0].str +
              Line.Right.map(item => (item ? item.str : '')).join(' ')
            line = line.replace(/ ([,.])/g, '$1')
            if (line.length > term.length + 4) {
              let parallelLine = {
                japanese: line
              }
              if (Line.Align && Line.Align[0].Kwic) {
                parallelLine.english = Line.Align[0].Kwic.map(
                  kwic => kwic.str
                ).reduce((english, kwic) => english + ' ' + kwic)
              }
              result.push(parallelLine)
            }
          }
          result = result.sort(function(a, b) {
            return a.japanese.length - b.japanese.length
          })
          callback(Helper.unique(result))
        } catch (err) {
          throw 'Concordance did not return any data.'
        }
      }
    )
  },
  thesaurus(term, callback) {
    $.post(
      `${
        Config.sketchEngineProxy
      }?https://app.sketchengine.eu/bonito/run.cgi/thes?corpname=preloaded/${this.corpname()}`,
      {
        lemma: term,
        lpos: '',
        clusteritems: 0,
        maxthesitems: 100,
        minthesscore: 0,
        minsim: 0.3
      },
      function(response) {
        let data = {}
        try {
          data = JSON.parse(response).data
        } catch (err) {
          throw 'Error in thesaurus'
        }
        callback(data)
      }
    )
  },
  mistakes(term, callback) {
    $.post(
      `${Config.sketchEngineProxy}?https://app.sketchengine.eu/bonito/run.cgi/concordance?corpname=preloaded/guangwai`,
      {
        json: JSON.stringify({
          lpos: '',
          wpos: '',
          default_attr: 'word',
          attrs: 'word',
          refs: SketchEngine.mistakeRefKeys.join(','),
          ctxattrs: 'word',
          attr_allpos: 'all',
          usesubcorp: '',
          viewmode: 'kwic',
          cup_hl: 'q',
          cup_err: '',
          cup_corr: '',
          cup_err_code: '',
          structs: 's,g',
          gdex_enabled: 0,
          fromp: 1,
          pagesize: 50,
          concordance_query: [
            {
              queryselector: 'iqueryrow',
              iquery: term,
              'sca_err.level': ['col', 'form', 'mean', 'orth', 'punct'],
              'sca_err.type': ['anom', 'incl', 'omit', 'wo']
            }
          ],
          kwicleftctx: '100#',
          kwicrightctx: '100#'
        })
      },
      function(response) {
        const data = JSON.parse(response).data
        let results = []
        for (let Line of data.Lines) {
          try {
            const ml = Line.Left.map(function(item) {
              return item.str || item.strc
            })
              .join('')
              .match(/(.*)<s>([^<s>]*?)$/)
            const left = ml[2]
            const leftContext = ml[1].replace(/<s>/g, '').replace(/<\/s>/g, '')
            let mr = Line.Right.map(function(item) {
              return item.str || item.strc
            })
              .join('')
              .match(/^([^</s>]*)<\/s>(.*)/)
            const right = mr[1]
            const rightContext = mr[2].replace(/<s>/g, '').replace(/<\/s>/g, '')
            var refs = {}
            for (let i in Line.Refs) {
              refs[SketchEngine.mistakeRefKeys[i]] = Line.Refs[i]
            }
            const country = refs['=text.id'].replace(
              /^[^_]*_[^_]*_[^_]*_[^_]*_([^_]*).*/g,
              '$1'
            )
            results.push({
              left: left,
              right: right,
              leftContext: leftContext,
              rightContext: rightContext,
              text: left + term + right,
              country: Helper.country(country),
              refs: refs,
              proficiency: SketchEngine.proficiency[refs['=u.proficiency']],
              errorType: SketchEngine.errors[refs['=err.type']],
              errorLevel: SketchEngine.errors[refs['=err.level']],
              l1: refs['=u.l1']
            })
          } catch (err) {
            console.log(err)
          }
        }
        results = results.sort(function(a, b) {
          return a.text.length - b.text.length
        })
        callback(results)
      }
    )
  }
}
