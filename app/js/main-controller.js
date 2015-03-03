angular.module('MobileGit')

.controller('MainCtrl', ['$ionicNavBarDelegate', '$scope', '$ionicLoading', 'githubservice', '$state', 'store', '$ionicHistory', '$ionicLoading',
  function ($ionicNavBarDelegate, $scope, $ionicLoading, githubservice, $state, store, $ionicHistory, $ionicLoading) {

    var intro = $state.current.name === "intro";

    // Base Object used in most controllers containing logged in users information
    $scope.flags = {
      user: {},
      access_token: '',
      FromSearch: false,
      showNavBttns: intro
    };

    if ($state.current.name === "search" || intro) {
      $ionicNavBarDelegate.showBackButton(false);
    } else {
      $ionicNavBarDelegate.showBackButton(true);
    }

    // Utility function
    window.showFlags = function() {
      console.log('flags', $scope.flags)
    }

    if (store.get('access_token') == undefined) {
      $state.go('intro');
    } else {
      $scope.flags.access_token = store.get('access_token');
      $scope.flags.user = store.get('user');
    }

    $ionicNavBarDelegate.showBackButton(true);
    $scope.open = false;

    $scope.openOverlay = function() {
      $scope.openNav = !$scope.openNav;

      var inClass = 'bounceIn';
      var outClass = 'bounceOut';

      if ($scope.openNav) {
        $('.scroll').addClass('blurred');
        $('.searchNav').addClass(inClass).removeClass(outClass);
        $('.profileNav').addClass(inClass).removeClass(outClass);
      } else {
        $('.searchNav').removeClass(inClass).addClass(outClass);
        $('.profileNav').removeClass(inClass).addClass(outClass);
        $('.fading-btn').css({
          opacity: 1
        });
        $('.scroll').removeClass('blurred');
      }
    };

    $scope.search = function() {
      $scope.openOverlay();
      $state.go('search');
    }

    $scope.myProfie = function() {
      $scope.openOverlay();
      $state.go('profile');
    };

    $scope.FindProject = function(project) {
      $ionicLoading.show({
        template: '<i class="ion-loading-c"></i>'
      });
      githubservice.getProjects(project).then(function(response) {
        $ionicLoading.hide();
        $scope.items = response.data.items;
        $ionicNavBarDelegate.showBackButton(true);
        $state.go('searchpage');
      })
    }

    $scope.OtherProfile = function (user) {
      $scope.flags.FromSearch = true;
      $ionicLoading.show({
        template: '<i class="ion-loading-c"></i>'
      });
      githubservice.getPerson(user).then(function(response) {
        $ionicLoading.hide();
        $scope.otherUser = response;
        $ionicHistory.clearCache();
        $state.go('profile');
      });
    };

    $scope.UpdateUser = function() {
      githubservice.getPerson($scope.flags.user.login).then(function(response) {
        console.log('updated!')
        $ionicHistory.clearCache();
        $scope.flags.user = reponse;
        store.set('user', reponse)
      });
    }

}])