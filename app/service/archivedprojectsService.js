angular.module("iterativeSearch")
    .factory("ArchivedProjectsService", ["$http", "$q", function ($http, $q) {
        var service = {
            getArchivedProjects: getArchivedProjects
        }

        function getArchivedProjects() {
            var deferred = $q.defer();

            $http({
                    method: "get",
                    url: "app/model/archivedprojects.json"
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