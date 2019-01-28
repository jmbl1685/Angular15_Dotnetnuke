"use strict";

angular
  .module("HomeController", [])
  .controller("HomeController", function($scope, $http) {
    $scope.title = "Angular.js the best";
    $scope.my_name = "Juan Batty";
    console.log("Home controller");
  });
