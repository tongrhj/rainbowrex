// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.controller('MainController', function($scope, $ionicModal){
  $ionicModal.fromTemplateUrl('lose-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then (function(modal) {
    $scope.modal = modal
  })
  $scope.openModal = function() {
    $scope.modal.show()
  }
  $scope.closeModal = function() {
    $scope.modal.hide()
  }
  $scope.$on('$destroy', function(){
    $scope.modal.remove()
  })

  $scope.initGame = function(event) {
    var quizStats = {
      'points': 0,
      'roundDuration': 60
    }

    // Prevent the click on loseModal btn to start new game from triggering the startTimer listener
    if (event) { event.stopPropagation() }

    var quizWord = document.querySelector('#quizWord')
    var quizWordList = ['red', 'yellow', 'green', 'blue']
    var btnDisplay = document.querySelector('#btnList')
    var btnClassTypes = ['button-positive', 'button-balanced', 'button-energized', 'button-assertive']
    var answerBtn;
    var quizPointsDisplay = document.querySelector('#quizPoints')
    quizPointsDisplay.textContent = 0
    var countdownSpeed = null
    var roundTimerDisplay = document.querySelector('#timer')
    roundTimerDisplay.textContent = 60

    function startNewRound () {
      // Set a random colour and colour name to quizWord
      quizWord.style.color = generateRandomColour()
      quizWord.textContent = quizWordList[Math.floor(Math.random()*quizWordList.length)]
      console.log('NEW ROUND | ' + quizWord.textContent + ' set to ' + quizWord.style.color)

      // Shuffle the buttons up before adding them to the DOM
      var btnOrder = shuffle(btnClassTypes)
      btnDisplay.innerHTML = ''
      btnOrder.forEach(createBtn)
      function createBtn(colourClass) {
        var btn = document.createElement('button')
        btn.classList.add("button",colourClass)
        btnDisplay.appendChild(btn)
      }

      answerBtn = findBtnMatch(quizWord)

      btnDisplay.addEventListener('click',checkAnswer,false)

      // Helper Functions for startNewRound
      function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex ;
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
          // And swap it with the current element.
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }
        return array;
      }

      function generateRandomColour() {
        var colour = Math.floor(Math.random() * 4815162342).toString(16)
        colour = "#" + ("000000" + colour).slice(-6)
        if (colour === '#ffffff') {generateRandomColour()}
        return colour
      }
    }

    function findBtnMatch(quizWord) {
      switch (quizWord.textContent) {
        case 'red':
          answerBtn = document.querySelector('.button-assertive')
          break;
        case 'yellow':
          answerBtn = document.querySelector('.button-energized')
          break;
        case 'green':
          answerBtn = document.querySelector('.button-balanced')
          break;
        case 'blue':
          answerBtn = document.querySelector('.button-positive')
        default:
          break;
      }
      console.log('Answer: ')
      console.log(answerBtn)
      return answerBtn;
    }

    function checkAnswer(event) {
      var btnClicked = event.target
      console.log('Button clicked: ')
      console.log(btnClicked)
      if (btnClicked.classList[0] !== 'button') { return }
      if (btnClicked === answerBtn) {
        quizStats.points += 1
        quizPointsDisplay.textContent = quizStats.points
        console.log('WIN')
        resetRound()
        startNewRound()
      } else {
        console.log('LOSE')
        stopGame()
      }
    }

    function stopGame() {
      // since i only know how to make the lose modal show on ng-click,
      // create an invisible losePixel that I trigger a click on to show lose modal
      document.querySelector('body').removeEventListener('click', startTimer)
      stopTimer()
      var losePixel = document.querySelector('#losePixel')
      angular.element(losePixel).triggerHandler('click')
      document.querySelector('#loseModalScore b').textContent = quizStats.points
      resetRound()
    }

    function resetRound() {
      btnDisplay.removeEventListener('click', checkAnswer, false)
    }

    function roundTimer () {
      quizStats.roundDuration-= 1;
      if (quizStats.roundDuration <= 0) {
        stopGame()
        return
      }
      document.querySelector('#timer').textContent = quizStats.roundDuration
    }

    function startTimer () {
      btnDisplay.removeEventListener('click', startTimer)
      countdownSpeed = setInterval(roundTimer, 1000)
    }

    function stopTimer () {
      clearInterval(countdownSpeed)
    }

    btnDisplay.addEventListener('click', startTimer, false)
    startNewRound()
  }

  $scope.initGame()
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  })
})
