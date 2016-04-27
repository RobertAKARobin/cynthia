"use strict";

(function(){
  angular
  .module("app", [
    "ui.router"
  ])
  .config(Config)
  .run(Run)
  .controller("ctrlMain", CtrlMain);
  
  Config.$inject = ["$stateProvider", "$locationProvider", "$urlRouterProvider"];
  function Config($stateProvider, $locationProvider, $urlRouterProvider){
    $locationProvider.html5Mode(true);
    $stateProvider
    .state("home", {
      url: "/"
    })
    .state("page", {
      url: "/:title/:sub",
      controller: "ctrlMain",
      templateUrl: function($stateParams){
        return("/html/" + $stateParams.title + ".html");
      }
    });
    $urlRouterProvider.otherwise("/home");
  }
  
  Run.$inject = ["$rootScope", "$state"];
  function Run($rootScope, $state){
    $rootScope.$on("$stateChangeSuccess", function(){
      var title = $state.params.title;
      if(title === "gallery" && $state.params.sub){
        title = $state.params.sub;
      }
      $rootScope.title = title;
    })
  }
  
  CtrlMain.$inject = ["$scope"];
  function CtrlMain($scope){
    var vm = $scope;
    vm.content = "Hello, world!"
  }
})();