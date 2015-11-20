// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

'use strict'

angular.module('ionic.utils', []).factory('$localStorage', ['$window', function ($window) {
  return {
    set: function set (key, value) {
      $window.localStorage[key] = value
    },
    get: function get (key, defaultValue) {
      return $window.localStorage[key] || defaultValue
    },
    setObject: function setObject (key, value) {
      $window.localStorage[key] = JSON.stringify(value)
    },
    getObject: function getObject (key) {
      return JSON.parse($window.localStorage[key] || '{}')
    }
  }
}])

angular.module('starter', ['ionic', 'ionic.utils'])
.controller('MainController', function ($scope, $ionicModal, $localStorage) {
  $scope.initGame = function (event) {
    var quizStats = {
      'points': 0,
      'roundDuration': 4,
      'level': 1
    }

    // Prevent the click on loseModal btn to start new game from triggering the startTimer listener
    if (event) {
      event.stopPropagation()
    }

    var quizWord = document.querySelector('#quizWord')
    var quizWordList = ['red', 'yellow', 'green', 'blue']
    var rainbowList = ['red', 'yellow', 'orange', 'green', 'blue', 'purple', 'pink']
    var btnDisplay = document.querySelector('#btnList')
    var answerBtn
    var quizPointsDisplay = document.querySelector('#quizPoints')
    var countdown = null

    // Instance of ES6 Destructuring
    var timeLeft = quizStats.roundDuration
    var quizLevel = quizStats.level
    // var timeLeft = quizStats.roundDuration
    // var quizLevel = quizStats.level

    var highscore = $localStorage.get('highscore') || null
    var timerBar = document.querySelector('#timerBar')
    var levelDisplay = document.querySelector('#levelDisplay')
    var countdownSpeed = 0.05
    var countdownAdd = 1
    var quizWordColour
    var isRainbowRound = false
    var btnOrder
    var previousQuizWord = null

    var splashscreen = document.querySelector('.splashscreen')

    var gameOver = document.querySelector('.gameOver')

    // Reset Displays
    quizPointsDisplay.textContent = 0
    updateTimerBar()
    levelDisplay.textContent = quizLevel

    function startSplashscreen () {
      splashscreen.addEventListener('click', removeSplashscreen, false)
      startNewRound()
    }

    function removeSplashscreen () {
      splashscreen.removeEventListener('click')
      splashscreen.classList.add('vanishFast')
      splashscreen.addEventListener('animationend', function () {
        splashscreen.classList.remove('vanishFast')
        splashscreen.parentNode.removeChild(splashscreen)
        console.log('Splashscreen vanished')
      })
    }

    function startNewRound () {
      // Set a random colour and colour name to quizWord
      generateQuizword()
      console.log('NEW ROUND | ' + quizWord.textContent + ' set to ' + quizWord.style.color)

      // Shuffle the buttons up, clear the window, then add them to btnDisplay
      isRainbowRound ? btnOrder = shuffle(rainbowList) : btnOrder = shuffle(quizWordList)
      btnDisplay.innerHTML = ''
      btnOrder.forEach(createBtn)
      function createBtn (colourClass) {
        var btn = document.createElement('button')
        btn.classList.add('button', 'button-' + colourClass)
        btnDisplay.appendChild(btn)
      }

      answerBtn = findBtnMatch(quizWord)

      btnDisplay.addEventListener('click', checkAnswer, false)

      // Helper Functions for startNewRound
      function shuffle (array) {
        var currentIndex = array.length, temporaryValue, randomIndex
        // While there remain elements to shuffle...
        while (currentIndex !== 0) {
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex)
          currentIndex -= 1
          // And swap it with the current element.
          temporaryValue = array[currentIndex]
          array[currentIndex] = array[randomIndex]
          array[randomIndex] = temporaryValue
        }
        return array
      }

      function generateQuizword () {
        if (quizLevel >= 3 && !isRainbowRound) {
          quizWordColour = quizWordList[Math.floor(Math.random() * quizWordList.length)]
        } else if (isRainbowRound) {
          quizWordColour = rainbowList[Math.floor(Math.random() * rainbowList.length)]
        } else {
          var colour = Math.floor(Math.random() * 4815162342).toString(16)
          quizWordColour = '#' + ('000000' + colour).slice(-6)
        }
        quizWord.style.color = quizWordColour
        isRainbowRound ? quizWord.textContent = rainbowList[Math.floor(Math.random() * rainbowList.length)] : quizWord.textContent = quizWordList[Math.floor(Math.random() * quizWordList.length)]
        if (quizWord.style.color === quizWord.textContent || previousQuizWord === quizWord.textContent) {
          generateQuizword()
        }
        previousQuizWord = quizWord.textContent
      }
    }

    function findBtnMatch (quizWord) {
      switch (quizWord.textContent) {
        case 'red':
          answerBtn = document.querySelector('.button-red')
          break
        case 'yellow':
          answerBtn = document.querySelector('.button-yellow')
          break
        case 'green':
          answerBtn = document.querySelector('.button-green')
          break
        case 'blue':
          answerBtn = document.querySelector('.button-blue')
          break
        case 'orange':
          answerBtn = document.querySelector('.button-orange')
          break
        case 'pink':
          answerBtn = document.querySelector('.button-pink')
          break
        case 'purple':
          answerBtn = document.querySelector('.button-purple')
          break
        default:
          break
      }
      console.log('Answer: ')
      console.log(answerBtn)
      return answerBtn
    }

    function checkAnswer (event) {
      var btnClicked = event.target
      console.log('Button clicked: ')
      console.log(btnClicked)
      if (btnClicked.classList[0] !== 'button') {
        return
      }
      if (btnClicked === answerBtn) {
        isRainbowRound ? quizStats.points += 7 : quizStats.points += 1
        quizPointsDisplay.textContent = quizStats.points

        // reset to isRainbowRound flag must come before determineLevel when flag is determined again
        isRainbowRound = false

        timeLeft += countdownAdd
        if (timeLeft >= 8) {
          timeLeft = 8
        }
        updateTimerBar()
        console.log('WIN')

        determineLevel()

        resetRound()
        startNewRound()
      } else {
        console.log('LOSE')
        stopGame()
      }
    }

    function determineLevel () {
      function flipCoin () {
        return Math.floor(Math.random() * 2)
      }
      switch (quizStats.points) {
        case 10:
          console.log('Level 2')
          quizLevel = 2
          countdownSpeed = 0.06
          countdownAdd = 1.4
          levelDisplay.textContent = quizLevel
          flipCoin() === 1 ? isRainbowRound = true : isRainbowRound = false
          console.log('isRainbowRound ' + isRainbowRound)
          break
        case 20:
          console.log('Level 3')
          quizLevel = 3
          countdownSpeed = 0.07
          countdownAdd = 1.4
          levelDisplay.textContent = quizLevel
          flipCoin() === 1 ? isRainbowRound = true : isRainbowRound = false
          console.log('isRainbowRound ' + isRainbowRound)
          break
        case 30:
          console.log('Level 4')
          quizLevel = 4
          countdownSpeed = 0.08
          countdownAdd = 1.4
          levelDisplay.textContent = quizLevel
          flipCoin() === 1 ? isRainbowRound = true : isRainbowRound = false
          console.log('isRainbowRound ' + isRainbowRound)
          break
        case 40:
          console.log('Level 5')
          quizLevel = 5
          countdownSpeed = 0.09
          countdownAdd = 1.6
          levelDisplay.textContent = quizLevel
          flipCoin() === 1 ? isRainbowRound = true : isRainbowRound = false
          console.log('isRainbowRound ' + isRainbowRound)
          break
        case 50:
          console.log('Level 6')
          quizLevel = 6
          countdownSpeed = 0.09
          countdownAdd = 1.6
          levelDisplay.textContent = quizLevel
          flipCoin() === 1 ? isRainbowRound = true : isRainbowRound = false
          console.log('isRainbowRound ' + isRainbowRound)
          break
        case 60:
          console.log('Level 7')
          quizLevel = 7
          countdownSpeed = 0.1
          countdownAdd = 1.8
          levelDisplay.textContent = quizLevel
          flipCoin() === 1 ? isRainbowRound = true : isRainbowRound = false
          console.log('isRainbowRound ' + isRainbowRound)
          break
        case 70:
          console.log('Level 8')
          quizLevel = 8
          countdownSpeed = 0.11
          countdownAdd = 1.9
          levelDisplay.textContent = quizLevel
          flipCoin() === 1 ? isRainbowRound = true : isRainbowRound = false
          console.log('isRainbowRound ' + isRainbowRound)
          break
        case 80:
          console.log('Level 9')
          quizLevel = 9
          countdownSpeed = 0.12
          countdownAdd = 2
          levelDisplay.textContent = quizLevel
          flipCoin() === 1 ? isRainbowRound = true : isRainbowRound = false
          console.log('isRainbowRound ' + isRainbowRound)
          break
        default:
          break
      }
    }

    function checkHighscore () {
      if (highscore !== null) {
        if (quizStats.points > highscore) {
          $localStorage.set('highscore', quizStats.points)
          console.log('NEW HIGHSCORE ' + highscore + ' Your score: ' + quizStats.points)
          document.querySelector('#loseModalHighscoreLabel').textContent = 'NEW HIGHSCORE'
        } else {
          console.log('NO NEW HIGHSCORE ' + highscore + ' Your score: ' + quizStats.points)
        }
      } else {
        $localStorage.set('highscore', quizStats.points)
        console.log('FIRST HIGHSCORE EVER! ' + highscore + ' Your score: ' + quizStats.points)
        document.querySelector('#loseModalHighscoreLabel').textContent = 'FIRST HIGHSCORE'
      }
      highscore = $localStorage.get('highscore')
      document.querySelector('#loseModalHighscore').textContent = highscore
    }

    function stopGame () {
      // since i only know how to make the lose modal show on ng-click,
      // create an invisible losePixel that I trigger a click on to show lose modal
      document.querySelector('body').removeEventListener('click', startTimer)
      stopTimer()
      gameOver.classList.add('appearFast', 'becomeVisible')
      checkHighscore()
      document.querySelector('#loseModalScore b').textContent = quizStats.points
      // var losePixel = document.querySelector('#losePixel')
      // angular.element(losePixel).triggerHandler('click')
      gameOver.addEventListener('animationend', function () {
        gameOver.addEventListener('click', hideGameOver)
        console.log ('Adding event listener to hideGameOver')
      })
    }

    function hideGameOver () {
      gameOver.classList.remove('appearFast', 'becomeVisible')
      gameOver.removeEventListener('click', hideGameOver)
      // gameOver.addEventListener('animationend', function () {
      //   gameOver.classList.remove('vanishFast')
      //   console.log('Hiding Game Over Modal')
      // })
      resetRound()
      resetGame()
      startNewRound()
    }

    function resetRound () {
      btnDisplay.removeEventListener('click', checkAnswer, false)
    }

    function roundTimer () {
      timeLeft -= countdownSpeed
      if (timeLeft <= 0) {
        console.log('Out of time!')
        resetRound()
        timeLeft = 0
        timerBar.addEventListener('transitionend', window.setTimeout(stopGame, 750), true)
        return
      }
      updateTimerBar()
    }

    function updateTimerBar () {
      // Still Need to figure out how to make the timer bar FLASH when player receives additional time (ie. timeLeft++ )
      if (timerBar.value < timeLeft) {
        console.log(timeLeft)
        timerBar.classList.add('whitebg')
        timerBar.addEventListener('transitionend', function () {
          timerBar.classList.remove('whitebg')
        })
      }
      timerBar.value = timeLeft
      // console.log('Setting timer bar value to '+timeLeft)
    }

    function startTimer () {
      btnDisplay.removeEventListener('click', startTimer)
      countdown = setInterval(roundTimer, 50)
    }

    function stopTimer () {
      clearInterval(countdown)
    }

    function resetGame () {
      quizStats = {
        'points': 0,
        'roundDuration': 4,
        'level': 1
      }

      quizWord = document.querySelector('#quizWord')
      quizWordList = ['red', 'yellow', 'green', 'blue']
      rainbowList = ['red', 'yellow', 'orange', 'green', 'blue', 'purple', 'pink']
      btnDisplay = document.querySelector('#btnList')
      answerBtn = null
      quizPointsDisplay = document.querySelector('#quizPoints')
      countdown = null

      // Instance of ES6 Destructuring
      timeLeft = quizStats.roundDuration
      quizLevel = quizStats.level
      // var timeLeft = quizStats.roundDuration
      // var quizLevel = quizStats.level

      highscore = $localStorage.get('highscore') || null
      timerBar = document.querySelector('#timerBar')
      levelDisplay = document.querySelector('#levelDisplay')
      countdownSpeed = 0.05
      countdownAdd = 1
      quizWordColour = null
      isRainbowRound = false
      btnOrder = null
      previousQuizWord = null

      splashscreen = document.querySelector('.splashscreen')

      gameOver = document.querySelector('.gameOver')

      // Reset Displays
      quizPointsDisplay.textContent = 0
      updateTimerBar()
      levelDisplay.textContenst = quizLevel

      // Start new countdown on button click
      btnDisplay.addEventListener('click', startTimer, false)
    }

    btnDisplay.addEventListener('click', startTimer, false)
    startSplashscreen()
  }

  $scope.initGame()
}).run(function ($ionicPlatform) {
  $ionicPlatform.ready(function () {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true)
    }
    if (window.StatusBar) {
      StatusBar.styleDefault()
    }
  })
})
