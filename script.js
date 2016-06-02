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
    var navbar    = document.querySelector(".navbar");
    var navlinks  = navbar.querySelectorAll("a");
    var menus     = document.querySelectorAll(".navbar > li");
    angular.forEach(navlinks, function(link){
      if(link.href.trim() !== "") return;
      link.href = $state.href(
        (link.getAttribute("data-state") || "page"),
        {title: link.textContent.trim().replace(/ /g, "").toLowerCase()}
      );
    })
    $rootScope.$on("$stateChangeSuccess", function(){
      var navlink = navbar.querySelector("[href='" + $location.$$path + "']");
      var menu    = navlink.parentElement;
      if(!menu.parentElement.classList.contains("navbar")){
        menu      = menu.parentElement.parentElement;
      }
      $rootScope.title = ($state.params.title || "home");
      angular.forEach(navbar.querySelectorAll(".active"), function(el){
        el.classList.remove("active");
      });
      menu.classList.add("active");
    })
  }
  
  CtrlPage.$inject = ["$scope"];
  function CtrlPage($scope){
    var vm = $scope;
    vm.content = "Hello, world!"
  }
  
  CtrlCollection.$inject = ["$scope", "Imgur", "$location"];
  function CtrlCollection($scope, Imgur, $location){
    var vm    = $scope;
    var box   = document.querySelector(".lightbox");
    var img   = box.querySelector(".image");
    var loader= box.querySelector(".secretLoader");
    var slide = box.querySelector(".slide");
    box.style.opacity = 0;
    vm.images = [];
    vm.image  = {};
    vm.index  = null;
    vm.cycle  = function(goto){
      var newindex = vm.index, newimg;
      var isHidden = false, isLoaded = false;
      var reveal = function(){
        if(!isHidden) return;
        else if(isHidden && !isLoaded) img.src = newimg.thumb;
        else if(isHidden && isLoaded) img.src = newimg.full;
      }
      var listenerIsLoaded = function(){
        isLoaded = true;
        loader.removeEventListener("load", listenerIsLoaded);
        reveal();
      }
      if(goto === "+") newindex += 1;
      else if(goto === "-") newindex -= 1;
      else newindex = goto;
      if(newindex >= vm.images.length) newindex = 0;
      if(newindex < 0) newindex = vm.images.length - 1;
      newimg = vm.images[newindex];
      $location.hash(newindex);
      loader.src = newimg.full;
      loader.addEventListener("load", listenerIsLoaded);
      fadeOut(slide, function(){
        isHidden    = true;
        vm.index    = newindex;
        vm.image    = newimg;
        fadeIn(box);
        fadeIn(slide);
        reveal();
        $scope.$apply();
      });
    }
    vm.hide   = function(){
      fadeOut(box);
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
    function fadeOut(el, callback){
      var opacity = parseFloat(el.style.opacity || window.getComputedStyle(el).opacity);
      var timer   = setInterval(function(){
        if(opacity >= 0){
          opacity = opacity - 0.05;
          el.style.opacity = opacity;
        }else{
          clearInterval(timer);
          el.style.display = "none";
          if(callback) callback();
        }
      }, 15);
    }
    function fadeIn(el, callback){
      el.style.display = "";
      var opacity = (el.style.opacity || window.getComputedStyle(el).opacity);
      console.log(el.classList + " " + opacity)
      opacity = parseFloat(opacity)
      console.log(el.classList + " " + opacity)
      var timer   = setInterval(function(){
        if(opacity <= 1){
          opacity = opacity + 0.05;
          el.style.opacity = opacity;
        }else{
          clearInterval(timer);
          if(callback) callback();
        }
      }, 15);
    }
  }
})();