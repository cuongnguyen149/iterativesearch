var app = angular.module('iterativeSearch', ['ui.router', 'ngSanitize']);

app.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/login');

    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'app/pages/login/login.html',
            controller: "LoginCtrl"
        })
        .state('main', {
            url: '/main',
            templateUrl: 'app/pages/main/main.html',
            controller: "MainCtrl"
        })
        .state('main.myprojects', {
            url: '/myprojects',
            templateUrl: 'app/pages/myprojects/myprojects.html',
            controller: "MyProjectsCtrl"
        })
        .state('main.myprojects.search', {
            url: '/search',
            params: {newProjectParam: null},
            templateUrl: 'app/pages/myprojects/search.html',
            controller: "SearchCtrl"
        })
        .state('main.myprojects.previousSearches', {
            url: '/previoussearches',
            templateUrl: 'app/pages/myprojects/previoussearches.html',
            controller: "PreviousSearchesCtrl"
        })
        .state('main.myprojects.flaggedPages', {
            url: '/flaggedpages',
            templateUrl: 'app/pages/myprojects/flaggedpages.html',
            controller: "FlaggedPagesCtrl"
        })
        .state('main.myprojects.verdicts', {
            url: '/verdicts',
            templateUrl: 'app/pages/myprojects/verdicts.html',
            controller: "VerdictsCtrl"
        })
        .state('main.myprojects.createnewproject', {
            url: '/createnewproject',
            templateUrl: 'app/pages/myprojects/createnewproject/createnewproject.html',
            controller: "CreateNewProjectCtrl"
        })
        .state('main.archivedprojects', {
            url: '/archivedprojects',
            templateUrl: 'app/pages/archivedprojects/archivedprojects.html',
            controller: "ArchivedProjectsCtrl"
        })
        .state('main.archivedprojects.previousSearches', {
            url: '/previoussearches',
            templateUrl: 'app/pages/archivedprojects/previoussearches.html',
            controller: "ArchivedPreviousSearchesCtrl"
        })
        .state('main.archivedprojects.flaggedPages', {
            url: '/flaggedpages',
            templateUrl: 'app/pages/archivedprojects/flaggedpages.html',
            controller: "ArchivedFlaggedPagesCtrl"
        })
        .state('main.searchprojects', {
            url: '/searchprojects',
            templateUrl: 'app/pages/searchprojects/searchprojects.html',
            controller: "SearchProjectsCtrl"
        })
        .state('main.searchnotes', {
            url: '/searchnotes',
            templateUrl: 'app/pages/searchnotes/searchnotes.html',
            controller: "SearchNotesCtrl"
        });

});