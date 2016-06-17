var app = angular.module('iterativeSearch');

app.controller('SearchCtrl', ["$rootScope", "$scope", "$state", '$filter', "FlaggedVerdictsService", "PrevSearchesService", "SearchService", "StatesService", "MyProjectsService", "VerdictsService", "TransferDataService", "$stateParams",
    function ($rootScope, $scope, $state, $filter, FlaggedVerdictsService, PrevSearchesService, SearchService, StatesService, MyProjectsService, VerdictsService, TransferDataService, $stateParams) {

        $scope.$state = $state;
        $scope.sortSearch = 'Result';
        $scope.sortSearchReverse = false;

        PrevSearchesService.getSearches().then(function (data) {

            $rootScope.SearchStrs = {};
            var curProjId = $rootScope.lastSelectedProject.ID;

            var searches = data.Searches;
            for (var i = 0; i < searches.length; i++) {
                var search = searches[i];

                if (curProjId == search.ProjectId) {
                    var searchString = search.SearchStr;
                    $rootScope.SearchStrs[searchString] = true;
                }
            }
        });

        $scope.search = function () {
            search();
        }

        $rootScope.$on('projectChange', function (event, args) {
            //Set page back to default for new project.
            if ($stateParams.newProjectParam == null) {
                $scope.recency = [0, 20];
                $scope.verdictAmount = [0, 60000000];
                $scope.searchVer = {
                    text: '',
                    jurisdiction: 'All',
                    amount_1: $scope.verdictAmount[0],
                    amount_2: $scope.verdictAmount[$scope.verdictAmount.length - 1],
                    recency_1: $scope.recency[0]
                }
            }

	    $scope.SearchResults = [];
            $rootScope.searchObj = null;
        });

        var setInitialFlagsOnVerdicts = function (verdicts) {

            FlaggedVerdictsService.getFlaggedVerdicts().then(function (flaggedVerdictsData) {
                var flaggedVerdicts = flaggedVerdictsData.FlaggedVerdicts;

                var curProjId = $rootScope.lastSelectedProject.ID;

                var searchResults = [];
                for (var i = 0; i < verdicts.length; i++){
                    var verdict = verdicts[i];
                    var verdictId = verdict.id;
                    
                    var matched = false;
                    for (var j = 0; j < flaggedVerdicts.length; j++){
                        var flaggedVerdict = flaggedVerdicts[j];
                        var flaggedVerdictId = flaggedVerdict.VerdictId;
                        var flaggedVerdictProjId = flaggedVerdict.ProjectId;
                        if(verdictId == flaggedVerdictId && curProjId == flaggedVerdictProjId) {
                            matched = true;

                            verdict.Flagged = flaggedVerdict.Flagged;
                            verdict.SearchTerms = flaggedVerdict.SearchTerms;
                            break;
                        }
                    }

                    if(!matched){
                        verdict.Flagged = false;
                        verdict.SearchTerms = [];
                    }

                    searchResults.push(verdict);
                }

                $scope.SearchResults = searchResults;
            });
        }

        var search = function () {

            //change the map
            if ($rootScope.MapStatus) {
                $scope.Status = $rootScope.MapStatus;
            } else {
                $scope.Status = 'Malpractice';
            }

            var stateSelected = $scope.searchVer.jurisdiction;
            var searchStr = $scope.searchVer.text.toLowerCase();
            var recency_1 = $scope.searchVer.recency_1;

            var amount_1 = $scope.searchVer.amount_1;
            var amount_2 = $scope.searchVer.amount_2;

            var id = new Date().getTime();

            var nowDate = new Date();
            var curr_date = nowDate.getDate();
            var curr_month = nowDate.getMonth() + 1;
            var curr_year = nowDate.getFullYear();

            var nowDateStr = curr_month + "/" + curr_date + "/" + curr_year;

            //Save the search obj for previous searches page only if that search term doesn't already exist.
            var searchObj = {};
            searchObj["id"] = id;
            searchObj["Amount_1"] = amount_1;
            searchObj["Amount_2"] = amount_2;
            searchObj["SearchStr"] = searchStr;
            searchObj["Recency_1"] = recency_1;
            searchObj["Jurisdiction"] = stateSelected;
            searchObj["ProjectId"] = $rootScope.lastSelectedProject.ID;
            searchObj["Created"] = nowDateStr;

            if (!$rootScope.SearchStrs[searchStr]) {
                PrevSearchesService.writeSearchObj(searchObj);
                $rootScope.SearchStrs[searchStr] = true;
            }

            //Save the searchobj for when user returns to this page.
            $rootScope.searchObj = searchObj;
            
            if (stateSelected == "All") {
                VerdictsService.searchVerdicts($scope.searchVer, "All").then(function (verdicts) {
                    var matches = SearchService.searchVerdicts(verdicts, searchStr, false);
                    setInitialFlagsOnVerdicts(matches);
                });
            } else {
                var states = $rootScope.StateObjects;
                for (var i = 0; i < states.length; i++) {
                    var state = states[i];
                    var stateFull = state["State"];
                    var stateShort = state["Abbrev"];
                    if (stateFull == stateSelected) {
                        VerdictsService.searchVerdicts($scope.searchVer, stateShort).then(function (verdicts) {
                            var matches = SearchService.searchVerdicts(verdicts, searchStr, false);
                            setInitialFlagsOnVerdicts(matches);
                        });
                        break;
                    }
                }
            }
        }

        //Coming from New Project Screen.
        if ($stateParams.newProjectParam != null) {
            $scope.Status = "CreateNewProject";
            $scope.recency = [parseFloat($stateParams.newProjectParam.SearchVerdicts.recency_1), 20];
            $scope.verdictAmount = [parseFloat($stateParams.newProjectParam.SearchVerdicts.amount_1), parseFloat($stateParams.newProjectParam.SearchVerdicts.amount_2)];
            $scope.searchVer = {
                text: $stateParams.newProjectParam.SearchVerdicts.text,
                jurisdiction: 'All',
                amount_1: $scope.verdictAmount[0],
                amount_2: $scope.verdictAmount[$scope.verdictAmount.length - 1],
                recency_1: $scope.recency[0]
            }
            $scope.search();
        } else if ($rootScope.searchObj != null && $stateParams.newProjectParam == null) {
            //We need to repopulate the search page as we came back to it and have a saved search.
            $scope.recency = [parseFloat($rootScope.searchObj["Recency_1"]), 20];
            $scope.verdictAmount = [parseFloat($rootScope.searchObj["Amount_1"]), parseFloat($rootScope.searchObj["Amount_2"])];
            $scope.searchVer = {
                text: $rootScope.searchObj["SearchStr"],
                jurisdiction: $rootScope.searchObj["Jurisdiction"],
                amount_1: $rootScope.searchObj["Amount_1"],
                amount_2: $rootScope.searchObj["Amount_2"],
                recency_1: $rootScope.searchObj["Recency_1"],
            }
            $scope.search();
        } else {
            $scope.Status = "NoSearch";
            $scope.recency = [0, 20];
            $scope.verdictAmount = [0, 60000000];
            $scope.searchVer = {
                text: '',
                jurisdiction: 'All',
                amount_1: $scope.verdictAmount[0],
                amount_2: $scope.verdictAmount[$scope.verdictAmount.length - 1],
                recency_1: $scope.recency[0]
            }
        }

        $scope.onFlagClick = function (verdict) {

            //Update the new flag value on the front end.
            var newFlagValue = false;
            for (var i = 0; i < $scope.SearchResults.length; i++) {
                var scopeVerdict = $scope.SearchResults[i];
                if (scopeVerdict.id == verdict.id) {
                    newFlagValue = !$scope.SearchResults[i].Flagged;
                    $scope.SearchResults[i].Flagged = newFlagValue;
                    break;
                }
            }

            var originalSearchStr = $scope.searchVer.text.toLowerCase();
            var searchTerms = verdict.SearchTerms;

            var match = false;
            for (var i = 0; i < searchTerms.length; i++) {
                var searchTerm = searchTerms[i];
                if (searchTerm.toLowerCase() == originalSearchStr) {
                    match = true;
                }
            }
            if (!match) {
                searchTerms.push(originalSearchStr);
            }

            var flaggedVerdict = {};
            flaggedVerdict["VerdictId"] = verdict.id;
            flaggedVerdict["Flagged"] = newFlagValue;
            flaggedVerdict["SearchTerms"] = searchTerms;
            flaggedVerdict["ProjectId"] = $rootScope.lastSelectedProject.ID;

            FlaggedVerdictsService.writeFlaggedVerdict(flaggedVerdict);
        }

        $scope.onProjectClick = function (verdict) {
            var verdictState = verdict.State;

            var states = $rootScope.StateObjects;
            for (var i = 0; i < states.length; i++) {
                var state = states[i];
                var stateFull = state["State"];
                var stateShort = state["Abbrev"];
                if (stateShort == verdictState) {
                    $rootScope.jurisdiction = stateFull;
                }
            }

            TransferDataService.set("Verdict", verdict);
            $rootScope.MapStatus = $scope.Status;
            $state.go("main.myprojects.verdicts");
        }

        $scope.resetPage = function () {
            $scope.searchVer.text = "";
        }

        $scope.enterPressed = function (keyEvent) {
            if (keyEvent.which === 13) {
                search();
            }
        };

        StatesService.getStates().then(function (data) {
            var states = data.States;
            $rootScope.StateObjects = states;
            var stateFullNames = [];
            for (var i = 0; i < states.length; i++) {
                var state = states[i];
                var stateFullName = state["State"];
                stateFullNames.push(stateFullName);
            }

            $scope.Select = stateFullNames;
        });


        //---- Map ----
        $scope.NoSearch = "./app/lib/img/MapImages/NoSearch.png";
        $scope.MalPracticeCenter = "./app/lib/img/MapImages/CenterNotHover.png";
        $scope.PatentInfringementCenter = "./app/lib/img/MapImages/CenterNotHover.png";
        $scope.Invalid = "./app/lib/img/MapImages/InvalidNotHover.png";
        $scope.Damages = "./app/lib/img/MapImages/DamagesNotHover.png";
        $scope.Agreement = "./app/lib/img/MapImages/AgreementNotHover.png";
        $scope.Injury = "./app/lib/img/MapImages/InjuryNotHover.png";
        $scope.BrainDamage = "./app/lib/img/MapImages/BrainDamageNotHover.png";
        $scope.Death = "./app/lib/img/MapImages/DeathNotHover.png";
        $scope.LeftMalPractice = "./app/lib/img/MapImages/LeftNotHover.png";
        $scope.CenterBrainDamage = "./app/lib/img/MapImages/BrainDamageCenterNotHover.png";
        $scope.Child = "./app/lib/img/MapImages/ChildNotHover.png";
        $scope.Fetal = "./app/lib/img/MapImages/FetalNotHover.png";
        $scope.Adult = "./app/lib/img/MapImages/AdultNotHover.png";
        $scope.LeftBrainDamage = "./app/lib/img/MapImages/LeftNotHover.png";
        $scope.CenterFetal = "./app/lib/img/MapImages/FetalCenterNotHover.png";

        $scope.NoSearchHover = function () {
            $scope.NoSearch = "./app/lib/img/MapImages/NoSearchRollOver.png";
        }
        $scope.NoSearchUnhover = function () {
            $scope.NoSearch = "./app/lib/img/MapImages/NoSearch.png";
        }

        $scope.MalPracticeCenterHover = function () {
            $scope.MalPracticeCenter = "./app/lib/img/MapImages/MalpracticeHover.png";
        }
        $scope.MalPracticeCenterUnhover = function () {
            $scope.MalPracticeCenter = "./app/lib/img/MapImages/CenterNotHover.png";
        }
        $scope.MalInjuryHover = function () {
            $scope.Injury = "./app/lib/img/MapImages/InjuryHover.png";
        }
        $scope.MalInhuryUnhover = function () {
            $scope.Injury = "./app/lib/img/MapImages/InjuryNotHover.png";
        }
        $scope.MalBrainDamageHover = function () {
            $scope.BrainDamage = "./app/lib/img/MapImages/BrainDamageHover.png";
        }
        $scope.MalBrainDamageUnhover = function () {
            $scope.BrainDamage = "./app/lib/img/MapImages/BrainDamageNotHover.png";
        }
        $scope.MalDeathHover = function () {
            $scope.Death = "./app/lib/img/MapImages/DeathHover.png";
        }
        $scope.MalDeathUnhover = function () {
            $scope.Death = "./app/lib/img/MapImages/DeathNotHover.png";
        }

        $scope.LeftMalPracticeHover = function () {
            $scope.LeftMalPractice = "./app/lib/img/MapImages/LeftMalPracticeHover.png";
        }
        $scope.LeftMalPracticeUnhover = function () {
            $scope.LeftMalPractice = "./app/lib/img/MapImages/LeftNotHover.png";
        }
        $scope.CenterBrainDamageHover = function () {
            $scope.CenterBrainDamage = "./app/lib/img/MapImages/BrainDamageCenterHover.png";
        }
        $scope.CenterBrainDamageUnhover = function () {
            $scope.CenterBrainDamage = "./app/lib/img/MapImages/BrainDamageCenterNotHover.png";
        }
        $scope.ChildHover = function () {
            $scope.Child = "./app/lib/img/MapImages/ChildHover.png";
        }
        $scope.ChildUnhover = function () {
            $scope.Child = "./app/lib/img/MapImages/ChildNotHover.png";
        }
        $scope.FetalHover = function () {
            $scope.Fetal = "./app/lib/img/MapImages/FetalHover.png";
        }
        $scope.FetalUnhover = function () {
            $scope.Fetal = "./app/lib/img/MapImages/FetalNotHover.png";
        }
        $scope.AdultHover = function () {
            $scope.Adult = "./app/lib/img/MapImages/AdultHover.png";
        }
        $scope.AdultUnhover = function () {
            $scope.Adult = "./app/lib/img/MapImages/AdultNotHover.png";
        }

        $scope.LeftBrainDamageHover = function () {
            $scope.LeftBrainDamage = "./app/lib/img/MapImages/LeftBrainDamageHover.png";
        }
        $scope.LeftBrainDamageUnhover = function () {
            $scope.LeftBrainDamage = "./app/lib/img/MapImages/LeftNotHover.png";
        }
        $scope.CenterFetalHover = function () {
            $scope.CenterFetal = "./app/lib/img/MapImages/FetalCenterHover.png";
        }
        $scope.CenterFetalUnhover = function () {
                $scope.CenterFetal = "./app/lib/img/MapImages/FetalCenterNotHover.png";
            }
            //Map for new project.
        $scope.PatentInfringementCenterHover = function () {
            $scope.PatentInfringementCenter = "./app/lib/img/MapImages/PatentInfringementHover.png";
        }
        $scope.PatentInfringementCenterUnhover = function () {
            $scope.PatentInfringementCenter = "./app/lib/img/MapImages/CenterNotHover.png";
        }
        $scope.AgreementHover = function () {
            $scope.Agreement = "./app/lib/img/MapImages/AgreementHover.png";
        }
        $scope.AgreementUnhover = function () {
            $scope.Agreement = "./app/lib/img/MapImages/AgreementNotHover.png";
        }
        $scope.InvalidHover = function () {
            $scope.Invalid = "./app/lib/img/MapImages/InvalidHover.png";
        }
        $scope.InvalidUnhover = function () {
            $scope.Invalid = "./app/lib/img/MapImages/InvalidNotHover.png";
        }
        $scope.DamagesHover = function () {
            $scope.Damages = "./app/lib/img/MapImages/DamagesHover.png";
        }
        $scope.DamagesUnhover = function () {
                $scope.Damages = "./app/lib/img/MapImages/DamagesNotHover.png";
            }
            //end Map for new project.

        //Click event on circle.    
        $scope.BrainDamageClick = function () {
            $scope.Status = 'BrainDamage'
        }
        $scope.LeftMalPracticeClick = function () {
            $scope.Status = 'Malpractice'
        }
        $scope.LeftBrainDamageClick = function () {
            $scope.Status = 'BrainDamage'
        }
        $scope.FetalClick = function () {
            $scope.Status = 'Fetal'
        }

        $scope.FilterResult = function (item) {
            item = $filter('FilterResult')(item, $scope.Status);
            return item;
        }
}]);

app.filter('FilterResult', function () {
    return function (item, status) {
        if (status == 'Malpractice' && item.Abstract.toLowerCase().indexOf('malpractice') != -1) {
            return item;
        }

        if (status == 'BrainDamage' &&
            (item.Abstract.toLowerCase().indexOf('brain') != -1 || item.Abstract.toLowerCase().indexOf('damage') != -1)) {
            return item;
        }

        if (status == 'Fetal' && item.Abstract.toLowerCase().indexOf('fetal') != -1) {
            return item;
        }
    }
});


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
                min: 0,
                max: 60000000,
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
