var app  = angular.module('Sprint6', []);

app.controller('MainCtrl', function($scope) {
    $scope.entries = [
        {description: 'Pizza', amount: -20, date: '2016-02-01 13:15'},
        {description: 'Iesire in oras', amount: -47, date: '2016-02-03 22:15'},
        {description: 'Salariu', amount: +2500, date: '2016-01-15 14:15'},
        {description: 'Haine', amount: -20, date: '2016-01-25 18:47'},
        {description: 'Pariuri', amount: +320, date: '2016-01-28 16:25'},
        {description: 'Pantofi', amount: -200, date: '2016-01-25 19:11'}
    ];

    $scope.add = function() {
        $scope.entries.push({
            description: '',
            amuount: 0,
            date: newDate()
        });
    };
});

$(document).ready(function() {
    $('.input-group.date').datetimepicker({
        format: 'YYYY-MM-DD HH:mm'
    });
});
