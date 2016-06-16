var app = angular.module('iterativeSearch');

app.controller('SearchProjectsCtrl', ["$scope", "$state", "VerdictsService", "ArchivedVerdictsService", "SearchService", "TransferDataService", function ($scope, $state, VerdictsService, ArchivedVerdictsService, SearchService, TransferDataService) {

    $scope.Verdicts = [];
    $scope.sortProjects = 'Project';
    $scope.sortProjectReverse = false;

    $scope.enter = function(e) {
        if (e.keyCode == 13) {
            searchProjects();
        }
    }

    $scope.enterPressed = function (e) {
        if (e.which === 13) {
            searchProjects();
        }
    }

    $scope.setProjectClick = function (verdict) {
        if ($scope.lastSelected) {
            $scope.lastSelected.selected = '';
        }
        this.selected = 'selected';
        $scope.lastSelected = this;
        $scope.lastSelectedProject = this.project;

        TransferDataService.set("Verdict", verdict);
        $state.go("main.myprojects.verdicts");
    }

    $scope.addMatchesToVerdicts = function (matches) {
        if(matches) {
            var j = 0;
            for (var i = 0; i < matches.length; i++){
                var match = matches[i];

                var displayName;
                if(j == 0){
                    displayName = "Carson-33444";
                    j++;
                } else if (j == 1){
                    displayName = "Adams-12345";
                    j++;
                } else {
                    displayName = "Hilton-98765";
                    j = 0;
                }
                match["DisplayName"] = displayName;
                $scope.Verdicts.push(match);
            }    
        }
    }

    $scope.searchClick = function () {
        var searchString = $scope.searchpage.textBoxSearchTerm;
        var searchArchived = $scope.searchpage.checkStatus;

        $scope.Verdicts = [];
        
        if(searchArchived) {
            ArchivedVerdictsService.getArchivedVerdicts().then(function (archivedData) {
                var archivedVerdicts = archivedData.ArchivedVerdicts;
                var archivedMatches = SearchService.searchVerdicts(archivedVerdicts, searchString, true); 
                $scope.addMatchesToVerdicts(archivedMatches);  
            });
        }

        VerdictsService.getVerdicts().then(function (data) {
            var verdicts = data.Verdicts;
            var matches = SearchService.searchVerdicts(verdicts, searchString, false);   
            $scope.addMatchesToVerdicts(matches); 
        });
    }
}]);