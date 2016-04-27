"use strict";

(function(){
  angular
  .module("app", [
    "ui.router"
  ])
  .config(Config);
  
  Config.$inject = ["$stateProvider", "$locationProvider", "$urlRouterProvider"];
  function Config($stateProvider, $locationProvider, $urlRouterProvider){
    if(window.location.hostname !== "localhost"){
      $locationProvider.html5Mode(true);
    }
    $stateProvider
    .state("main", {
      url: "/"
    })
    .state("cxn", {
      url: "/collection/:a"
    })
    .state("abt", {
      url: "/about/:a"
    })
    .state("contact", {
      url: "/contact"
    });
    $urlRouterProvider.otherwise("/");
  }
})();