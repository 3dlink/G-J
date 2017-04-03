// var WEBROOT = "http://192.168.0.101:3000/";
// var WEBROOT = "http://192.168.1.100:3000/";
// var WEBROOT = "http://gail-63230.onmodulus.net/";
// var WEBROOT = "http://192.168.137.52:3000/";
var WEBROOT = "http://45.33.94.253:3030/";
var imgaProfile2 = "";
var imgaBackground2 = "";
var myVar = 0;
(function(){
  var app = angular.module('gailJudy',  [ 'gailJudy.functions', 'gailJudy.controllers', 'gailJudy.routes']);
  app.run(function($ionicPlatform,$ionicHistory) {
    $ionicPlatform.registerBackButtonAction(function (event) {
        navigator.app.backHistory();
    }, 100);
    $ionicPlatform.ready(function() {
      if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if(window.StatusBar) {
        // StatusBar.styleDefault();
      }
    });
  })
})()

// ionic run android -lc --address 192.168.137.129  --port 8100
