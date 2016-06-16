var app = angular.module('iterativeSearch');

app.controller('FlaggedPagesCtrl', ["$rootScope", "$scope", "$state", "FlaggedVerdictsService", "VerdictsService", "SearchService", "TransferDataService", 
    function ($rootScope, $scope, $state, FlaggedVerdictsService, VerdictsService, SearchService, TransferDataService) {
    $scope.$state = $state;

    $scope.sortSearch = 'Result';
    $scope.sortSearchReverse = false;
    
    $scope.sortProjects = 'Project';
    $scope.sortProjectReverse = false;

    var setInitialFlagsOnVerdicts = function (verdicts) {

        FlaggedVerdictsService.getFlaggedVerdicts().then(function (flaggedVerdictsData) {
            var flaggedVerdicts = flaggedVerdictsData.FlaggedVerdicts;

            var curProjId = $rootScope.lastSelectedProject.ID;

            var searchResults = [];
            for (var i = 0; i < verdicts.length; i++){
                var verdict = verdicts[i];
                var verdictId = verdict.id;
                
                for (var j = 0; j < flaggedVerdicts.length; j++){
                    var flaggedVerdict = flaggedVerdicts[j];
                    
                    if(flaggedVerdict.Flagged) {
                        var flaggedVerdictProjId = flaggedVerdict.ProjectId;
                        var flaggedVerdictId = flaggedVerdict.VerdictId;
                        if(verdictId == flaggedVerdictId && curProjId == flaggedVerdictProjId) {
                            console.log("Got here");

                            var searchTerms = flaggedVerdict.SearchTerms;
                            verdict.SearchTermsStr = searchTerms.join();
                            searchResults.push(verdict);
                        }
                    }
                }
            }

            $scope.addMatchesToVerdicts(searchResults); 
        });
    }

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

            setInitialFlagsOnVerdicts(verdicts);  
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

    $rootScope.$on('projectChange', function (event, args) {
        $scope.getFlaggedVerdicts();    
    });

}]);