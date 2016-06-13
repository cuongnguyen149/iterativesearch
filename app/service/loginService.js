'use strict';

 angular.module('iterativeSearch')
 	.factory("LoginSvc", ["$http", "$q", function ($http, $q) {
        var service = {
            getUser: getUser,
            repairData: repairData
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

        function repairData() {
            $http({
                method: 'get',
                url: 'repairdata',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).success(function () {
                console.log('repairdata success');
            });
        }

        return service;
 	}]);