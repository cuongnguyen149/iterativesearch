var app = angular.module('iterativeSearch');

app.controller('ArchivedPreviousSearchesCtrl', ["$scope", "$state", "StatesService", function ($scope, $state, StatesService) {
    $scope.$state = $state;
    
    StatesService.getStates().then(function (data) {
        var states = data.States;
        $scope.StateObjects = states;
        var stateFullNames = [];
        for (var i = 0; i < states.length; i++){
            var state = states[i];
            var stateFullName = state["State"];
            stateFullNames.push(stateFullName);
        }

        $scope.Select = stateFullNames;
    });
    
    $scope.SearchTerm = [
        {
            SearchTerm: "Construction Defect",
            Viewed: "5 mins ago"
        },
        {
            SearchTerm: "Construction Negligence",
            Viewed: "30 mins ago"
        },
        {
            SearchTerm: "Construction Safety",
            Viewed: "05/11/16"
        },
        {
            SearchTerm: "Construction Vehicle Accident",
            Viewed: "Yesterday"
        },
        {
            SearchTerm: "Construction",
            Viewed: "05/11/16"
        }
    ]
}]);