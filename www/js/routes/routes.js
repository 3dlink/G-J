(function(){
  var app = angular.module('gailJudy.routes', ['ionic']);
  app.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider){
    $ionicConfigProvider.backButton.previousTitleText(false).text('');
    $stateProvider
    .state('validate',{
      url:'/validate',
      controller: 'validateController',
      cache: false,
    })
    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu/menu.html',
      controller: 'menuController',
      cache: false
    })
    .state('appTwo', {
      url: '/appTwo',
      abstract: true,
      templateUrl: 'templates/menu/profile.html',
      controller: 'menuController',
      cache: false

    })
    .state('appThree', {
      url: '/appThree',
      abstract: true,
      templateUrl: 'templates/menu/menuClean.html',
      controller: 'menuController',
      cache: false

    })
    .state('appFour', {
      url: '/appFour',
      abstract: true,
      templateUrl: 'templates/menu/menuOnly.html',
      controller: 'menuController',
      cache: false

    })
    .state('appFive', {
      url: '/appFive',
      abstract: true,
      templateUrl: 'templates/menu/menuContact.html',
      controller: 'menuController',
      cache: false

    })
    .state('appSix', {
      url: '/appSix',
      abstract: true,
      templateUrl: 'templates/menu/terms.html',
      controller: 'menuController',
      cache: false

    })
    .state('appSeven', {
      url: '/appSeven',
      abstract: true,
      templateUrl: 'templates/menu/menuMember.html',
      controller: 'menuController',
      cache: false

    })
    .state('appNine', {
      url: '/appNine',
      abstract: true,
      templateUrl: 'templates/menu/menuLoveme.html',
      controller: 'menuController',
      cache: false
    })
    .state('appTeen', {
      url: '/appTeen',
      abstract: true,
      templateUrl: 'templates/menu/menuMatchs.html',
      controller: 'menuController',
      cache: false
    })
    .state('wellcome', {
      cache: true,
      url: '/wellcome',
      templateUrl: 'templates/general/wellcome.html',
    })
    .state('init', {
      cache: false,
      url: '/init',
      templateUrl: 'templates/login/init.html',
      controller: 'initController'
    })
    .state('forgot', {
      cache: true,
      url: '/forgot',
      templateUrl: 'templates/login/forgot.html',
      controller: 'forgotController'
    })
    .state('register', {
      cache: false,
      url: '/register',
      templateUrl: 'templates/login/register.html',
      controller: 'registerController'
    })
    .state('signin', {
      cache: false,
      url: '/signin',
      templateUrl: 'templates/login/signin.html',
      controller: 'signInController'
    })
    .state('app.feed', {
      url: '/feed',
      cache: false,
      views: {
        'menuContent': {
          templateUrl: 'templates/general/feed.html',
          controller: 'feedController'
        }
      }
    })
    .state('app.myloves', {
      url: '/myloves',
      cache: false,
      views: {
        'menuContent': {
          templateUrl: 'templates/love/myloves.html',
          controller: 'mylovesController'
        }
      }
    })
    .state('app.search', {
      url: '/search',
      cache: false,
      views: {
        'menuContent': {
          templateUrl: 'templates/general/search.html',
          controller: 'searchController'
        }
      }
    })
    .state('app.resultsearch', {
      url: '/resultsearch',
      cache: false,
      views: {
        'menuContent': {
          templateUrl: 'templates/general/resultSearch.html',
          controller: 'resultsearchController'
        }
      }
    })
    .state('app.loveme', {
      url: '/loveme',
      cache: false,
      views: {
        'menuContent': {
          templateUrl: 'templates/love/loveme.html',
          controller: 'lovemeController'
        }
      }
    })
    .state('app.follows', {
      url: '/follows',
      cache: false,
      views: {
        'menuContent': {
          templateUrl: 'templates/follow/follow.html',
          controller: 'followsController'
        }
      }
    })
    .state('appTwo.profile', {
      url: '/profile',
      cache: false,
      views: {
        'menuContentProfile': {
          templateUrl: 'templates/profile/viewprofile.html',
          controller: 'profileController'
        }
      }
    })
    .state('appSeven.detailsMember', {
      cache: false,
      url: '/detailsMember/:id',
      views: {
        'menuMember': {
          templateUrl: 'templates/members/detailsmember.html',
          controller: 'detailsmemberController'
        }
      }
    })
    .state('appFive.contactus', {
      url: '/contactus',
      cache: false,
      views: {
        'menuContact': {
          templateUrl: 'templates/general/contactus.html',
          controller: 'contactusController'
        }
      }
    })
    // .state('app.lovemeDetails', {
    //   url: '/lovemedetails',
    //   cache: false,
    //   views: {
    //     'menuContent': {
    //       templateUrl: 'templates/love/lovemedetails.html',
    //       controller: 'lovemedetails'
    //     }
    //   }
    // })
    .state('appNine.lovemeDetails', {
      url: '/lovemedetails/:id/:skip',
      cache: false,
      views: {
        'menuContentLove': {
          templateUrl: 'templates/love/lovemedetails.html',
          controller: 'lovemedetails'
        }
      }
    })
    .state('appFive.rate', {
      url: '/rate/:user/:id',
      cache: false,
      views: {
        'menuContact': {
          templateUrl: 'templates/general/rate.html',
          controller: 'rateController'
        }
      }
    })
    .state('appFive.contactmember', {
      url: '/contactmember/:id',
      views: {
        'menuContact': {
          templateUrl: 'templates/members/contactmember.html',
          controller: 'contactmemberController'
        }
      }
    })
    .state('appFive.contactsuccess', {
      url: '/contactsuccess/:name/:imP/:imB',
      views: {
        'menuContact': {
          templateUrl: 'templates/members/contactsuccess.html',
          controller: 'contactsuccessController'
        }
      }
    })
    .state('appThree.myitem', {
      url: '/myitem',
      cache: true,
      views: {
        'menuContentClean': {
          templateUrl: 'templates/profile/myitem.html',
          controller: 'addItemController'
        }
      }
    })
    .state('appSix.terms', {
      url: '/terms',
      views: {
        'menuContentTerms' :{
          templateUrl: 'templates/general/terms.html',
          // controller: 'termsController'
        }
      }
    })
    .state('appThree.mysettings', {
      url: '/mysettings',
      cache: false,
      views: {
        'menuContentClean' :{
          templateUrl: 'templates/profile/mysettings.html',
          controller: 'mysettingsController'
        }
      }
    })
    .state('appSix.wellcomesettings', {
      cache: false,
      url: '/wellcomesettings',
      views: {
        'menuContentTerms' :{
          templateUrl: 'templates/general/wellcomeSettings.html',
          controller: 'wellcomesettingsController'
        }
      }
    })
    .state('appSix.settings', {
      cache: false,
      url: '/settings',
      views: {
        'menuContentTerms' :{
          templateUrl: 'templates/general/settings.html',
          controller: 'settingsController'
        }
      }
    })
    .state('appThree.faq', {
      url: '/faq',
      views: {
        'menuContentClean' :{
          templateUrl: 'templates/general/faq.html',
          // controller: 'faqController'
        }
      }
    })
    .state('app.youritem', {
      url: '/youritem/:id',
      cache:false,
      views: {
        'menuContent' :{
          templateUrl: 'templates/members/youritem.html',
          controller: 'youritemController'
        }
      }
    })
    .state('app.mymatches', {
      url: '/mymatches',
      cache:false,
      views: {
        'menuContent' :{
          templateUrl: 'templates/matchs/myMatchs.html',
          controller: 'mymatchesController'
        }
      }
    })
    .state('appThree.edititem', {
      url: '/edititem/:id',
      cache: false,
      views: {
        'menuContentClean': {
          templateUrl: 'templates/profile/edititem.html',
          controller: 'editItemController'
        }
      }
    })
    .state('appTeen.newmatch', {
      url: '/newmatch/:my/:your',
      cache:false,
      views: {
        'menuMatchs' :{
          templateUrl: 'templates/matchs/newMatch.html',
          controller: 'newmatchController'
        }
      }
    })
    .state('appTeen.matchOld', {
      url: '/matchOld/:id',
      cache:false,
      views: {
        'menuMatchs' :{
          templateUrl: 'templates/matchs/matchOld.html',
          controller: 'matchOldController'
        }
      }
    })
    .state('appFour.notifications', {
      url: '/notifications',
      cache: false,
      views: {
        'menuOnly' :{
          templateUrl: 'templates/general/notifications.html',
          controller: 'notificationsController'
        }
      }
    })
    .state('tuto1', {
      cache: false,
      url: '/tuto1',
      templateUrl: 'templates/tutorials/tuto1.html',
      controller: 'tutoController'
    })
    .state('tuto2', {
      cache: false,
      url: '/tuto2',
      templateUrl: 'templates/tutorials/tuto2.html',
      controller: 'tutoController'
    })
    .state('tuto3', {
      cache: false,
      url: '/tuto3',
      templateUrl: 'templates/tutorials/tuto3.html',
      controller: 'tutoController'
    })
    .state('tuto4', {
      cache: false,
      url: '/tuto4',
      templateUrl: 'templates/tutorials/tuto4.html',
      controller: 'tutoController'
    })
    $urlRouterProvider.otherwise('/validate');
  })
})()
