angular.module('starter.services', [])

.factory('Texts', function ($rootScope, $http, $sce) {
  var getTextsData = function (success, failed) {
    if ($rootScope.textsData === undefined) {
      $http.get('js/texts_data.js')
        .then(function (response) {
          $rootScope.textsData = response.data
          texts = getTexts(response.data)
          success(texts)
        }, function (response) {
          failed(response.data)
        })
    } else {
      success($rootScope.textsData)
    }
  }

  var getTexts = function (textsData) {
    var texts = []
    textsData.forEach(function (d) {
      if (texts.filter(function (t) {
        return t.textId == d.textId && t.textPart == d.textPart
      }).length === 0) {
        texts.push({
          textId: d.textId,
          textTitle: d.textTitle,
          textPart: d.textPart
        })
      }
    })
    return texts
  }

  var get = function (textId, textPart, success, failed) {
    var sentences = $rootScope.textsData.filter(function (text) {
      return text.textId == textId && text.textPart == textPart
    })
    sentences.map(function (s) {
      s.mp3 = '/mp3/' + s.textId + '_' +
        s.textPart + '_' + s.sentenceId + '.mp3'
      $sce.trustAsResourceUrl(s.mp3)
      return s
    })
    success(sentences)
  }

  return {
    all: function (success, failed) {
      getTextsData(success, failed)
    },
    get: function (textId, textPart, success, failed) {
      getTextsData(function () {
        get(textId, textPart, success, failed)
      }, failed)
    }
  }
})
