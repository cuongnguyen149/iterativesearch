angular.module("iterativeSearch")
    .factory("MyProjectsService", ["$http", "$q", function ($http, $q) {
        var service = {
            getMyProjects: getMyProjects,
            writeNote: writeNote,
            writeNewProject: writeNewProject
        }

        function getMyProjects() {
            var deferred = $q.defer();

            $http({
                    method: "get",
                    url: "app/model/myprojects.json"
                })
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (data) {
                    deferred.reject(data);
                });

            return deferred.promise;
        }
        
        function writeNote(note){
            $http({
                method: 'post',
                url: 'writeprojectnote',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: note
            }).success(function () {
                console.log('success');
            });
        }

        function writeNewProject(project){
            $http({
                method: 'post',
                url: 'writenewproject',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: project
            }).success(function () {
                console.log('success');
            });
        }

        return service;
}]);