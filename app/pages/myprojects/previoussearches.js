var app = angular.module('iterativeSearch');

app.controller('PreviousSearchesCtrl', ["$rootScope", "$scope", "$state", "SearchService", "VerdictsService", "PrevSearchesService", "StatesService", 
    function ($rootScope, $scope, $state, SearchService, VerdictsService, PrevSearchesService, StatesService) {
    
    $scope.$state = $state;
    $scope.recency = [0, 20];
    $scope.verdictAmount = [0, 60000000];
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

    $scope.onVerdictClick = function (verdict) {
        var verdictState = verdict.State;

        var states = $scope.StateObjects;
        for (var i = 0; i < states.length; i++) {
            var state = states[i];
            var stateFull = state["State"];
            var stateShort = state["Abbrev"];
            if (stateShort == verdictState) {
                $rootScope.jurisdiction = stateFull;
            }
        }

        TransferDataService.set("Verdict", verdict);
        $state.go("main.myprojects.verdicts");
    }

    $scope.prevSearchClick = function (searchObj) {
        var stateSelected = searchObj["Jurisdiction"];
        var amount1 = searchObj["Amount_1"];
        var amount2 = searchObj["Amount_2"];
        var searchStr = searchObj["SearchStr"];
        var recency1 = searchObj["Recency_1"];
        var projectId = searchObj["ProjectId"];

        $scope.amount_1 = amount1;
        $scope.amount_2 = amount2;
        $scope.recency_1 = recency1;

        $scope.recency = [recency1, 20];
        $scope.verdictAmount = [amount1, amount2];
        $scope.searchVer = {
            text:  searchStr,
            jurisdiction: stateSelected,
            amount_1: amount1,
            amount_2: amount2,
            recency_1: recency1,
        }

        if (stateSelected == "All") {
            VerdictsService.searchVerdicts($scope, "All").then(function (data) {
                var verdicts = data;

                var matches = SearchService.searchVerdicts(verdicts, searchStr, false);
                $scope.SearchResults = matches;
            });
        } else {
            var states = $scope.StateObjects;
            for (var i = 0; i < states.length; i++) {
                var state = states[i];
                var stateFull = state["State"];
                var stateShort = state["Abbrev"];
                if (stateFull == stateSelected) {
                    VerdictsService.searchVerdicts($scope, stateShort).then(function (data) {
                        var verdicts = data;

                        var matches = SearchService.searchVerdicts(verdicts, searchStr, false);

                        $scope.SearchResults = matches;
                    });
                }
            }
        }
    }

    $scope.Searches = [];

    PrevSearchesService.getSearches().then(function (data) {
        var curProjId = $rootScope.lastSelectedProject.ID;

        var searches = data.Searches;
        for (var i = 0; i < searches.length; i++){
            var search = searches[i];
            
            if(curProjId == search.ProjectId) {
                $scope.Searches.push(search);
            }
        }
    });
}]);


app.directive("sliderRecency", function () {
    return {
        restrict: 'AE',
        link: function (scope, elem, attrs) {
            var setModel = function (value) {
                scope.model = value;
            }
            $(elem).slider({
                step: 0.5,
                min: 0,
                max: scope.recency[scope.recency.length - 1],
                values: [scope.recency[0]],
                slide: function (event, ui) {
                    // scope.searchVer.recency_1 = ui.values;
                }
            }).slider("pips", {
                step: 4,
                labels: false,
                first: "pip",
                last: "pip"

            }).slider("float", {
                handle: true,
                pips: false,
                labels: false,
                prefix: "",
                suffix: " years"
            });
        }
    }
});

app.directive("sliderVerdict", function () {
    return {
        restrict: 'AE',
        link: function (scope, elem, attrs) {
            var setModel = function (value) {
                scope.model = value;
            }
            $(elem).slider({
                range: true,
                step: 250000,
                min: 0,
                max: 60000000,
                values: [scope.verdictAmount[0], scope.verdictAmount[scope.verdictAmount.length - 1]],
                slide: function (event, ui) {
                    // scope.searchVer.amount_1 = ui.values[0];
                    // scope.searchVer.amount_2 = ui.values[1];
                }
            }).slider("pips", {
                step: 10,
                labels: false,
                first: "pip",
                last: "pip"

            })

            .slider("float", {

                handle: true,
                pips: false,
                labels: false,
                prefix: "$",
                suffix: ""

            });
        }
    }
});