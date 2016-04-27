"use strict";

(function(){
  angular
  .module("app", [
    "ui.router"
  ])
  .config(Config)
  .run(Run)
  .factory("Imgur", Imgur)
  .controller("ctrlPage", CtrlPage)
  .controller("ctrlCollection", CtrlCollection);
  
  Imgur.$inject = ["$http"];
  function Imgur($http){
    var Imgur = {};
    var albums = {
      "rings": "g1xta",
      "art": "k1KwU",
      "accessories": "Da9IB",
      "misc": "CUS9u"
    }
    Imgur.load = function(albumName){
      var albumId = albums[albumName];
      return $http.get("https://api.imgur.com/3/album/" + albumId, {
        headers: {
          "Authorization": "Client-ID df6bf38c6d672bc"
        }
      });
    }
    return Imgur;
  }
  
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
  
  CtrlCollection.$inject = ["$scope", "Imgur"];
  function CtrlCollection($scope, Imgur){
    var vm = $scope;
    Imgur.load("rings").then(function(response){
      response.data.data.images.forEach(function(image){
        image.thumb = image.link.replace(image.id, function(match){
          return(match + "m");
        });
      });
      angular.extend(vm, response.data.data);
    });
  }
})();