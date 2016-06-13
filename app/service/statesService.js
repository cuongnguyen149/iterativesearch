angular.module("iterativeSearch")
    .factory("StatesService", ["$http", "$q", function ($http, $q) {
        var service = {
            getStates: getStates
        }

        function getStates() {
            var deferred = $q.defer();

            $http({
                    method: "get",
                    url: "app/model/states.json"
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