var app = angular.module('iterativeSearch');

app.controller('VerdictsCtrl', ["$rootScope", "$scope", "$state", "$compile", "VerdictsService", "TransferDataService", "MyProjectsService", function ($rootScope, $scope, $state, $compile, VerdictsService, TransferDataService, MyProjectsService) {
    $scope.$state = $state;
    $scope.CurrentProject = TransferDataService.get("CurrentProject");
    
    //catch event on My Projects click
    $scope.$on("CurrentProject", function(e, d){
        $scope.CurrentProject = d.CurrentProject;
    });
    
    $scope.Verdict = TransferDataService.get("Verdict");

    if (TransferDataService.get("Verdict") === undefined || TransferDataService.get("Verdict") === {}) {
        $state.go("main.myprojects.search");
    }

    VerdictsService.writeViewedVerdict($scope.Verdict);

    $scope.getNotes = function (id) {
        var item = {};
        for (var i = 0 in this.Verdict.Notes) {
            if (this.Verdict.Notes[i].ID == id) {
                item = this.Verdict.Notes[i];
                break;
            }
        }
        $scope.Notes = item;
    }

    $scope.backResult = function () {
        $state.go("main.myprojects.search");
    }

    $scope.previousElement;
    $scope.paragraphClick = function (event) {
        if ($scope.previousElement) {
            $scope.previousElement.children().remove();
            $scope.previousElement.replaceWith($("<span class='ng-scope' ng-click='paragraphClick($event)'>" + $scope.previousElement.text() + "</span>"));
            $compile($(event.currentTarget).parent().contents())($scope)
        }
        $(event.currentTarget).replaceWith($("<p class='focus-result-notes'><img class='view-note' src='./app/lib/img/pencil_purple.png' onclick='popUp()'>" + $(event.currentTarget).text() + "</p>"));
        $scope.previousElement = $("p.focus-result-notes");
    }

    $scope.NoteContent = '';

    $scope.doSaveNote = function (noteId) {
        //02/12/2012
        var nowDate = new Date();
        var curr_date = nowDate.getDate();
        var curr_month = nowDate.getMonth() + 1; //month begin from 0 to 11
        var curr_year = nowDate.getFullYear();

        var noteDate = curr_month + "/" + curr_date + "/" + curr_year;

        var newNote = {
            "ID": noteId,
            "NoteName": "NoteTitle",
            "LastOpened": noteDate,
            "ProjectID": $scope.CurrentProject.ID,
            "Author": "Jane Smith",
            "Contents": $scope.NoteContentVerdict
        };

        $scope.Verdict.Notes.push(newNote);
        VerdictsService.writeNoteVerdict($scope.Verdict);
        MyProjectsService.writeNote(newNote);

        $rootScope.$emit('noteSaved', {} );

        $scope.NoteContent = '';
        $scope.NoteContentVerdict = '';
    }

    $scope.SaveNoteFromModal = function () {
        var noteId = $scope.createNoteId();
        this.doSaveNote(noteId);
    }

    $scope.createNoteId = function () {
        //Just set the new ID to the timestamp since we know it is unique.
        var timestamp = new Date().getTime();
        return timestamp;
    }

    $scope.SaveNote = function () {
        var nowDate = new Date();
        var curr_date = nowDate.getDate();
        var curr_month = nowDate.getMonth() + 1; //month begin from 0 to 11
        var curr_year = nowDate.getFullYear();

        var noteDate = curr_month + "/" + curr_date + "/" + curr_year;

        var highestID = $scope.Verdict.Notes.length == 0 ? 1 : ($scope.Verdict.Notes[$scope.Verdict.Notes.length - 1].ID + 1);
        $scope.previousElement.children().removeAttr("onclick");
        $scope.previousElement.children().attr("ng-click", "getNotes(" + highestID + ")");
        $scope.previousElement.children().attr("data-toggle", "modal");
        $scope.previousElement.children().attr("data-target", "#viewNote");
        var chidren = $scope.previousElement.parent().children();
        $scope.Verdict.Content = '';
        chidren.each(function (a, b) {
            if ($(b).is("span.ng-scope")) {
                $scope.Verdict.Content += $(b).text();
            } else {
                $scope.Verdict.Content += b.outerHTML;
            }
        });
        var newNote = {
            "ID": highestID,
            "NoteName": "Note #" + highestID,
            "LastOpened": noteDate,
            "ProjectID": $scope.CurrentProject.ID,
            "Author": "Jane Smith",
            "Contents": $scope.NoteContent
        }
        $scope.Verdict.Notes.push(newNote);
        VerdictsService.writeNoteVerdict($scope.Verdict);

        var newProjectNote = {
            "ID": new Date().getTime(),
            "NoteName": "Note #" + highestID,
            "LastOpened": noteDate,
            "ProjectID": $scope.CurrentProject.ID,
            "Author": "Jane Smith",
            "Contents": $scope.NoteContent
        }
        MyProjectsService.writeNote(newProjectNote);

        $rootScope.$emit('noteSaved', {} );

        $scope.NoteContent = '';
        $scope.NoteContentVerdict = '';
    }

    $scope.onFlagClick = function () {
        var originalSearchStr = $rootScope.searchObj.SearchStr; 

        var verdict = $scope.Verdict;
        verdict.Flagged = !verdict.Flagged;
        var searchTerms = verdict.SearchTerms;
        var match = false;
        for (var i = 0; i < searchTerms.length; i++) {
            var searchTerm = searchTerms[i];
            if (searchTerm.toLowerCase() == originalSearchStr.toLowerCase()) {
                match = true;
            }
        }
        if (!match) {
            searchTerms.push(originalSearchStr);
            verdict.SearchTerms = searchTerms;
        }

        VerdictsService.writeFlaggedVerdict(verdict);
    }

}]);

app.directive('compile', ['$compile', function ($compile) {
    return function (scope, element, attrs) {
        scope.$watch(
            function (scope) {
                return scope.$eval(attrs.compile);
            },
            function (value) {
                element.html(value);
                $compile(element.contents())(scope).each(function (a, b) {
                    if ($(b).is("span.ng-scope") && !$(b).attr("ng-click")) {
                        $(b).attr("ng-click", "paragraphClick($event)");
                    }
                });
                $compile(element.contents())(scope)
            }
        );
    };
}]);