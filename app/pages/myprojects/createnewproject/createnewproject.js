var app = angular.module('iterativeSearch');

app.controller('CreateNewProjectCtrl', ["$rootScope", "$scope", "$state", "TransferDataService", "StatesService", "MyProjectsService", "VerdictsService", "SearchService", "$window", "PrevSearchesService",   
	function ($rootScope, $scope, $state, TransferDataService, StatesService, MyProjectsService, VerdictsService, SearchService, $window, PrevSearchesService) {

    $scope.$state = $state;
    
    $scope.recency = [0, 20];
    $scope.verdictAmount = [0, 60000000];
    $scope.searchVer = {
        projectName: '',
    	text: '',
        jurisdiction: 'All',
        amount_1: $scope.verdictAmount[0],
        amount_2: $scope.verdictAmount[$scope.verdictAmount.length - 1],
        recency_1: $scope.recency[0]
    }

    $scope.enterPressed = function (e) {
        if (e.which === 13) {
            search();
            createNewProject();           
        }
    }
    $scope.search = function () {
    	if($scope.searchVer.projectName.length != 0){
		    if(search(SearchResults)){

		    };
	    	// if(matches){
	    	// }
    	}else{
    		$window.alert('Please enter the project name!');
    	}
    }
    var createNewProject = function () {
        var nowDate = new Date();
        // var timeStamp = nowDate.getTime(); 

        var curr_date = nowDate.getDate();
        var curr_month = nowDate.getMonth() + 1;
        var curr_year = nowDate.getFullYear();

        var nowDateStr = curr_month + "/" + curr_date + "/" + curr_year;
        var projectName = $scope.searchVer.projectName;

    	var newProject = {}; 
        newProject["ID"] =  parseInt($window.sessionStorage.ProjectIdForCreateNewProject);
        newProject["Project"] = projectName;
        newProject["Contents"] = "";
        newProject["LastOpened"] = nowDateStr;
        newProject["Created"] = nowDateStr;

        MyProjectsService.writeNewProject(newProject);

        var stateSelected = $scope.searchVer.jurisdiction;
        var searchStr = $scope.searchVer.text.toLowerCase();
        var recency_1 = $scope.searchVer.recency_1;

        var amount_1 = $scope.searchVer.amount_1;
        var amount_2 = $scope.searchVer.amount_2;

        var searchObjTimestamp = new Date().getTime(); 

        var searchObj = {};
        searchObj["id"] = searchObjTimestamp;
        searchObj["Amount_1"] = amount_1;
        searchObj["Amount_2"] = amount_2;
        searchObj["SearchStr"] = searchStr;
        searchObj["Recency_1"] = recency_1;
        searchObj["Jurisdiction"] = stateSelected;
        searchObj["ProjectId"] = parseInt($window.sessionStorage.ProjectIdForCreateNewProject);
        searchObj["Created"] = nowDateStr;

        PrevSearchesService.getSearches().then(function (data) {
            var searches = data.Searches;
            var countSearchStr = 0;
            for (var i = 0; i < searches.length; i++) {
                if (searchStr == searches[i].SearchStr.toLowerCase()) {
                    countSearchStr++;
                }
            }
            if (countSearchStr == 0) {
                PrevSearchesService.writeSearchObj(searchObj);
            }
        });
    }

    StatesService.getStates().then(function (data) {
        var states = data.States;
        $scope.StateObjects = states;
        var stateFullNames = [];
        for (var i = 0; i < states.length; i++) {
            var state = states[i];
            var stateFullName = state["State"];
            stateFullNames.push(stateFullName);
        }

        $scope.Select = stateFullNames;
    });

    var search = function (callback) {
        var stateSelected = $scope.searchVer.jurisdiction;
        var searchStr = $scope.searchVer.text.toLowerCase();
        if (stateSelected == "All") {
            VerdictsService.searchVerdicts($scope.searchVer, "All").then(function (data) {
                var verdicts = data;
                var matches = SearchService.searchVerdicts(verdicts, searchStr, false);
                callback(matches);   
            });
        } else {
            var states = $scope.StateObjects;
            for (var i = 0; i < states.length; i++) {
                var state = states[i];
                var stateFull = state["State"];
                var stateShort = state["Abbrev"];
                if (stateFull == stateSelected) {
                    VerdictsService.searchVerdicts($scope.searchVer, stateShort).then(function (data) {
                        var verdicts = data;
                        var matches = SearchService.searchVerdicts(verdicts, searchStr, false);
                        callback(matches);
                    });
                }
            }
        }
    }//end search() function.

    var SearchResults = function(result){
    	if(result){
    		createNewProject();
    		$state.go("main.myprojects.search", {newProjectParam : {SearchVerdicts : $scope.searchVer, SearchResults: result}}, {reload: true});    	
    	}
    };
    //MAP 
    $scope.Status = "NoSearch";
    $scope.NoSearch = "./app/lib/img/MapImages/NoSearch.png";       
     $scope.NoSearchHover = function () {
            $scope.NoSearch = "./app/lib/img/MapImages/NoSearchRollOver.png";
    }
    $scope.NoSearchUnhover = function () {
        $scope.NoSearch = "./app/lib/img/MapImages/NoSearch.png";
    }
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
                min: scope.recency[0],
                max: scope.recency[scope.recency.length - 1],
                values: [scope.recency[0]],
                slide: function (event, ui) {
                    scope.searchVer.recency_1 = ui.values;
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
                min: scope.verdictAmount[0],
                max: scope.verdictAmount[scope.verdictAmount.length - 1],
                values: [scope.verdictAmount[0], scope.verdictAmount[scope.verdictAmount.length - 1]],
                slide: function (event, ui) {
                    scope.searchVer.amount_1 = ui.values[0];
                    scope.searchVer.amount_2 = ui.values[1];
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
