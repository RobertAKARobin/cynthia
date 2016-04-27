"use strict";

(function(){
  angular
  .module("app", [
    "ui.router"
  ])
  .config(Config)
  .run(Run)
  .controller("ctrlPage", CtrlPage)
  .controller("ctrlCollection", CtrlCollection);
  
  Config.$inject = ["$stateProvider", "$locationProvider", "$urlRouterProvider"];
  function Config($stateProvider, $locationProvider, $urlRouterProvider){
    $locationProvider.html5Mode(true);
    $stateProvider
    .state("home", {
      url: "/"
    })
    .state("page", {
      url: "/:title",
      controller: "ctrlPage",
      templateUrl: function($stateParams){
        return("/html/" + $stateParams.title + ".html");
      }
    })
    .state("collection", {
      url: "/collections/:title",
      controller: "ctrlCollection",
      templateUrl: "/html/collection.html"
    });
    $urlRouterProvider.otherwise("/");
  }
  
  Run.$inject = ["$rootScope", "$state", "$location"];
  function Run($rootScope, $state, $location){
    $(".menu a").each(function(i, link){
      if(link.href.trim() !== "") return;
      link.href = $state.href(
        (link.getAttribute("data-state") || "page"),
        {title: link.textContent.trim().toLowerCase()}
      );
    })
    $rootScope.$on("$stateChangeSuccess", function(){
      $rootScope.title = $state.params.title;
      $(".menu > li").removeClass("active");
      $(".menu a[href='" + $location.$$path + "']")
        .closest(".menu > li").addClass("active");
    })
  }
  
  CtrlPage.$inject = ["$scope"];
  function CtrlPage($scope){
    var vm = $scope;
    vm.content = "Hello, world!"
  }
  
  CtrlCollection.$inject = ["$scope"];
  function CtrlCollection($scope){
    var vm = $scope;
    vm.content = "This is a collection."
  }
})();