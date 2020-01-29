angular.module("cp.currencyFormat", [])
    .directive('cpCurrency', ['$filter', '$locale', '$parse', '$timeout', function ($filter, $locale, $parse, $timeout) {
        var formatter = function (num, decimal) {
            return '' + $filter('number')((num || 0), decimal);
        };

        var maxValidator = function (ctrl, value, limit) {
            var max = parseFloat(limit);
            var validity = ctrl.$isEmpty(value) || isNaN(max) || value <= max;
            ctrl.$setValidity('max', validity);
            return value;
        }

        var minValidator = function (ctrl, value, limit) {
            var min = parseFloat(limit);
            var validity = ctrl.$isEmpty(value) || isNaN(min) || value >= min;
            ctrl.$setValidity('min', validity);
            return value;
        }

        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                ngModel: '=',
                min: '@',
                max: '@'
            },
            link: function (scope, element, attr, ngModel) {

                element.css("text-align", "right");

                var decimal_han = parseInt(attr.cpCurrency || 2);

                ngModel.$formatters.unshift(function (num) {
                    return '' + $filter('number')((num || 0), decimal_han);
                });

                ngModel.$parsers.unshift(function (str) {

                    if (str == undefined || str == '') {
                        $timeout(function () {
                            scope.ngModel = 0;
                        }, 1);

                    }

                    return parseFloat(str.replace(new RegExp("[^0-9\\" + $locale.NUMBER_FORMATS.DECIMAL_SEP + "-]", "g"), '').replace($locale.NUMBER_FORMATS.DECIMAL_SEP, '.')).toFixed(decimal_han) * 1 || 0;
                });

                element.bind("keypress", function (event) {
                    if ((event.which < 48 || event.which > 57) && event.which != 8 && event.key != "Backspace" && event.key != "1" && event.key != "2" && event.key != "3" && event.key != "4" && event.key != "5" && event.key != "6" && event.key != "7" && event.key != "8" && event.key != "9" && event.key != "0" && event.key != $locale.NUMBER_FORMATS.DECIMAL_SEP) {

                        if (attr.cpCurrencyNegative != undefined && (event.which == 189 || event.key == "-")) {

                        } else {
                            event.preventDefault();
                        }

                    }
                });

                element.bind('blur', function () {
                    element.val(formatter(ngModel.$modelValue, decimal_han))
                });

                element.bind('focus', function () {
                    if (element[0].readOnly == false && element[0].disabled == false) {
                        element.val((ngModel.$modelValue || "0").toString().replace(/[^0-9\.-]/g, '').replace('.', $locale.NUMBER_FORMATS.DECIMAL_SEP));

                        this.select();
                    }
                });


                if (attr.min) {
                    ngModel.$parsers.push(function (value) {
                        var min = $parse(attr.min)(scope);
                        return minValidator(ngModel, value, min);
                    });

                    scope.$watch('min', function (value) {
                        minValidator(ngModel, ngModel.$modelValue, value);
                    });
                }

                if (attr.max) {
                    ngModel.$parsers.push(function (value) {
                        var max = $parse(attr.max)(scope);
                        return maxValidator(ngModel, value, max);
                    });

                    scope.$watch('max', function (value) {
                        maxValidator(ngModel, ngModel.$modelValue, value);
                    });
                }
            }
        };
    }])