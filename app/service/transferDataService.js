angular.module('iterativeSearch')
    .service('TransferDataService', function () {
        var object = {};

        return {
            get: function (name) {
                return object[name];
            },
            set: function (name, value) {
                object[name] = value;
            }
        };
    });