var app = angular.module('iterativeSearch');

app.controller('MyProjectsCtrl', ["$rootScope", "$scope", "$state", "MyProjectsService", "TransferDataService", "$window", "$stateParams", function ($rootScope, $scope, $state, MyProjectsService, TransferDataService, $window, $stateParams) {

    $scope.$state = $state;

    $scope.sortProjects = 'Project';
    $scope.sortProjectReverse = false;

    $scope.sortNotes = 'Note';
    $scope.sortNoteReverse = false;

    $scope.searchNote = '';

    //$rootScope.lastSelectedProject = {};

    $scope.createNewProject = function () {
        $state.go("main.myprojects.createnewproject");
    };

    $scope.noteOnClick = function (item) {
        $scope.Note = item;
    };

    $scope.resetPage = function () {
        $rootScope.$emit('projectChange', {} );
    }

    $scope.SaveNoteFromModal = function () {
        //02/12/2012
        var nowDate = new Date();
        var curr_date = nowDate.getDate();
        var curr_month = nowDate.getMonth() + 1;
        var curr_year = nowDate.getFullYear();

        var noteDate = curr_month + "/" + curr_date + "/" + curr_year;

        var noteId = new Date().getTime();

        var newNote = {
            "ID": noteId,
            "NoteName": "NoteTitle",
            "LastOpened": noteDate,
            "ProjectID": $rootScope.lastSelectedProject.ID,
            "Author": "Jane Smith",
            "Contents": $scope.NoteContent
        };

        MyProjectsService.writeNote(newNote);

        $scope.Notes.push(newNote);
    }

    $scope.setProjectClick = function () {
        
        var isSameProject = false;
        if($rootScope.lastSelectedProject != null) {
            isSameProject = (this.project.ID == $rootScope.lastSelectedProject.ID);
        } 

        if ($scope.lastSelected) {
            $scope.lastSelected.selected = '';
        }
        
        this.selected = 'selected';
        $scope.lastSelected = this;

        $rootScope.lastSelectedProject = this.project;
        TransferDataService.set("CurrentProject", this.project);

        //broadcast the event on My Projects click
        $scope.$broadcast("CurrentProject", {
            CurrentProject: this.project
        });

        $scope.Project = this.project;

        if(!isSameProject){
            $scope.resetPage();
        }

        MyProjectsService.getMyProjects().then(function (data) {

            var notesForThisProject = [];
            var notes = data.Notes;
            for (var i = 0 in notes) {
                var note = notes[i];
                if (note.ProjectID == $rootScope.lastSelectedProject.ID) {
                    notesForThisProject.push(note);
                }
            }
            $scope.Notes = notesForThisProject;
        });
    }
    
    $rootScope.$on('noteSaved', function (event, args) {
        MyProjectsService.getMyProjects().then(function (data) {

            var notesForThisProject = [];
            var notes = data.Notes;
            for (var i = 0 in notes) {
                var note = notes[i];
                if (note.ProjectID == $rootScope.lastSelectedProject.ID) {
                    notesForThisProject.push(note);
                }
            }
            $scope.Notes = notesForThisProject;
        });      
    });

    MyProjectsService.getMyProjects().then(function (data) {
        $scope.MyProjects = data.MyProjects;
        $window.sessionStorage.ProjectIdForCreateNewProject = data.MyProjects.length  + 1;
    });
    
}]);