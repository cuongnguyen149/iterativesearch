angular.module("iterativeSearch")
    .factory("PrevSearchesService", ["$http", "$q", function ($http, $q) {
        var service = {
            getSearches: getSearches,
            writeSearchObj: writeSearchObj
        }

        function getSearches() {
            var deferred = $q.defer();

            $http({
                    method: "get",
                    url: "app/model/prevsearches.json"
                })
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (data) {
                    deferred.reject(data);
                });

            return deferred.promise;
        }

        function writeSearchObj(params) {
            $http({
                method: 'post',
                url: 'writeSearchObj',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: params
            }).success(function () {
                console.log('writeSearchObj success');
            });
        }

        return service;
}]);