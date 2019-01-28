"use strict";

angular
  .module("appRoutes", ["ngRoute"])
  .config(function($routeProvider, $locationProvider) {
    $routeProvider
      .when("/", {
        templateUrl: "/DesktopModules/DnnSpaModule/Partials/Home.html",
        controller: "HomeController"
      })
      .when("/about", {
        templateUrl: "/DesktopModules/DnnSpaModule/Partials/About.html",
        controller: "AboutController"
      })
      .otherwise({ redirectTO: "/" });

    $locationProvider.html5Mode({
      enable: true,
      requireBase: false
    });
  });

const modules = ["appRoutes", "HomeController", "AboutController"];

angular.module("myApp", modules).config(function() {});
