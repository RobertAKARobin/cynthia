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
      "artobjects": "k1KwU",
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
        {title: link.textContent.trim().replace(/ /g, "").toLowerCase()}
      );
    })
    $rootScope.$on("$stateChangeSuccess", function(){
      var $navlink = $navlinks.filter("[href='" + $location.$$path + "']");
      $rootScope.title = ($state.params.title || "home");
      $(".active").removeClass("active");
      $navlink.addClass("active");
      $navlink.closest(".menu > li").addClass("active");
    })
  }
  
  CtrlPage.$inject = ["$scope"];
  function CtrlPage($scope){
    var vm = $scope;
    vm.content = "Hello, world!"
  }
  
  CtrlCollection.$inject = ["$scope", "Imgur", "$location"];
  function CtrlCollection($scope, Imgur, $location){
    var vm  = $scope;
    var sec = 300;
    vm.images = [];
    vm.image  = {};
    vm.index  = null;
    vm.wrap   = document.querySelector(".lightbox");
    vm.img    = vm.wrap.querySelector(".image");
    vm.loader = vm.wrap.querySelector(".secretLoader");
    vm.frame  = vm.wrap.querySelector(".frame");
    vm.cycle  = function(goto){
      var newindex = vm.index, newimg;
      var isHidden = false, isLoaded = false;
      var reveal = function(){
        if(!isHidden) return;
        else if(isHidden && !isLoaded) vm.img.src = newimg.thumb;
        else if(isHidden && isLoaded) vm.img.src = newimg.full;
      }
      var listenerIsLoaded = function(){
        isLoaded = true;
        vm.loader.removeEventListener("load", listenerIsLoaded);
        reveal();
      }
      if(goto === "+") newindex += 1;
      else if(goto === "-") newindex -= 1;
      else newindex = goto;
      if(newindex >= vm.images.length) newindex = 0;
      if(newindex < 0) newindex = vm.images.length - 1;
      newimg = vm.images[newindex];
      $location.hash(newindex);
      vm.loader.src = newimg.full;
      vm.loader.addEventListener("load", listenerIsLoaded);
      $(vm.frame).fadeOut(sec, function(){
        isHidden    = true;
        vm.index    = newindex;
        vm.image    = newimg;
        $(vm.wrap).fadeIn(sec);
        $(vm.frame).fadeIn(sec);
        reveal();
        $scope.$apply();
      });
    }
    vm.hide   = function(){
      $(vm.wrap).fadeOut(sec);
      $location.hash("");
    }
    
    Imgur.load($scope.$root.title).then(function(response){
      angular.extend(vm, response.data.data);
      vm.images.forEach(function(image){
        image.thumb = getSize(image, "l");
        image.full  = getSize(image, "h");
      });
      if($location.$$hash !== "" && !isNaN($location.$$hash)){
        vm.cycle(parseInt($location.$$hash));
      }
    });
    function getSize(image, suffix){
      return image.link.replace(image.id, function(match){
        return(match + suffix);
      });
    }
  }
})();