var app = angular.module('iterativeSearch');

app.controller('FlaggedPagesCtrl', ["$scope", "$state", "VerdictsService", "SearchService", "TransferDataService", 
    function ($scope, $state, VerdictsService, SearchService, TransferDataService) {
    $scope.$state = $state;

    $scope.sortSearch = 'Result';
    $scope.sortSearchReverse = false;
    
    $scope.sortProjects = 'Project';
    $scope.sortProjectReverse = false;

  	$scope.addMatchesToVerdicts = function (matches) {
        if(matches) {
            for (var i = 0; i < matches.length; i++){
                var match = matches[i];
                $scope.Verdicts.push(match);
            }    
        }
    }

    $scope.getFlaggedVerdicts = function () {
    	$scope.Verdicts = [];

        VerdictsService.getVerdicts().then(function (data) {
            var verdicts = data.Verdicts;

            var matches = SearchService.searchVerdictFlagged(verdicts, false);   
            $scope.addMatchesToVerdicts(matches); 
        });
    }

    $scope.setVerdictClick = function (verdict) {
        if ($scope.lastSelected) {
            $scope.lastSelected.selected = '';
        }
        this.selected = 'selected';
        $scope.lastSelected = this;
        $scope.lastSelectedProject = this.project;

        //If this note was associated with a Verdict.
  
        TransferDataService.set("Verdict", verdict);
        $state.go("main.myprojects.verdicts");
    }

}]);