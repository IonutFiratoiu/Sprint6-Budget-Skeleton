(function () {
    $(document).ready(function () {
        $('.input-group.date').datetimepicker({
            format: 'YYYY-MM-DD HH:mm'
        });
    });

    var app = angular.module('Sprint6', ['ngRoute']);
    var pages = [
        {name: 'Home', url: '', ctrl: 'HomeCtrl'},
        {name: 'Spend', url: 'spend'},
        {name: 'Receive', url: 'receive'}
    ];

    app.config(function ($locationProvider, $routeProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });

        angular.forEach(pages, function (page) {
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

    app.controller('DummyCtrl', angular.noop);

    app.controller('NavCtrl', function ($scope) {
        $scope.pages = pages;
    });

    app.controller('FormCtrl', function ($scope, TransactionStore, $location) {
        $scope.data = {
            description: 'default',
            amount: 'default',
            date: 'default'
        };

        $scope.submitForm = function () {
            $scope.default = {};
            $scope.reset = function () {
                $scope.form = angular.copy($scope.default);
            };
            if($location.path() === '/spend') {
                $scope.form.amount = -1 * ($scope.form.amount);
            };

            TransactionStore.add($scope.form);
            $scope.reset();
        };
    });

    app.controller('HomeCtrl', function ($scope, TransactionStore) {
        $scope.transactions = [];

        TransactionStore.getTransactionsByMonth(moment().format('YYYY-MM')).then(function (items) {
            $scope.transactions = items;
        });

        $scope.total = function () {
            var total = 0;

            angular.forEach($scope.transactions, function (item) {
                total = total + item.amount;
            });

            return total;
        };

        $scope.deleteOnClick = function (item) {
            TransactionStore.delete(item.id).then(function () {
                TransactionStore.getTransactionsByMonth(moment().format('YYYY-MM'));
            });
        };

        $scope.addClass = function (item, sign) {
            if(sign === 'all') {
                console.log('miauu');
                if(item.amount < 0) {
                    console.log('red');
                    return 'red';
                }else{
                    console.log('green')
                    return 'green';
                };
            };
        };
    });

    app.factory('TransactionStore', function ($http, $q) {
        return (function () {
            var URL = 'http://server.godev.ro:8080/api/ionut/transactions';

            var getTransactionsByMonth = function (month) {
                return $q(function (resolve, reject) {
                    $http({url: URL + '?month=' + month})
                        .then(
                            function (xhr) {
                                if (xhr.status == 200) {
                                    resolve(xhr.data);
                                } else {
                                    reject();
                                }
                            }, reject
                        );
                });
            };

            var add = function (data) {
                return $q(function (resolve, reject) {
                    $http({
                        url: URL,
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: JSON.stringify(data)
                    })
                        .then(
                            function (xhr) {
                                if (xhr.status == 201) {
                                    resolve(xhr.data);
                                } else {
                                    reject();
                                }
                            }, reject
                        );
                });
            };

            var del = function (id) {
                return $q(function (resolve, reject) {
                    $http({
                        url: URL + '/' + id,
                        method: 'DELETE'
                    })
                        .then(
                            function (xhr) {
                                if (xhr.status == 204) {
                                    resolve();
                                } else {
                                    reject();
                                }
                            }, reject
                        );
                });
            };

            return {
                getTransactionsByMonth: getTransactionsByMonth,
                add: add,
                delete: del
            };
        })();
    });

    app.filter('FilterTransactions', function () {
        return function (item, sign) {
            if (item) {
                var result = [];
                angular.forEach(item, function(individualItem) {
                    if (sign === 'all') {
                        result.push(individualItem);
                        return result;
                    } else if (sign === '-' && individualItem.amount < 0) {
                        result.push({
                            date: individualItem.date,
                            description: individualItem.description,
                            amount: Math.abs(individualItem.amount)
                        });
                        return result;
                    } else if (sign === '+' && individualItem.amount > 0) {
                        result.push(individualItem);
                        return result;
                    }
                });
            }

            return result;
        };
    });
})();