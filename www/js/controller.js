angular.module('controller', [])

.controller('searchCtrl', function($scope, $http, $rootScope, $state, $ionicLoading, githubservice) {
	$rootScope.count;
	if ($rootScope.count < 0) {
		if (navigator.splashscreen) {
			navigator.splashscreen.show();
			setTimeout(function() {
				navigator.splashscreen.hide();
			}, 5000)
			$rootScope.count++
		}
	}

	$rootScope.ginfo;

	$scope.uname = "jackhanford";

	$scope.searchProject	= function(uname) {
		$ionicLoading.show({
			template: 'Loading...'
		});
		githubservice.getprojects(uname).then(function(response) {
			console.log(response)
			$ionicLoading.hide();
			$rootScope.sItems = response.items;
			$state.go('searchlist')
		})
	}

	$scope.searchUser	= function(uname) {
		$rootScope.uname = uname;
		$ionicLoading.show({
			template: 'Loading...'
		});
		githubservice.getperson(uname).then(function(response) {
			$ionicLoading.hide();
			$rootScope.ginfo = response;
			console.log(response)
			$state.go('profile')
		})
	}
})

.controller('profileCtrl', function($scope, $http, $rootScope, $state, $ionicLoading, $ionicModal, githubservice) {
	if ($rootScope.ginfo != undefined) {
		$scope.pub_count = $rootScope.ginfo.public_repos;
		$scope.gists = $rootScope.ginfo.public_gists;
		$scope.followers = $rootScope.ginfo.followers;
		if ($rootScope.ginfo.blog) {
			$scope.hideLink = false;
			$scope.blog = $rootScope.ginfo.blog;
		} else {
			$scope.hideLink = true;
		}
		$scope.company = $rootScope.ginfo.company;
		$scope.hireable = $rootScope.ginfo.hireable;

		var created = $rootScope.ginfo.created_at;
		$scope.created_at = created.substring(0, 10);

		$scope.following = $rootScope.ginfo.following;
		$scope.ava = $rootScope.ginfo.avatar_url;
		if ($rootScope.ginfo.location) {
			$scope.hideLocation = false;
			$scope.location = $rootScope.ginfo.location;
		} else {
			$scope.hideLocation = true;
		}

		$scope.name = $rootScope.ginfo.name;
		$scope.id = $rootScope.ginfo.id;
		$scope.login = $rootScope.ginfo.login;

		if ($scope.name == null ) {
			$scope.name = $rootScope.ginfo.login;
		}

		githubservice.getevents($scope.login).then(function(response) {
			$scope.recentEvents = response;
		});

		$ionicModal.fromTemplateUrl('activity.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.modal = modal;

			$scope.acitivty = function() {
				$scope.modal.show();
			};
			$scope.closeModal = function() {
				$scope.modal.hide();
			}
		});


		var url = 'https://api.github.com/users/' + $rootScope.uname + '/repos'
		$http.get(url)
		.success(function(data, headers, status, config){
			$scope.popularRepos = data.splice(0,9)
			console.log($scope.popularRepos)
		}).error(function(data, headers, status, config){
			alert(headers)
		})

	} else {
		$state.go('search')
	}

	$scope.repoinfo = function(popularRepo) {
		debugger
		$ionicLoading.show({
			template: 'Loading...'
		});

		var url = "https://api.github.com/repos/" + $rootScope.uname + '/' + popularRepo.name; 
		$http.get(url)
		.success(function(data, headers, status, config){
			$rootScope.repo = data;
			$ionicLoading.hide();
			$state.go('PublicRep')
		}).error(function(data, headers, status, config){
			$ionicLoading.hide();
			console.log(data, headers, status, config)
		})
	}

	$scope.repo = function () {
		$ionicLoading.show({
			template: 'Loading...'
		});

		var url = 'https://api.github.com/users/' + $rootScope.uname + '/repos'
		$http.get(url)
		.success(function(data, headers, status, config){
			$rootScope.publicReps = data;
			$ionicLoading.hide();
			$state.go('repos')
		}).error(function(data, headers, status, config){
			$ionicLoading.hide();
			console.log(data, headers, status, config)
		})
	}

	$scope.toFollowerState = function () {
		var url = 'https://api.github.com/users/' + $rootScope.uname + '/followers'
		$ionicLoading.show({
			template: 'Loading...'
		});

		$http.get(url)
		.success(function(data, headers, status, config){
			$rootScope.followers = data;
			$ionicLoading.hide();
			if ($rootScope.followers.length > 0) {
				$state.go('followers')
			}
		}).error(function(data, headers, status, config){
			console.log(data, headers, status, config)
			$ionicLoading.hide();
		})
	}

	$scope.toFollowingState = function () {
		var url = 'https://api.github.com/users/' + $rootScope.uname + '/following'
		$ionicLoading.show({
			template: 'Loading...'
		});
		$http.get(url)
		.success(function(data, headers, status, config){
			$rootScope.following = data;
			$ionicLoading.hide();
			if ($rootScope.following.length > 0) {
				$state.go('following')
			}
		}).error(function(data, headers, status, config){
			$ionicLoading.hide();
			console.log(data, headers, status, config)
		})
	}
})


