'use strict';

 angular.module('iterativeSearch')
 	.factory("LoginSvc", ["$http", "$q", function ($http, $q) {
        var service = {
            getUser: getUser
        }

        function getUser() {
            var deferred = $q.defer();

            $http({
                    method: "get",
                    url: "app/model/user.json"
                })
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (data) {
                    deferred.reject(data);
                });

            return deferred.promise;
        }

        return service;
 	}]);