﻿# AngularJS input currency format directive
 
[Demo](https://cempehlivan.github.io/cp-currency-format/example/)
 
Using

    var  app = angular.module("ExampleApp", ["cp.currencyFormat"]);

Default

    <input type="text" ng-model="model1" cp-currency>
4 Decimal

    <input type="text" ng-model="model2" cp-currency="4">

Negative

    <input type="text" ng-model="model3" cp-currency cp-currency-negative>

Validate Min Max Attr

    <input type="text" ng-model="model4" required cp-currency min="10" max="50">