.controller('repoCtrl', function($scope, $http, $rootScope, $state, $ionicLoading) {
	$scope.reps = $rootScope.publicReps;

	if ($scope.reps == null) {
		state.go('search')
	}

	$scope.select = function(rep) {
		$ionicLoading.show({
			template: 'Loading...'
		});

		var url = "https://api.github.com/repos/" + $rootScope.uname + '/' + rep.name; 
		$http.get(url)
		.success(function(data, headers, status, config){
			$rootScope.repo = data;
			$ionicLoading.hide();
			$state.go('PublicRep')
		}).error(function(data, headers, status, config){
			$ionicLoading.hide();
			console.log(data, headers, status, config)
		})
	}
		// $state.go('PublicRep')

	})

.controller('repoViewCtrl', function($scope, $http, $rootScope, $state) {
	console.log($rootScope.repo)
	var updated = $rootScope.repo.updated_at;
	$scope.updated = updated.substring(0, 10);
	$scope.repo = $rootScope.repo;

	$scope.recentActivity = function (repo) {
		$scope.repo = repo;
		var url = 'https://api.github.com/repos/' + $scope.repo.full_name + '/commits' 
		$http.get(url)
		.success(function(data, headers, status, config){
			$rootScope.commits = data;
			$state.go('commits')
		}).error(function(data, headers, status, config){
			console.log(data, headers, status, config)
		})
	}
	
})


.controller('followerCtrl', function($scope, $http, $rootScope, $state, $ionicLoading) {
	$scope.followers = $rootScope.followers;

	$scope.toFollower = function(fName) {
		$rootScope.uname = fName;

		var url = 'https://api.github.com/users/' + fName;

		console.log(url)

		$ionicLoading.show({
			template: 'Loading...'
		});

		$http.get(url)
		.success(function(data, headers, status, config){
			$rootScope.ginfo = data;
			$ionicLoading.hide()
			$state.go('profile')
		}).error(function(data, headers, status, config) {
			console.log(data, headers, status)
		});
	}
})

.controller('followingCtrl', function($scope, $http, $rootScope, $state, $ionicLoading) {
	$scope.followings = $rootScope.following;

	$scope.toFollower = function(fName) {
		$rootScope.uname = fName;

		$ionicLoading.show({
			template: 'Loading...'
		});

		var url = 'https://api.github.com/users/' + fName;

		$http.get(url)
		.success(function(data, headers, status, config){
			$rootScope.ginfo = data;
			$ionicLoading.hide()
			$state.go('profile')
		})
	}
})

.controller('searchviewCtrl', function($scope, $http, $rootScope, $state, $ionicLoading, $ionicModal) {
	$scope.items = $rootScope.sItems;

	console.log($scope.items)

	$ionicModal.fromTemplateUrl('my-modal.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;

		$scope.commits = function(fullname) {
			debugger
			console.log(fullname);
			var url = 'https://api.github.com/repos/' + fullname + '/commits' 
			$http.get(url)
			.success(function(data, headers, status, config){
				console.log(data)
				$rootScope.commits = data;
				$scope.modal.hide();
				$state.go('commits')
			}).error(function(data, headers, status, config){
				$ionicLoading.hide();
				console.log(data, headers, status, config)
			})
		}

		$scope.owner = function(login) {
			$rootScope.uname = login
			var url = 'https://api.github.com/users/' + login
			$http.get(url)
			.success(function(data, headers, status, config){
				$rootScope.ginfo = data;
				$scope.modal.hide();
				$state.go('profile')
			}).error(function() {
				console.log('fuck')
			})
		}
	});

	$scope.openModal = function(item) {
		$scope.name = item.name;
		$scope.starcount = item.stargazers_count;
		$scope.login = item.owner.login;
		$scope.description = item.description;
		$scope.fullname = item.full_name;
		$scope.language = item.language;
		$scope.forks = item.forks;
		$scope.modal.show();
	};
	$scope.closeModal = function() {
		$scope.modal.hide();
	};

	if ($scope.items == undefined) {
		$state.go('search')
	}
})

.controller('commitsCtrl', function($scope, $http, $rootScope, $state, $ionicLoading) {
	$scope.commits = $rootScope.commits;

	console.log($scope.commits)

	if ($scope.commits == undefined) {
		$state.go('search')
	}

})


.factory('githubservice', function($http, $rootScope) {
	var baseurl = 'https://api.github.com/'
	return {
		getperson: function(uname) {
			var promise = $http.get(baseurl + 'users/' + uname).then(function(response) {
				return response.data;
			})
			return promise;
		},
		getprojects: function(uname) {
			var promise = $http.get(baseurl + 'search/repositories?q=' + uname).then(function(response) {
				return response.data;
			})
			return promise;
		},
		getevents: function(login) {
			var promise = $http.get(baseurl + 'users/' + login + '/events').then(function(response) {
				return response.data;
			})
			return promise;
		}
	}
});