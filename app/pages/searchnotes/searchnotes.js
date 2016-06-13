var app = angular.module('iterativeSearch');

app.controller('SearchNotesCtrl', ["$scope", "$state", "MyProjectsService", "VerdictsService", "ArchivedVerdictsService", "SearchService", "TransferDataService", function ($scope, $state, MyProjectsService, VerdictsService, ArchivedVerdictsService, SearchService, TransferDataService) {

    $scope.Notes = [];
    $scope.sortNotes = 'Note';
    $scope.sortNotesReverse = false;

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

    $scope.noteOnClick = function (item) {
        $scope.Note = item;
    }

    $scope.setNoteClick = function (note) {
        if ($scope.lastSelected) {
            $scope.lastSelected.selected = '';
        }
        this.selected = 'selected';
        $scope.lastSelected = this;
        $scope.lastSelectedProject = this.project;

        var verdict = note.Verdict;

        //If this note was associated with a Verdict.
        if(verdict) {
            TransferDataService.set("Verdict", verdict);
            $state.go("main.myprojects.verdicts");
        } else {

        }    
    }

    $scope.addMatchesToNotes = function (matches) {
        if(matches) {
            var toggle = 1;
            for (var i = 0; i < matches.length; i++){
                var match = matches[i];
                //TODO this is test code for the demo
                if(toggle == 1) {
                    match["tempDisplayStr"] = "fetal";
                } else if(toggle == 2) {
                    match["tempDisplayStr"] = "Malpractice";
                } else {
                    match["tempDisplayStr"] = "OB/Gyn";
                    toggle = 0;
                }
                toggle = toggle + 1;

                $scope.Notes.push(match);
            }    
        }
    }

    $scope.searchVerdicts = function (searchString, searchArchived) {
        if(searchArchived) {
            ArchivedVerdictsService.getArchivedVerdicts().then(function (data) {
                var archivedVerdicts = data.ArchivedVerdicts;
                var matches = SearchService.searchVerdictNotes(archivedVerdicts, searchString, true); 
                $scope.addMatchesToNotes(matches);  
            });
        }

        VerdictsService.getVerdicts().then(function (data) {
            var verdicts = data.Verdicts;
            var matches = SearchService.searchVerdictNotes(verdicts, searchString, false);   
            $scope.addMatchesToNotes(matches); 
        });
    }

    $scope.searchMyProjects = function (searchString, searchArchived) {
        if(searchArchived) {
            /*
            ArchivedVerdictsService.getArchivedVerdicts().then(function (data) {
                var archivedVerdicts = data.ArchivedVerdicts;
                var matches = SearchService.searchVerdictNotes(archivedVerdicts, searchString, true); 
                this.addMatchesToNotes(matches);  
            });
            */
        }

        MyProjectsService.getMyProjects().then(function (data) {
            var myProjects = data.MyProjects;
            var myProjectsNotes = data.Notes;

            var matches = SearchService.searchMyProjectsNotes(myProjects, myProjectsNotes, searchString, false); 
            $scope.addMatchesToNotes(matches); 
        });
    }

    $scope.searchClick = function () {
        var searchString = $scope.searchpage.textBoxSearchTerm;
        var searchArchived = $scope.searchpage.checkStatus;

        $scope.Notes = [];

        this.searchVerdicts(searchString, searchArchived);  
        this.searchMyProjects(searchString, searchArchived); 
    }
}]);