var app = angular.module('iterativeSearch');

app.controller('ArchivedProjectsCtrl', ["$scope", "$state", 'ArchivedProjectsService', function ($scope, $state, ArchivedProjectsService) {
    $scope.recency = [0, 20];
    $scope.verdictAmount = [0, 60000000];
    $scope.$state = $state;

    $scope.sortProjects = 'Project';
    $scope.sortProjectReverse = false;
    
    $scope.sortNotes = 'Note';
    $scope.sortNoteReverse = false;
    
    $scope.searchNote = '';

    $scope.lastSelectedProject = {};

    $scope.setProjectClick = function () {
        if ($scope.lastSelected) {
            $scope.lastSelected.selected = '';
        }
        this.selected = 'selected';
        $scope.lastSelected = this;
        $scope.lastSelectedProject = this.project;
        ArchivedProjectsService.getArchivedProjects().then(function (data) {
            
            var array = []
            var notes = data.Notes;
            for (var i = 0 in notes) {
                var note = notes[i];
                if (note.ProjectID == $scope.lastSelectedProject.ID) {
                    array.push(note);
                }
            }
            $scope.Notes = array;
        });
    }

    ArchivedProjectsService.getArchivedProjects().then(function (data) {
        $scope.ArchivedProjects = data.ArchivedProjects;
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
                max: 20,
                values: 0,
                slide: function (event, ui) {
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
                values: [0, 60000000],
                slide: function (event, ui) {
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