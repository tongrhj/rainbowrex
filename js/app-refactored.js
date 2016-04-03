'use strict'

angular.module('ionic.utils', [])
.factory('$localStorage', ['$window', function ($window) {
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

angular.module('starter', ['ionic', 'ionic.utils', 'ngCordova'])
.controller('MainController', function ($scope, $ionicModal, $localStorage, $cordovaSocialSharing, $cordovaScreenshot) {

class Game {
  constructor () {
    this.quizWord = document.querySelector('#quizWord')
    this.quizWordList = ['red', 'yellow', 'green', 'blue']
    this.rainbowList = this.quizWordList.concat(['orange', 'purple', 'pink'])
    this.btnDisplay = document.querySelector('#btnList')
    this.quizPointsDisplay = document.querySelector('#quizPoints')
    this.answerBtn = null
    this.countdown = null
    this.timerBar = document.querySelector('#timerBar')
    this.levelDisplay = document.querySelector('#levelDisplay')
    this.highscore = $localStorage.get('highscore') || null

    this.countdownSpeed = 0.05
    this.countdownAdd = 1
    this.quizWordColour
    this.isRainbowRound = false
    this.btnOrder = null
    this.previousQuizWord = null

    this.splashscreen = document.querySelector('.splashscreen')
    this.pausescreen = document.querySelector('.pauseScreen')
    this.pauseText = document.querySelector('#pauseText')
    this.pauseBtn = document.querySelector('#pauseBtn')

    this.gameOver = document.querySelector('.gameOver')
    this.newGameBtn = document.querySelector('#newGameBtn')
  }

  startSplashscreen () {
    this.splashscreen.addEventListener('click', this.removeSplashscreen)
    this.startNewRound()
  }

  removeSplashscreen () {
    this.splashscreen.removeEventListener('click')
    this.splashscreen.classList.add('vanishFast')
    document.querySelector('.rexOnRainbow').classList.add('slideOutFast')
    this.splashscreen.addEventListener('animationend', () => {
      this.splashscreen.classList.remove('vanishFast')
      this.splashscreen.parentNode.removeChild(splashscreen)
      console.log('Splashscreen vanished')
    })
  }

  showPause () {
    this.stopTimer()
    this.pausescreen.classList.add('becomeVisible')
    this.pausescreen.addEventListener('click', this.hidePause)
    console.log('Showing pausescreen')
  }

  hidePause () {
    this.pausescreen.removeEventListener('click', this.hidePause)
    setTimeout(() => { this.pauseText.textContent = 'STARTING' }, 100)
    this.pausescreen.classList.add('vanishSlow')
    this.pausescreen.addEventListener('animationend', () => {
      console.log('Hiding pausescreen')
      this.pausescreen.classList.remove('becomeVisible', 'vanishSlow')
      this.pauseText.textContent = 'GAME PAUSED'
      this.pausescreen.removeEventListener('animationend')
    })
    this.btnDisplay.addEventListener('click', this.startTimer)
  }

  findBtnMatch (quizWord) {
    switch (quizWord.textContent) {
      case 'red':
        this.answerBtn = document.querySelector('.button-red')
        break
      case 'yellow':
        this.answerBtn = document.querySelector('.button-yellow')
        break
      case 'green':
        this.answerBtn = document.querySelector('.button-green')
        break
      case 'blue':
        this.answerBtn = document.querySelector('.button-blue')
        break
      case 'orange':
        this.answerBtn = document.querySelector('.button-orange')
        break
      case 'pink':
        this.answerBtn = document.querySelector('.button-pink')
        break
      case 'purple':
        this.answerBtn = document.querySelector('.button-purple')
        break
      default:
        break
    }
    console.log('Answer: ' + this.answerBtn)
    return this.answerBtn
  }

  startNewRound () {
    // Set a random colour and colour name to quizWord
    generateQuizword()
    console.log('NEW ROUND | ' + this.quizWord.textContent + ' set to ' + this.quizWord.style.color)
    // Initalize pauseBtn
    this.pauseBtn.addEventListener('click', this.showPause)
    // Shuffle the buttons up, clear the window, then add them to btnDisplay
    this.isRainbowRound ? this.btnOrder = shuffle(this.rainbowList) : this.btnOrder = shuffle(this.quizWordList)
    this.btnDisplay.innerHTML = ''
    this.btnOrder.forEach(createBtn)
    this.answerBtn = this.findBtnMatch(this.quizWord)
    this.btnDisplay.addEventListener('click', this.checkAnswer, false)

    function createBtn (colourClass) {
      const btn = document.createElement('button')
      btn.classList.add('button-' + colourClass)
      this.btnDisplay.appendChild(btn)
    }

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
      if (this.quizLevel >= 3 && !this.isRainbowRound) {
        this.quizWordColour = this.quizWordList[Math.floor(Math.random() * this.quizWordList.length)]
      } else if (this.isRainbowRound) {
        this.quizWordColour = this.rainbowList[Math.floor(Math.random() * this.rainbowList.length)]
      } else {
        const r = Math.floor((Math.random() * 194) + 1) + 60
        const g = Math.floor((Math.random() * 194) + 1) + 60
        const b = Math.floor((Math.random() * 194) + 1) + 60
        const colour = ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
        // var colour = Math.floor(Math.random() * 4815162342).toString(16)
        this.quizWordColour = '#' + ('000000' + colour).slice(-6)
      }
      this.quizWord.style.color = this.quizWordColour
      this.isRainbowRound ? this.quizWord.textContent = this.rainbowList[Math.floor(Math.random() * this.rainbowList.length)] : this.quizWord.textContent = this.quizWordList[Math.floor(Math.random() * this.quizWordList.length)]
      if (this.quizWord.style.color === this.quizWord.textContent || this.previousQuizWord === this.quizWord.textContent) {
        this.generateQuizword()
      }
      this.previousQuizWord = this.quizWord.textContent
    }
  }
}








  $scope.initGame = function (event) {
    this.quizStats = {
      'points': 0,
      'roundDuration': 4,
      'level': 1
    }
    // Instance of ES6 Destructuring
    const { roundDuration: timeLeft, level: quizLevel } = quizStats

    // Prevent the click on loseModal btn to start new game from triggering the startTimer listener
    if (event) {
      event.stopPropagation()
    }





    function checkAnswer (event) {
      var btnClicked = event.target
      console.log('Button clicked: ')
      console.log(btnClicked)
      // if (btnClicked.classList[0] !== 'button') {
      //   return
      // }
      if (btnClicked === answerBtn) {
        isRainbowRound ? quizStats.points += 7 : quizStats.points += 1
        quizPointsDisplay.textContent = quizStats.points
        quizPointsDisplay.classList.add('boomsz')
        setTimeout(() => { quizPointsDisplay.classList.remove('boomsz') }, 100)

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

      if (quizStats.points >= (quizLevel * 20)) {
        quizLevel = quizLevel + 1
        console.log('Increased to Level ' + quizLevel)

        flipCoin() === 1 ? isRainbowRound = true : isRainbowRound = false
        console.log('Next round is a rainbow round:' + isRainbowRound)

        levelDisplay.textContent = quizLevel
        levelDisplay.classList.add('boomsz')
        setTimeout(() => { levelDisplay.classList.remove('boomsz') }, 100)

        if (quizLevel === 2) { countdownSpeed = 0.06; countdownAdd = 1.4 }
        if (quizLevel === 3) { countdownSpeed = 0.07; countdownAdd = 1.4 }
        if (quizLevel === 4) { countdownSpeed = 0.08; countdownAdd = 1.6 }
        if (quizLevel === 5) { countdownSpeed = 0.09; countdownAdd = 1.6 }
        if (quizLevel === 6) { countdownSpeed = 0.10; countdownAdd = 1.6 }
        if (quizLevel === 7) { countdownSpeed = 0.11; countdownAdd = 1.6 }
        if (quizLevel === 8) { countdownSpeed = 0.112; countdownAdd = 1.6 }
        if (quizLevel === 9) { countdownSpeed = 0.115; countdownAdd = 1.6 }
        if (quizLevel === 10) { countdownSpeed = 0.12; countdownAdd = 1.6 }
        if (quizLevel === 15) { countdownSpeed = 0.14; countdownAdd = 1.6 }
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
      document.querySelector('body').removeEventListener('click', startTimer)
      document.querySelector('#pauseBtn').removeEventListener('click', showPause)
      stopTimer()
      gameOver.classList.add('appearFast', 'becomeVisible')
      checkHighscore()
      document.querySelector('#loseModalScore b').textContent = quizStats.points
      gameOver.addEventListener('animationend', function () {
        newGameBtn.addEventListener('click', hideGameOver)
        console.log('Adding event listener to new game button')
      })
    }

    function hideGameOver () {
      gameOver.classList.remove('appearFast', 'becomeVisible')
      newGameBtn.removeEventListener('click', hideGameOver)
      stopTimer()
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
      if (timerBar.value < timeLeft) {
        console.log(timeLeft)
        timerBar.classList.add('whitebg')
        timerBar.addEventListener('transitionend', function () {
          timerBar.classList.remove('whitebg')
        })
      }
      timerBar.value = timeLeft
      console.log('Setting timer bar value to ' + timeLeft)
    }

    function startTimer () {
      console.log('Starting timer')
      btnDisplay.removeEventListener('click', startTimer)
      countdown = window.setInterval(roundTimer, 50)
    }

    function stopTimer () {
      console.log('Stopping Timer')
      window.clearInterval(countdown)
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
      countdownSpeed = 0.05
      countdownAdd = 1
      quizWordColour = null
      isRainbowRound = false
      btnOrder = null
      previousQuizWord = null

      // Reset Displays
      quizPointsDisplay.textContent = 0
      updateTimerBar()
      levelDisplay.textContent = quizLevel

      // Start new countdown on button click
      btnDisplay.addEventListener('click', startTimer, false)
    }

    btnDisplay.addEventListener('click', startTimer, false)
    startSplashscreen()
  }

  $scope.shareAnywhere = () => {
    console.log('Sharing using native dialog')

    $cordovaSocialSharing.share("This is your message", "This is your subject", "www/imagefile.png", "http://blog.nraboy.com")
  }

  $scope.shareViaTwitter = (message, image, link) => {
    $cordovaSocialSharing.canShareVia('twitter', message, image, link).then((result) => {
      $cordovaSocialSharing.shareViaTwitter(message, image, link)
    }, (error) => {
      alert("Cannot share on Twitter")
    })
  }

  $scope.screenCapture = () => {
    console.log('Taking screenshot')
    $cordovaScreenshot.capture()
    .then((res) => {
      console.log(res)
      $cordovaSocialSharing.share('Check out my new highscore on Rainbow Rex!', null, 'file://' + res, 'http://rainbow.jaredt.xyz')
    })

  }

  $scope.initGame()
})

.factory('$cordovaScreenshot', ['$q', function ($q) {
  return {
    capture: function () {
      var q = $q.defer()
      navigator.screenshot.save((error, res) => {
        if (error) {
          console.error(error)
          q.reject(error)
        } else {
          console.log('screenshot capture ok: ', res.filePath)
          q.resolve(res.filePath)
        }
      }, 'jpg', 80)
      return q.promise
    }
  }
}])

.run(function ($ionicPlatform) {
  $ionicPlatform.ready(() => {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true)
    }
    if (window.StatusBar) {
      StatusBar.styleDefault()
    }
  })
})
