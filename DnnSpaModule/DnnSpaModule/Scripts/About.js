"use strict";

angular
  .module("AboutController", [])
  .controller("AboutController", function($scope, $http) {
    $scope.title = "This is a test";

    console.log("About controller");
  });
