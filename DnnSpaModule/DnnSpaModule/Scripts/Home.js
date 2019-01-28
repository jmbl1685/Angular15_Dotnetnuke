"use strict";

angular
  .module("HomeController", [])
  .controller("HomeController", function($scope, $http) {
    $scope.title = "Home Component";
    $scope.message = "Go to the About Component";
  });
