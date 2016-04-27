"use strict";

(function(){
  angular
  .module("app", [
    "ui.router"
  ])
  .config(Config)
  .controller("ctrlCollection", CtrlCollection)
  .controller("ctrlStatic", CtrlStatic);
  
  Config.$inject = ["$stateProvider", "$locationProvider", "$urlRouterProvider"];
  function Config($stateProvider, $locationProvider, $urlRouterProvider){
    if(window.location.hostname !== "localhost"){
      $locationProvider.html5Mode(true);
    }
    $stateProvider
    .state("collection", {
      url: "/collection/:a",
      templateUrl: "/html/collection.html",
      controller: "ctrlCollection"
    })
    .state("static", {
      url: "/:a",
      template: "<div data-ng-include='templateUrl()'></div>",
      controller: "ctrlStatic"
    });
    $urlRouterProvider.otherwise("/home");
  }
  
  CtrlCollection.$inject = ["$scope", "$stateParams"];
  function CtrlCollection($scope, $stateParams){
    var vm = $scope;
    vm.title  = $stateParams.a;
  }
  
  CtrlStatic.$inject = ["$scope", "$stateParams"];
  function CtrlStatic($scope, $stateParams){
    var vm = $scope;
    vm.templateUrl = function(){
      return("/html/" + $stateParams.a + ".html");
    }
  }
})();