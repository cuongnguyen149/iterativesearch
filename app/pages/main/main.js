var app = angular.module('iterativeSearch');

app.controller('MainCtrl', ["$scope", "$state", function ($scope, $state) {
    $scope.$state = $state;
    $scope.Text = "This is Main page"

}]);