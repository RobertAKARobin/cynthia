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
        return("/pages/" + $stateParams.title + ".html");
      }
    })
    .state("collection", {
      url: "/collections/:title",
      controller: "ctrlCollection",
      templateUrl: "/pages/collection.html"
    });
    $urlRouterProvider.otherwise("/");
  }
  
  Run.$inject = ["$rootScope", "$state", "$location"];
  function Run($rootScope, $state, $location){
    var $navlinks = $(".menu a");
    var $menus = $(".menu > li");
    $navlinks.each(function(i, link){
      if(link.href.trim() !== "") return;
      link.href = $state.href(
        (link.getAttribute("data-state") || "page"),
        {title: link.textContent.trim().toLowerCase()}
      );
    })
    $rootScope.$on("$stateChangeSuccess", function(){
      $rootScope.title = ($state.params.title || "home");
      $menus.removeClass("active");
      $navlinks.filter("[href='" + $location.$$path + "']").closest(".menu > li").addClass("active");
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
    vm.images = [];
    Imgur.load($scope.$root.title).then(function(response){
      angular.extend(vm, response.data.data);
      vm.images.forEach(function(image){
        image.thumb = image.link.replace(image.id, function(match){
          return(match + "l");
        });
      })
    });
    var sec   = 300;
    vm.image  = null;
    vm.index  = null;
    vm.$wrap  = $("#lightbox");
    vm.$img   = vm.$wrap.find("img");
    vm.$info  = vm.$wrap.find(".info");
    vm.$indx  = vm.$wrap.find(".indx");
    vm.$desc  = vm.$wrap.find(".desc");
    vm.$img.on("load", function(){
      vm.$desc.text(vm.image.description || "");
      vm.$indx.text((vm.index + 1) + "/" + vm.images.length);
      vm.$img.fadeIn(sec);
      vm.$info.fadeIn(sec);
    });
    vm.reveal = function(){
      vm.$wrap.fadeIn(sec);
    }
    vm.hide   = function(){
      vm.$wrap.fadeOut(sec);
      vm.$img.fadeOut(sec);
    }
    vm.goto   = function($index){
      vm.index  = $index;
      vm.image  = vm.images[$index];
      vm.$img.fadeOut(sec, setSource);
      vm.$info.fadeOut(sec);
    }
    vm.cycle  = function(change){
      var max = vm.images.length - 1;
      var i = vm.index;
      i+= (change || 0);
      if(i > max) i = 0;
      if(i < 0) i = max;
      vm.goto(i)
    }
    function setSource(){
      vm.$img.attr("src", vm.image.link);
    }
  }
})();