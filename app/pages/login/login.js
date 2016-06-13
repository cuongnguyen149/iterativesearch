var app = angular.module('iterativeSearch');

app.controller('LoginCtrl', ["$scope",'LoginSvc', '$state', function ($scope, LoginSvc, $state) {
	$scope.onLogin = function(user){
		$state.go('main.myprojects.search');
	}
		/*
		Client wants this disabled.
		LoginSvc.getUser().then(function (data) {
        for (var i =0 in data){
			if(data[i].userID == user.userID && data[i].password == user.password){
				$state.go('main.myprojects.search');
				break;
			}else{
				$scope.error = 'UserID or password incorect!'
			}	
		}
		
    });	
    */
	
}]);