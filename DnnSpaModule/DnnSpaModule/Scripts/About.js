"use strict";

angular
  .module("AboutController", [])
  .controller("AboutController", function($scope, $http) {
    $scope.title = "About Component";
    $scope.message = "Return";
  });
