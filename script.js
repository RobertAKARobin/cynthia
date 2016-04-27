"use strict";

(function(){
  angular
  .module("app", [
    "ui.router"
  ])
  .config(Config);
  
  Config.$inject = ["$stateProvider", "$urlRouterProvider"];
  function Config($stateProvider, $urlRouterProvider){
    $stateProvider
    .state("main", {
      url: "/"
    })
    .state("cxn", {
      url: "collection/:a"
    })
    .state("abt", {
      url: "about/:a"
    })
    .state("contact", {
      url: "contact"
    });
    $urlRouterProvider.otherwise("/");
  }
})();