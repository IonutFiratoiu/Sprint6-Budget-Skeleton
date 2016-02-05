/*
$(document).ready(function() {
    $('.input-group.date').datetimepicker({
        format: 'YYYY-MM-DD HH:mm'
    });
});
*/

var app  = angular.module('Sprint6', ['ngRoute']);
var pages = [
    {name: 'Home', url: '', ctrl: 'HomeCtrl'},
    {name: 'Spend', url: 'spend'},
    {name: 'Receive', url: 'receive'}
];

app.config(function($locationProvider, $routeProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

    angular.forEach(pages, function(page) {
        $routeProvider.when('/' + page.url, {
            templateUrl: 'pages/' + (!page.url ? 'index' : page.url) + '.html',
            controller: page.ctrl || 'DummyCtrl'
        })
    });

    $routeProvider.otherwise({
        templateUrl: 'pages/index.html',
        controller: 'HomeCtrl'
    });
});

app.controller('MainCtrl', function($scope) {});

app.controller('DummyCtrl', angular.noop);

app.controller('HomeCtrl', function($scope, TransactionStore) {
    $scope.transactions = [];

    TransactionStore.getTransactionsByMonth(moment().format('YYYY-MM')).then(function(items) {
        $scope.transactions = items;
    });
});