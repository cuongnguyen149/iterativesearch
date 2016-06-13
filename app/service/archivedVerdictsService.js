angular.module("iterativeSearch")
    .factory("ArchivedVerdictsService", ["$http", "$q", function ($http, $q) {
        var service = {
            getArchivedVerdicts: getArchivedVerdicts
        }

        function getArchivedVerdicts() {
            var deferred = $q.defer();

            $http({
                    method: "get",
                    url: "app/model/archivedverdicts.json"
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
