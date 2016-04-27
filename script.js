"use strict";

(function(){
  angular
  .module("app", [
    "ui.router"
  ])
  .config(Config)
  .run(Run)
  .controller("ctrlPage", CtrlPage)
  .controller("ctrlGallery", CtrlGallery);
  
  Config.$inject = ["$stateProvider", "$locationProvider", "$urlRouterProvider"];
  function Config($stateProvider, $locationProvider, $urlRouterProvider){
    $locationProvider.html5Mode(true);
    $stateProvider
    .state("home", {
      url: "/"
    })
    .state("page", {
      url: "/:title/",
      controller: "ctrlPage",
      templateUrl: function($stateParams){
        return("/html/" + $stateParams.title + ".html");
      }
    })
    .state("gallery", {
      url: "/galleries/:title/",
      controller: "ctrlGallery",
      templateUrl: "/html/gallery.html"
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
  
  CtrlPage.$inject = ["$scope"];
  function CtrlPage($scope){
    var vm = $scope;
    vm.content = "Hello, world!"
  }
  
  CtrlGallery.$inject = ["$scope"];
  function CtrlGallery($scope){
    var vm = $scope;
    vm.content = "This is a gallery."
  }
})();