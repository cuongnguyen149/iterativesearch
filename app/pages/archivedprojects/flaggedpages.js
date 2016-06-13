var app = angular.module('iterativeSearch');

app.controller('ArchivedFlaggedPagesCtrl', ["$scope", "$state", function ($scope, $state) {
    $scope.$state = $state;
}]);