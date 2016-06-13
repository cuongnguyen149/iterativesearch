angular.module("iterativeSearch")
    .factory("VerdictsService", ["$http", "$q", function ($http, $q) {
        var service = {
            getVerdicts: getVerdicts,
            writeNoteVerdict: writeNoteVerdict,
            searchVerdicts: searchVerdicts,
            writeFlaggedVerdict: writeFlaggedVerdict,
            writeViewedVerdict: writeViewedVerdict
        }

        function getVerdicts() {
            var deferred = $q.defer();

            $http({
                    method: "get",
                    url: "app/model/verdicts.json"
                })
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (data) {
                    deferred.reject(data);
                });

            return deferred.promise;
        }

        function searchVerdicts(params, jurisdiction) {
            var deferred = $q.defer();
            $http({
                    method: "get",
                    url: "app/model/verdicts.json"
                })
                .success(function (data) {
                    var dataReturn = [];
                    data.Verdicts.forEach(function(Verdict){
                        //Ensure we are in the range of amounts
                        if(Verdict.Amount <= params.amount_2 && Verdict.Amount >= params.amount_1) {
                            //Check jurisdiction
                            if(jurisdiction == "All" || Verdict.State == jurisdiction ) {

                                //Finally check the recency
                                var verdictDateStr = Verdict.Date;
                                var verdictDate = new Date(verdictDateStr); 

                                // var recencyStartYears = params.recency_2;
                                // var recencyStartMonths = recencyStartYears * 12;

                                var recencyEndYears = params.recency_1;
                                var recencyEndMonths = recencyEndYears * 12;

                                var startDate = new Date();
                                var endDate = new Date();
                                var nowDate = new Date();
                                var currentMonth = nowDate.getMonth();

                                // startDate.setMonth(currentMonth - recencyStartMonths);
                                endDate.setMonth(currentMonth - recencyEndMonths);

                                if(verdictDate <= endDate) {                      
                                    dataReturn.push(Verdict);
                                }     
                            }                                                 
                        }
                    });

                    deferred.resolve(dataReturn);
                })
                .error(function (data) {
                    deferred.reject(data);
                });

            return deferred.promise;
        }

        function writeViewedVerdict(params) {
            $http({
                method: 'post',
                url: 'writeViewedVerdict',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: params
            }).success(function () {
                console.log('writeViewedVerdict success');
            });
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

        function writeNoteVerdict(params) {
            $http({
                method: 'post',
                url: 'writenoteverdict',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: params
            }).success(function () {
                console.log('success');
            });
        }

        return service;
}]);