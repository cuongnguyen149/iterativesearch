angular.module("iterativeSearch")
    .factory("FlaggedVerdictsService", ["$http", "$q", function ($http, $q) {
        var service = {
            getFlaggedVerdicts: getFlaggedVerdicts,
            writeFlaggedVerdict: writeFlaggedVerdict
        }

        function getFlaggedVerdicts() {
            var deferred = $q.defer();

            $http({
                    method: "get",
                    url: "app/model/flaggedVerdicts.json"
                })
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (data) {
                    deferred.reject(data);
                });

            return deferred.promise;
        }

        function writeFlaggedVerdict(params) {
            $http({
                method: 'post',
                url: 'writeFlaggedVerdict',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: params
            }).success(function () {
                console.log('writeFlaggedVerdict success');
            });
        }

        return service;
}]);