(function(){
  var app = angular.module('gailJudy.controllers',['ionic','jrCrop','ngSanitize','ui.router','ngCordova','ngDraggable','ngCordovaOauth']);

  app.controller('initController', function($scope, $state,$cordovaOauth,$http, functions) {
    // $state.go('app.feed');

    $scope.googleLogin = function() {

      $cordovaOauth.facebook('1554069558221624',["email", "public_profile"],{redirect_uri: "http://localhost/callback"}).then(function(result){
          var access_token = result.access_token;
          $http.get("https://graph.facebook.com/v2.2/me", {params: {access_token:access_token, fields: "name,email", format: "json" }}).then(function(rt) {
            var name = rt.data.name;
            var email = rt.data.email;
            var d = {
              username: name,
              firstname: name,
              email: email,
            }
            $http({
              method : "POST",
              data: d,
              url : WEBROOT+"loginFacebook/",
            }).then(function mySucces(r) {
              functions.saveLocalstorage(r.data['user'], r.data['follower'], r.data['following']);
              if(r.data['old'] == 1){
                $state.go('app.feed');
              }
              else{
                $state.go('wellcome');
              }
              }, function myError(resp) {
                // alert(">>>>")
                // alert(resp)
            });

           }, function(error) {
              //  alert("Error: " + error);
           });
      },  function(error){
              // alert("Error: " + error);
      });

    }

    $scope.performLogin = function () {
    	$ionicViewSwitcher.nextDirection('forward');
    	$state.go('app.feed');
  	};
	});

  app.controller('tutoController', function($scope, $state){
    $scope.Tuto = {};
    $scope.Tuto[1] = true;
    $scope.next = function(id){
      if(id != 5){
        $scope.Tuto[id] = true;
        $scope.Tuto[id - 1] = false;
      }
      else{
        if(window.localStorage.getItem("userFirstTime") == 1){
          $state.go('appSix.wellcomesettings');
        }
        else{
          $state.go('app.feed');
        }
      }
    }

    if(window.localStorage.getItem("userFirstTime") == 1){
      $scope.goFor = "#/appSix/wellcomesettings";
    }
    else{
      $scope.goFor = "#/app/feed";
    }
  })

  app.controller('validateController', function($scope, $state) {
    // $state.go('appSix.settings');
    // $state.go('app.lovemeDetails');


    if(window.localStorage.getItem("userID") != "" && window.localStorage.getItem("userID") != null){
      $state.go('app.feed');
    }
    else{
      $state.go('init');
    }
	});

  app.controller('rateController', function($scope, $state,$http){
    $http({
      method : "GET",
      url : WEBROOT+"getUser/"+$state.params.id,
    }).then(function mySucces(r) {
      nameUser = r.data['user']['firstname'] +" "+ r.data['user']['lastname'];

      if(r.data['user']['image'] != ""){
        $scope.imageMProfile = WEBROOT+"images/"+r.data['user']['image'];
        $scope.imageMBackground = WEBROOT+"images/"+r.data['user']['image'];
      }
      else{
        $scope.imageMBackground = "assets/sinfiltrocopy.png"
        $scope.imageMProfile = "assets/avatar2.png";
      }

      $scope.name = nameUser;
      $scope.follower = r.data['follower'];
      $scope.following = r.data['following'];
      },function myError(r) {

        });

    $scope.img = {};
    for (var i = 1; i < 6; i++) {
      $scope.img[i] = "assets/starEmpty.png";
    }
    $scope.rate = function(index){
      $scope.rateValue = index;
      for (var i = 1; i < 6; i++) {
        if(i <= index){
          $scope.img[i] = "assets/starFull.png";
        }
        else{
          $scope.img[i] = "assets/starEmpty.png";
        }
      }
    }
    $scope.sendRate = function(data){
      var d = {
        user:$state.params.user,
        rate: data
      };
      $http({
        method : "POST",
        data: d,
        url : WEBROOT+"rate/"+$state.params.id,
      }).then(function mySucces(r) {
          $state.go('app.feed');
        }, function myError(resp) {
      });
    }
  })

  app.controller('menuController', function($rootScope, $scope,$ionicPlatform, $ionicSideMenuDelegate,$ionicHistory, $state,$cordovaFileTransfer,$http,$timeout,$window){

    if(angular.isUndefined($rootScope.notificationsrUser) || $rootScope.notificationsrUser == ""){
        $rootScope.notificationsrUser = 0;
    }

    setInterval(function(){
      if(window.localStorage.getItem("userID") != "" && window.localStorage.getItem("userID") != null){
        $http({
          method : "GET",
          url : WEBROOT+"getUpdated/"+ window.localStorage.getItem("userID"),
        }).then(function mySucces(r) {
            $rootScope.notificationsrUser = r.data['notify'];
            $rootScope.followerUser = r.data['follow'];
          }, function myError(resp) {
        });
      }
    }, 60000);


    if(window.localStorage.getItem("userID") == "" || window.localStorage.getItem("userID") == null && $state.current.url != "/terms"){
      // $state.go('init');
    }


    // $scope.$watch(function() {return $rootScope.swipeRigth; }, function() {
      $scope.swipeRigth = true;
    // }, true);

    $scope.$watch(function() {return $rootScope.idMember; }, function() {
      $scope.idMember = $rootScope.idMember;
    }, true);

    $scope.$watch(function() {return $rootScope.followerUser; }, function() {
        $scope.followers = $rootScope.followerUser;
    }, true);

    $scope.$watch(function() {return $rootScope.followingUser; }, function() {
        $scope.following = $rootScope.followingUser;
    }, true);

    $scope.$watch(function() {return $rootScope.notificationsrUser; }, function() {
        $scope.countNotify = $rootScope.notificationsrUser;
    }, true);

    if( window.localStorage.getItem("userIMG") != "" && window.localStorage.getItem("userIMG") != null && window.localStorage.getItem("userIMG") != WEBROOT+'images/'){
      $scope.fullImg = true;
      $scope.emptyImg = false;
      $scope.imgaProfile = window.localStorage.getItem("userIMG");
      $scope.imgaBackground = window.localStorage.getItem("userIMG");
      $rootScope.imgUserProfile = window.localStorage.getItem("userIMG");
    }else{
      $scope.imgaBackground = "assets/sinfiltrocopy.png";
      $scope.emptyImg = true;
      $scope.fullImg = false;
    }

    $scope.$watch(function() {return $rootScope.imgUserProfile; }, function() {
        if($rootScope.imgUserProfile != "" && angular.isDefined($rootScope.imgUserProfile)){
          $scope.fullImg = true;
          $scope.emptyImg = false;
          $scope.imgaProfile = $rootScope.imgUserProfile;
          $scope.imgaBackground = $rootScope.imgUserProfile;
        }
    }, true);


    $scope.search = function(){
      if($state.current.url == "/search"){
        $window.location.reload();
      }
    }

    if($state.current.url == "/search"){
      $scope.titleLittle = "titleLittle";
    }


    if($state.current.url == "/rate/:id"){$scope.title = "RATE MEMBER"; }
    if($state.current.url == "/contactus"){$scope.title = "MESSAGE US"; }
    if($state.current.url == "/contactmember"){$scope.title = "MESSAGE MEMBER"; }
    if($state.current.url == "/contactsuccess"){$scope.title = ""; }

    $scope.myGoBack = function() {
      $ionicHistory.goBack();
      navigator.app.backHistory();
    };

    $scope.onSwipeLeft = function() {
      $ionicSideMenuDelegate.toggleLeft();
    }

    $scope.logout = function(){
      window.localStorage.setItem("userID", "");
      window.localStorage.setItem("userIMG", "");
      $rootScope.imgUserProfile = "";
      $rootScope.notificationsrUser = 0;
      $state.go('init');
    }
    $scope.name = window.localStorage.getItem("firstName") + " " + window.localStorage.getItem("lastName");

    if(window.localStorage.getItem("userFollowers") == "undefined"){
      $scope.follower = 0;
      $rootScope.followerUser = 0;
    }
    else{
      $scope.follower = window.localStorage.getItem("userFollowers");
      $rootScope.followerUser = window.localStorage.getItem("userFollowers");
    }

    if(window.localStorage.getItem("userFollowing") == "undefined" || window.localStorage.getItem("userFollowing") == "null" || window.localStorage.getItem("userFollowing") == ""){
      $rootScope.followingUser = 0;
      $scope.following = 0;
    }
    else{
      $rootScope.followingUser = 0;
      $scope.following = window.localStorage.getItem("userFollowing");
    }

  })

  app.controller('profileController', function($window, $ionicPlatform,$jrCrop,$rootScope,$sce, $scope, $state, $ionicHistory, $http, $cordovaFileTransfer, $cordovaImagePicker, $timeout,functions) {
    $ionicPlatform.ready(function() {
    $scope.modal = true;
    $scope.withoutScroll = '';
    $scope.imgaProfile = window.localStorage.getItem("userIMG");
    $scope.imgaBackground = window.localStorage.getItem("userIMG");

    if( window.localStorage.getItem("userIMG") != "" && window.localStorage.getItem("userIMG") != null ){
      $scope.fullImg = true;
      $scope.emptyImg = false;
    }else{
      $scope.emptyImg = true;
      $scope.fullImg = false;
      $scope.imgaBackground = "assets/sinfiltrocopy.png";
    }

    $scope.select = function(e){

    var opti = {
      maximumImagesCount: 1,
      width: 800,
      height: 800,
      quality: 80
     };
     $cordovaImagePicker.getPictures(opti)
       .then(function (results) {
         var url = WEBROOT+"uploadPicProfile/"+window.localStorage.getItem('userID');
         var options = {
              fileKey: "file",
              chunkedMode: false,
              mimeType: "image/png"
          };
          if(results[0]){
            $cordovaFileTransfer.upload(url, results[0], options).then(function (result) {
                var spl = result['response'];
                spl = spl.replace('"', '');
                spl = spl.replace('"', '');
                $rootScope.imgUserProfile = WEBROOT+'images/'+spl;
                $scope.imgaProfile = WEBROOT+'images/'+spl;
                $scope.imgaBackground = WEBROOT+'images/'+spl;
                window.localStorage.setItem("userIMG", WEBROOT+'images/'+spl);
                $scope.fullImg = true;
                $scope.emptyImg = false;
            }, function (err) {
               console.log("ERROR: " + JSON.stringify(err));
            }, function (progress) {
            });
          }
       }, function(error) {
       });
      }
   })


    $scope.myGoBack = function() {
      $ionicHistory.goBack();
    };
    if(window.localStorage.getItem("userFollowers") == "undefined"){
      $scope.follower = 0;
    }
    else{
      $scope.follower = window.localStorage.getItem("userFollowers");
    }

    if(window.localStorage.getItem("userFollowing") == "undefined"){
      $scope.following = 0;
    }
    else{
      $scope.following = window.localStorage.getItem("userFollowing");
    }

    $scope.name = window.localStorage.getItem("firstName") + " " + window.localStorage.getItem("lastName");
    var imgStars = "";
    var star = window.localStorage.getItem("userStar");
    $scope.fItem = [];
    $scope.ids = [];
    $scope.myItemsEmpty = [];
    $scope.goTo = [];
    for (var i = 0; i < 5; i++) {
      $scope.goTo[i] = "#/appThree/myitem";
      $scope.myItemsEmpty[i] = "myItemsEmpty";
      $scope.fItem[i] = '<div class="spacing redColor"> ADD ITEM </div>';
    }
    for (var i = 0; i < 5; i++) {
      if(i <= star){
        imgStars += '<img src="assets/starFull.png" />';
      }
      else{
        imgStars += '<img src="assets/starEmpty.png" />';
      }
    }
    $scope.stars = imgStars;
    $scope.emptys = false;

      $http({
        method : "GET",
        url : WEBROOT+"getMyItems/"+ window.localStorage.getItem("userID"),
      }).then(function mySucces(r) {
      // var r = {};
      // r.data = [{"_id":"5772caee6d66ec026fb2951e","title":"Prendaaaaa","description":"Great shoes for going to school","pricesite":450,"priceyour":360,"user":"5772aac66d66ec026fb294f6","brand":"ALDO","type":"clothes","size":"M","sizeID":4,"condition":"New with labels","material":"Synthetic  ","color":"Black","img1":"8sENkRTqsCBGPgUl9ef2h2en.jpg","img2":"fgbDNKF1CmkOjJZCFSA247ZU.jpg","img3":"IjFoWbhk69gTTrZMooPfWI5v.jpg","__v":0,"active":1,"skip":1,"loveActive":0,"likes":2}]
      // r.data = [{"_id":"5772caee6d66ec026fb2951e","title":"Prendaaaaa","description":"Great shoes for going to school","pricesite":450,"priceyour":360,"user":"5772aac66d66ec026fb294f6","brand":"ALDO","type":"clothes","size":"M","sizeID":4,"condition":"New with labels","material":"Synthetic  ","color":"Black","img1":"8sENkRTqsCBGPgUl9ef2h2en.jpg","img2":"fgbDNKF1CmkOjJZCFSA247ZU.jpg","img3":"IjFoWbhk69gTTrZMooPfWI5v.jpg","__v":0,"active":1,"skip":1,"loveActive":0,"likes":2},{"_id":"5772cf196d66ec026fb2952a","title":"Swweeeter","description":"BBshshshshdhd","pricesite":250,"priceyour":null,"user":"5772aac66d66ec026fb294f6","brand":"AGENT PROVOC","type":"clothes","size":"M","sizeID":4,"condition":"Fair condition","material":"Leather","color":"Ecru","img1":"PqlMa1GsMeYyP6pcpGqdvU7O.jpg","img2":"z8ZiXudhlRo417AbgBn2uQnG.jpg","img3":"F743glD9RY9qW5kuL-lwHHN0.jpg","__v":0,"active":1,"skip":1,"loveActive":1,"likes":1},{"_id":"577e8e1b4fd39bc670d1a538","title":"Relojes","description":"Oferta de 2 relojes por 1","pricesite":350,"priceyour":null,"user":"5772aac66d66ec026fb294f6","brand":"MARKS & SPENCER","type":"accessories","size":"0","sizeID":0,"condition":"New with labels","material":"OTHER","color":"Blue","img1":"X2SCaJ65OKfPZ_8QHBBmsAiK.jpg","img2":"XxelB9ut4MAyecjLMXpt7uE_.jpg","img3":"","__v":0,"active":1,"skip":3,"loveActive":0,"likes":3},{"_id":"5772c5e56d66ec026fb2950f","title":"Prenda aaaaaaaaa","description":"Tjis is a looooooooooooooooooooooooooooooooooooongggggggg descriptioooooon ahahahahshshshshdhfjfkfkfjfjshshshdhdhhdhdjdjdhdhfhd hsjsjshdhdhdhdhhhdjd hdhdhdhdhdhd","pricesite":150,"priceyour":120,"user":"5772aac66d66ec026fb294f6","brand":"APC","type":"clothes","size":"M","sizeID":4,"condition":"Great condition","material":"Cotton  ","color":"OTHER","img1":"T6xotuHdSur9ZlVYp2kp8HTu.jpg","img2":"wNqM2DiwgUwavama0kPaGNyL.jpg","img3":"","__v":0,"active":1,"skip":1,"loveActive":0,"likes":2},{"_id":"577e8e874fd39bc670d1a539","title":"Ties","description":"2 ties for you. The items are like new for using in any party or even for job","pricesite":115,"priceyour":null,"user":"5772aac66d66ec026fb294f6","brand":"MANGO","type":"accessories","size":"0","sizeID":0,"condition":"Great condition","material":"Cotton  ","color":"Purple","img1":"enbzPUIr0PzpnI-eFOTJMTFo.jpg","img2":"5qHHZtElkEDn09BbJJnBWXjr.jpg","img3":"","__v":0,"active":1,"skip":0,"loveActive":1,"likes":3},{"_id":"577e8ef64fd39bc670d1a53c","title":"Summer t-shirts","description":"Loremipsum hajajabdbf \nBsbdbd\nS\nS\nS\nJsjsjjs","pricesite":55,"priceyour":null,"user":"5772aac66d66ec026fb294f6","brand":"ADIDAS","type":"clothes","size":"M","sizeID":4,"condition":"Good condition","material":"Polyester","color":"Green","img1":"xT2qHrY4ZXXWfTKsnRlrbR6X.jpg","img2":"Ubq-F06Chl_5OkxE1gYdOyhc.jpg","img3":"JyOKRJ9yD98gVXxsJovhbrdo.jpg","__v":0,"active":1,"skip":1,"loveActive":0,"likes":3},{"_id":"577e8f324fd39bc670d1a53e","title":"Black polo","description":"Hi","pricesite":45,"priceyour":null,"user":"5772aac66d66ec026fb294f6","brand":"RALPH LAUREN","type":"clothes","size":"M","sizeID":4,"condition":"Great condition","material":"Cotton  ","color":"Black","img1":"EdOaoG_qp9LKxLDmlj_ZorXl.jpg","img2":"j5CeD3RQ1GjuOPkcVtSdH150.jpg","img3":"","__v":0,"active":1,"skip":0,"loveActive":1,"likes":2},{"_id":"577e8f7f4fd39bc670d1a53f","title":"Shoes for you","description":"This shoes are perfect for ya","pricesite":220,"priceyour":null,"user":"5772aac66d66ec026fb294f6","brand":"ADIDAS","type":"shoes","size":"11","sizeID":32,"condition":"Fair condition","material":"Viscose  ","color":"Black","img1":"YHpDK-sKUJmCdAyw3gDEZomI.jpg","img2":"lpMiHyhFizBCcS1MBlhMGO2H.jpg","img3":"","__v":0,"active":1,"skip":1,"loveActive":1,"likes":3},{"_id":"577e8fec4fd39bc670d1a540","title":"Blue shirt","description":"Jajajaja","pricesite":100,"priceyour":null,"user":"5772aac66d66ec026fb294f6","brand":"ADIDAS","type":"shoes","size":"10","sizeID":30,"condition":"Great condition","material":"Suede  ","color":"Black","img1":"NoUk_tvFXzGVNxUUjhBY1YG8.jpg","img2":"Jg7X0g7Vx84HEUINw_Mtdl8w.jpg","img3":"","__v":0,"active":1,"skip":5,"loveActive":0,"likes":3}]
          if(r.data.length < 5){
            $scope.emptys = true;
            for (var i = 0; i < 5; i++) {
              if(i < r.data.length && r.data.length != 0){
                var od = r.data[i]['_id'];
                var content = '<div style="position:relative;" > <a class="pincel" menu-close href="#/appThree/edititem/'+r.data[i]['_id']+'"></a></div><a href="#/app/youritem/'+r.data[i]['_id']+'" menu-close class="redColor" style="text-decoration:none !important;">  <div class="itemIMG" style="background-image:url('+WEBROOT+'images/'+r.data[i]['img1']+');"></div> <hr style="width:10px; position:absolute; left:12px; border: 0; border-top: 1px solid #BC0000;"/> <div class="itemDetails redColor"><div class="pbrand">'+r.data[i].brand+'</div><div class="pname">'+r.data[i].title+'</div><p class="psize">Size: '+r.data[i].size+'</p><p class="pprice">$'+r.data[i].pricesite+'</p></div><div class="itemLiked redColor" style="background-image:url(assets/heartempty.png);">'+r.data[i]['likes']+'</a></div>';
                var content2 = $sce.trustAsHtml(content);
                $scope.fItem[i] = content2;
                $scope.myItemsEmpty[i] = "myItem";
                $scope.goTo[i] = "";
                $scope.ids[i] = r.data[i]['_id'];
              }
            }
          }else{
            for (var i = 0; i < r.data.length; i++) {
              r.data[i]['img1'] = WEBROOT+'images/'+r.data[i]['img1'];
            }
            $scope.emptys = false;
            $scope.myItems = r.data;
          }
        }, function myError(resp) {

      });
      $scope.sure = true;
      var byDelete = "";
      $scope.deleteThisItem = function(id){
        $scope.sure = false;
        // $scope.withoutScroll = 'withoutScroll';
        byDelete = id;
      };

      $scope.closeModal = function(){
        byDelete = "";
        $scope.sure = true;
        // $scope.withoutScroll = '';
      }

      $scope.callDeleted = function(){
        $http({
          method : "GET",
          url : WEBROOT+"deleteMyItem/"+ byDelete,
        }).then(function mySucces(r) {
          // $scope.sure = true;
          // $scope.withoutScroll = '';
          // byDelete = "";
          $window.location.reload();
        })
      }
      $scope.goToo = function(go){
          if(go != ""){
            $state.go('appThree.myitem');
          }
      }

  });



  app.controller('registerController', function($scope,$state, $ionicHistory,$http, functions) {
    $scope.myGoBack = function() {
      $ionicHistory.goBack();
    };

    $scope.new = function(data){
      var User = {
        firstname: data.firstName,
        email: data.email,
        username: data.username,
        password: data.password
      }
      $http({
        method : "POST",
        data: User,
        url : WEBROOT+"register",
      }).then(function mySucces(r) {
        if(angular.isDefined(r.data['user'])){
          functions.saveLocalstorage(r.data['user'], r.data['follower'], r.data['following']);
          $state.go('wellcome');
        }
        else{
        }
        }, function myError(resp) {

      });
    }
	});

  app.controller('signInController', function($scope, $state, $ionicHistory,$http,functions) {
    $scope.modal = true;
    $scope.closeModal = function(){
      $scope.modal = true;
      $scope.withoutScroll = '';
    }
    $scope.myGoBack = function() {
      $ionicHistory.goBack();
    };

    $scope.login = function(data){
      var User = {
        email: data.email,
        password: data.password
      }
      $http({
        method : "POST",
        data: User,
        url : WEBROOT+"login",
      }).then(function mySucces(r) {
          if(angular.isDefined(r.data['user'])){
            functions.saveLocalstorage(r.data['user'], r.data['follower'], r.data['following']);
            $state.go('app.feed');
          }
          else{
            $scope.modal = false;
          }
        },function myError(resp) {
          $scope.modal = false;
        });
    }
  });

  app.controller('addItemController', function($anchorScroll, $window, $location,$rootScope, $scope, $ionicHistory, $state, $filter,$http,$timeout,$cordovaFileTransfer, $cordovaImagePicker){
    // $scope.Item = {}
    $scope.withoutScroll = '';
    $scope.modal = true;
    var pict1 = "";
    var pict2 = "";
    var pict3 = "";

    $scope.img1 = "assets/plus.png";
    $scope.IsizE1 = "30%";
    $scope.tx1 = true;

    $scope.img2 = "assets/plus.png";
    $scope.IsizE2 = "30%";
    $scope.tx2 = true;

    $scope.img3 = "assets/plus.png";
    $scope.IsizE3 = "30%";
    $scope.tx3 = true;

    $scope.removeIma = function(number){
      if(number == 1){
        window.localStorage.setItem("img1", "")
        pict1 = "";
        $scope.img1 = "assets/plus.png";
        $scope.tx1 = true;
        $scope.dl1 = false;
        $scope.IsizE1 = "30%";
      }
      if(number == 2){
        window.localStorage.setItem("img2", "")
        pict2 = "";
        $scope.img2 = "assets/plus.png";
        $scope.tx2 = true;
        $scope.dl2 = false;
        $scope.IsizE2 = "30%";
      }
      if(number == 3){
        window.localStorage.setItem("img3", "")
        pict3 = "";
        $scope.img3 = "assets/plus.png";
        $scope.tx3 = true;
        $scope.dl3 = false;
        $scope.IsizE3 = "30%";
      }
    }

    if(window.localStorage.getItem("img1") != "" && window.localStorage.getItem("img1") != null){
      pict1 = window.localStorage.getItem("img1");
      $scope.img1 = window.localStorage.getItem("img1");
      $scope.tx1 = false;
      $scope.IsizE1 = "cover";
      $scope.dl1 = true;
    }

    if(window.localStorage.getItem("img2") != "" && window.localStorage.getItem("img2") != null){
      pict2 = window.localStorage.getItem("img2");
      $scope.img2 = window.localStorage.getItem("img2");
      $scope.tx2 = false;
      $scope.IsizE2 = "cover";
      $scope.dl2 = true;
    }

    if(window.localStorage.getItem("img3") != "" && window.localStorage.getItem("img3") != null){
      pict3 = window.localStorage.getItem("img3");
      $scope.img3 = window.localStorage.getItem("img3");
      $scope.tx3 = false;
      $scope.IsizE3 = "cover";
      $scope.dl3 = true;
    }

    $scope.addIma = function(number){
      var opti = {
        maximumImagesCount: 1,
        width: 800,
        height: 800,
        quality: 80
       };
       $cordovaImagePicker.getPictures(opti)
         .then(function (results) {
           var url = WEBROOT+"uploadPicImg/";
           var options = {
                fileKey: "file",
                chunkedMode: false,
                mimeType: "image/png"
            };
            if(results[0]){
              $cordovaFileTransfer.upload(url, results[0], options).then(function (result) {
                 var spl = result['response'].split("/");
                 spl[2]= spl[2].replace('"', '');
                 spl[2]= spl[2].replace('"', '');
                 if(number != 1 && (number == 2 || number == 3) && pict1 == ""){
                   number = 1;
                 }
                 else if ( number != 2 && number == 3 && pict2 == "") {
                   number = 2;
                 }
                 if(number == 1){
                   window.localStorage.setItem("img1", WEBROOT+'images/'+spl[2]);
                   pict1 = spl[2];
                   $scope.img1 = WEBROOT+'images/'+spl[2];
                   $scope.tx1 = false;
                   $scope.IsizE1 = "cover";
                   $scope.dl1 = true;

                 }

                 if(number == 2){
                   window.localStorage.setItem("img2", WEBROOT+'images/'+spl[2]);
                   pict2 = spl[2];
                   $scope.img2 = WEBROOT+'images/'+spl[2];
                   $scope.tx2 = false;
                   $scope.IsizE2 = "cover";
                   $scope.dl2 = true;
                 }

                 if(number == 3){
                   window.localStorage.setItem("img3", WEBROOT+'images/'+spl[2]);
                   pict3 = spl[2];
                   $scope.img3 = WEBROOT+'images/'+spl[2];
                   $scope.tx3 = false;
                   $scope.IsizE3 = "cover";
                   $scope.dl3 = true;
                 }


              }, function (err) {
                 console.log("ERROR: " + JSON.stringify(err));
              }, function (progress) {
                  // PROGRESS HANDLING GOES HERE
              });


            }


         }, function(error) {
           // error getting photos
         });
    }


    var sizes = ["",'XXS','XS','S','M','L','XL','XLL','0','2','4','6','8','10','12','14','16','18','20','4.5','5','5.5','6','6.5','7','7.5','8','8.5','9','9.5','10','10.5','11','11.5','12'];
    var opt = ['clothes','shoes', 'accessories', 'bags', 'jewelry'];
    $scope.Item = [];
    $scope.caractOption = {};
    $scope.Ons = {};
    $scope.optActive = {};
    $scope.onlyJewelry = false;
    $scope.notJewelry = false;
    // $scope.Item['priceYour'] = $scope.Item['priceSite'];


        $scope.saveTitle = function(name){
          window.localStorage.setItem("titleItem", name);
        }

        $scope.saveDescription = function(name){
          // alert(name);
          window.localStorage.setItem("descriptionItem", name);
        }

        $scope.saveBrand = function(name){
          window.localStorage.setItem("brandItem", name);
        }

        $scope.saveCondition = function(name){
          window.localStorage.setItem("conditionItem", name);
        }

        $scope.saveColor = function(name){
          window.localStorage.setItem("colorItem", name);
        }

        $scope.saveMaterial = function(name){
          window.localStorage.setItem("materialItem", name);
        }

        $scope.Item['title'] = window.localStorage.getItem('titleItem');
        $scope.Item['description'] = window.localStorage.getItem('descriptionItem');
        $scope.Item['brand'] = window.localStorage.getItem('brandItem');
        $scope.Item['condition'] = window.localStorage.getItem('conditionItem');
        $scope.Item['color'] = window.localStorage.getItem('colorItem');
        $scope.Item['material'] = window.localStorage.getItem('materialItem');

    for (var i = 0; i < opt.length; i++) {
      $scope.Ons[opt[i]] = false;
      $scope.optActive[opt[i]] = 'redColor';
    }

    for (var i = 0; i <= 34; i++) {
      $scope.caractOption[i] = "caractOption";
    }

    $scope.crt = function functionName(id) {
      $scope.Item['sizeID'] = id;
      $scope.Item['size'] = sizes[id];

      angular.forEach($scope.caractOption, function(v, k) {
        if(k == id){
          $scope.caractOption[k] = "caractOptionActive";
        }
        else{
          $scope.caractOption[k] = "caractOption";
        }
      });
    }

    $scope.clothesOpts = function(section){
      $scope.Item['type'] = section;
      if (section != 'clothes' && section != 'shoes'){
        $scope.Item['size'] = 0;
        $scope.Item['sizeID'] = 0;
      }
      if(section == 'jewelry'){
        $scope.notJewelry = false;
        $scope.onlyJewelry = true;
      }
      else{
        $scope.onlyJewelry = false;
        $scope.notJewelry = true;
      }

      for (var i = 0; i <= 30; i++) {
        $scope.caractOption[i] = "caractOption";
      }

      angular.forEach($scope.Ons, function(v, k) {
        if(k == section){
          $scope.Ons[k] = true;
          $scope.optActive[k] = "buttonShowActive";
        }
        else{
          $timeout(function() {
            $scope.Ons[k] = false;
            $scope.optActive[k] = "redColor";
          }, 100);

        }
      });
    }

    $http({
      method : "GET",
      url : WEBROOT+"getBrands",
    }).then(function mySucces(r) {
        $scope.brands = r.data;
      },function myError(resp) {

        });

    $scope.closeModal = function(){
      $scope.modal = true;
      $scope.withoutScroll = '';
    }

    $scope.add = function(data){
      var t = 0;
      var result = document.getElementById("priceYour");
      var wrappedResult = angular.element(result);

      var priceY=  wrappedResult.val();
      priceY = priceY.replace('$', '');

      var Item = {
        title: data.title,
        description: data.description,
        pricesite: data.priceSite,
        priceyour: priceY,
        user: window.localStorage.getItem("userID"),
        brand: data.brand,
        type: data.type,
        size: data.size,
        sizeID: data.sizeID,
        condition: data.condition,
        material: data.material,
        color: data.color,
        img1: pict1,
        img2: pict2,
        img3: pict3
      }
      angular.forEach(Item, function(v, k) {
        if( (v == "" || angular.isUndefined(v) ) && k != "img2" && k != "img3" && k != "size" && k != "sizeID" && k != "priceyour"){
          $scope.modal = false;
          $scope.withoutScroll = 'withoutScroll';
          t =1;
          return false;
        }
      });
      if(t != 1){
        $http({
          method : "POST",
          data: Item,
          url : WEBROOT+"addItem",
        }).then(function mySucces(r) {
            window.localStorage.setItem("img1", "");
            window.localStorage.setItem("img2", "");
            window.localStorage.setItem("img3", "");
            window.localStorage.setItem("titleItem", "");
            window.localStorage.setItem("descriptionItem", "");
            window.localStorage.setItem("brandItem", "");
            window.localStorage.setItem("conditionItem", "");
            window.localStorage.setItem("colorItem", "");
            window.localStorage.setItem("materialItem", "");
            $timeout(function() {
              $state.go('appTwo.profile');
            }, 500);
          },function myError(resp) {

            });
      }
    }
  });

  app.controller('mysettingsController',function($scope, $state, $ionicHistory,$http,functions){
    $scope.myGoBack = function() {
      $ionicHistory.goBack();
    };
    var myCount = 0;
    var brandUser = [];
    $scope.caractOption1 = {};
    $scope.caractOption2 = {};
    $scope.caractOption3 = {};
    $scope.Settings = {};
    $scope.brandActive = [];
    var sizes = ["",'XXS','XS','S','M','L','XL','XLL','0','2','4','6','8','10','12','4.5','5','5.5','6','6.5','7','7.5','8','8.5','9','9.5','10','10.5','11','11.5','12'];
    $http({
      method : "GET",
      url : WEBROOT+"getBrands",
     }).then(function mySucces(rB) {
        $scope.brands = rB.data;

        $http({
          method : "GET",
          url : WEBROOT+"getUser/"+window.localStorage.getItem("userID"),
        }).then(function mySucces(r) {
          $scope.Settings = r.data['user'];
          $scope.caractOption1[r.data['user'].sizeOneID] = "caractOptionActive";
          $scope.caractOption2[r.data['user'].sizeTwoID] = "caractOptionActive";
          $scope.caractOption3[r.data['user'].sizeThreeID] = "caractOptionActive";

          $scope.caractOption1[r.data['user'].sizeOneID2] = "caractOptionActive";
          $scope.caractOption2[r.data['user'].sizeTwoID2] = "caractOptionActive";
          $scope.caractOption3[r.data['user'].sizeThreeID2] = "caractOptionActive";

          $scope.caractOption1[r.data['user'].sizeOneID3] = "caractOptionActive";
          $scope.caractOption2[r.data['user'].sizeTwoID3] = "caractOptionActive";
          $scope.caractOption3[r.data['user'].sizeThreeID3] = "caractOptionActive";

          angular.forEach($scope.brands, function(v, k) {
            if(r.data['user'].brand1 === v['name'] || r.data['user'].brand2 == v['name'] || r.data['user'].brand3 == v['name'] || r.data['user'].brand4 == v['name'] || r.data['user'].brand5 == v['name'] || r.data['user'].brand6 == v['name'] || r.data['user'].brand7 == v['name'] || r.data['user'].brand8 == v['name'] || r.data['user'].brand9 == v['name'] || r.data['user'].brand10 == v['name']){
              brandUser.push(v['name']);
              $scope.brandActive[k] = 'brandActive';
            }
          });
          },function myError(r) {

            });
      },function myError(resp) {

        });

    $scope.brandSelected = function(id, name){
      if($scope.brandActive[id] == 'brandActive'){
        for (var i = 0; i < brandUser.length; i++) {
          if(name == brandUser[i]){
            brandUser.splice(i, 1);
          }
        }
        $scope.brandActive[id] = '';
      }
      else{
        if(brandUser.length > 9){
        }
        else{
          brandUser.push(name);
          $scope.brandActive[id] = 'brandActive';
        }
      }
    }

    for (var i = 0; i <= 34; i++) {
      $scope.caractOption1[i] = "caractOption";
      $scope.caractOption3[i] = "caractOption";
      $scope.caractOption2[i] = "caractOption";
    }

    $scope.crt1 = function functionName(id) {
      if($scope.caractOption1[id] == "caractOptionActive"){
        if($scope.Settings['sizeOneID'] == id){
          $scope.Settings['sizeOneID'] = "";
          $scope.Settings['sizeOne'] = "";
          $scope.caractOption1[id] = "caractOption";
        }
        else if($scope.Settings['sizeOneID2'] == id){
          $scope.Settings['sizeOneID2'] = "";
          $scope.Settings['sizeOne2'] = "";
          $scope.caractOption1[id] = "caractOption";
        }
        else if($scope.Settings['sizeOneID3'] == id){
          $scope.Settings['sizeOneID3'] = "";
          $scope.Settings['sizeOne3'] = "";
          $scope.caractOption1[id] = "caractOption";
        }
      }
      else{
        if(angular.isUndefined($scope.Settings['sizeOneID']) || $scope.Settings['sizeOneID'] == ""){
          $scope.Settings['sizeOneID'] = id;
          $scope.Settings['sizeOne'] = sizes[id];
          $scope.caractOption1[id] = "caractOptionActive";
        }
        else if(angular.isUndefined($scope.Settings['sizeOneID2']) || $scope.Settings['sizeOneID2'] == ""){
          $scope.Settings['sizeOneID2'] = id;
          $scope.Settings['sizeOne2'] = sizes[id];
          $scope.caractOption1[id] = "caractOptionActive";
        }
        else if(angular.isUndefined($scope.Settings['sizeOneID3']) || $scope.Settings['sizeOneID3'] == ""){
          $scope.Settings['sizeOneID3'] = id;
          $scope.Settings['sizeOne3'] = sizes[id];
          $scope.caractOption1[id] = "caractOptionActive";
        }
      }

    }

    $scope.crt2 = function functionName(id) {
      if($scope.caractOption2[id] == "caractOptionActive"){
        if($scope.Settings['sizeTwoID'] == id){
          $scope.Settings['sizeTwoID'] = "";
          $scope.Settings['sizeTwo'] = "";
          $scope.caractOption2[id] = "caractOption";
        }
        else if($scope.Settings['sizeTwoID2'] == id){
          $scope.Settings['sizeTwoID2'] = "";
          $scope.Settings['sizeTwo2'] = "";
          $scope.caractOption2[id] = "caractOption";
        }
        else if($scope.Settings['sizeTwoID3'] == id){
          $scope.Settings['sizeTwoID3'] = "";
          $scope.Settings['sizeTwo3'] = "";
          $scope.caractOption2[id] = "caractOption";
        }
      }
      else{
        if(angular.isUndefined($scope.Settings['sizeTwoID']) || $scope.Settings['sizeTwoID'] == ""){
          $scope.Settings['sizeTwoID'] = id;
          $scope.Settings['sizeTwo'] = sizes[id];
          $scope.caractOption2[id] = "caractOptionActive";
        }
        else if(angular.isUndefined($scope.Settings['sizeTwoID2']) || $scope.Settings['sizeTwoID2'] == ""){
          $scope.Settings['sizeTwoID2'] = id;
          $scope.Settings['sizeTwo2'] = sizes[id];
          $scope.caractOption2[id] = "caractOptionActive";
        }
        else if(angular.isUndefined($scope.Settings['sizeTwoID3']) || $scope.Settings['sizeTwoID3'] == ""){
          $scope.Settings['sizeTwoID3'] = id;
          $scope.Settings['sizeTwo3'] = sizes[id];
          $scope.caractOption2[id] = "caractOptionActive";
        }
      }
      // $scope.Settings['sizeTwoID'] = id;
      // $scope.Settings['sizeTwo'] = sizes[id];
      //
      // angular.forEach($scope.caractOption2, function(v, k) {
      //   if(k == id){
      //     $scope.caractOption2[k] = "caractOptionActive";
      //   }
      //   else{
      //     $scope.caractOption2[k] = "caractOption";
      //   }
      // });
    }

    $scope.crt3 = function functionName(id) {
      if($scope.caractOption3[id] == "caractOptionActive"){
        if($scope.Settings['sizeThreeID'] == id){
          $scope.Settings['sizeThreeID'] = "";
          $scope.Settings['sizeThree'] = "";
          $scope.caractOption3[id] = "caractOption";
        }
        else if($scope.Settings['sizeThreeID2'] == id){
          $scope.Settings['sizeThreeID2'] = "";
          $scope.Settings['sizeThree2'] = "";
          $scope.caractOption3[id] = "caractOption";
        }
        else if($scope.Settings['sizeThreeID3'] == id){
          $scope.Settings['sizeThreeID3'] = "";
          $scope.Settings['sizeThree3'] = "";
          $scope.caractOption3[id] = "caractOption";
        }
      }
      else{
        if(angular.isUndefined($scope.Settings['sizeThreeID']) || $scope.Settings['sizeThreeID'] == ""){
          $scope.Settings['sizeThreeID'] = id;
          $scope.Settings['sizeThree'] = sizes[id];
          $scope.caractOption3[id] = "caractOptionActive";
        }
        else if(angular.isUndefined($scope.Settings['sizeThreeID2']) || $scope.Settings['sizeThreeID2'] == ""){
          $scope.Settings['sizeThreeID2'] = id;
          $scope.Settings['sizeThree2'] = sizes[id];
          $scope.caractOption3[id] = "caractOptionActive";
        }
        else if(angular.isUndefined($scope.Settings['sizeThreeID3']) || $scope.Settings['sizeThreeID3'] == ""){
          $scope.Settings['sizeThreeID3'] = id;
          $scope.Settings['sizeThree3'] = sizes[id];
          $scope.caractOption3[id] = "caractOptionActive";
        }
      }

    }

    $scope.saveSettings = function(data){
      myCount = 0;
      angular.forEach(brandUser, function(v, k) {
        brandUser[myCount] = v;
        myCount += 1;
      });
      var dataSettings = {
        firstname: data.firstname,
        lastname: data.lastname,
        firstAddress: data.firstAddress,
        secondAddress: data.secondAddress,
        city: data.city,
        zip: data.zip,

        sizeOneID: data.sizeOneID,
        sizeTwoID: data.sizeTwoID,
        sizeThreeID: data.sizeThreeID,
        sizeOne: data.sizeOne,
        sizeTwo: data.sizeTwo,
        sizeThree: data.sizeThree,

        sizeOneID2: data.sizeOneID2,
        sizeTwoID2: data.sizeTwoID2,
        sizeThreeID2: data.sizeThreeID2,
        sizeOne2: data.sizeOne2,
        sizeTwo2: data.sizeTwo2,
        sizeThree2: data.sizeThree2,

        sizeOneID3: data.sizeOneID3,
        sizeTwoID3: data.sizeTwoID3,
        sizeThreeID3: data.sizeThreeID3,
        sizeOne3: data.sizeOne3,
        sizeTwo3: data.sizeTwo3,
        sizeThree3: data.sizeThree3,

        brand1: brandUser[0],
        brand2: brandUser[1],
        brand3: brandUser[2],
        brand4: brandUser[3],
        brand5: brandUser[4],
        brand6: brandUser[5],
        brand7: brandUser[6],
        brand8: brandUser[7],
        brand9: brandUser[8],
        brand10: brandUser[9]
      }
      $http({
        method : "PUT",
        data: dataSettings,
        url : WEBROOT+"updateSettings/"+window.localStorage.getItem("userID"),
      }).then(function mySucces(r) {
        functions.saveLocalstorage(r.data);
        $state.go('app.feed');
        },function myError(resp) {

          });
    }

  })

  app.controller('wellcomesettingsController', function($scope, $state, $ionicHistory, $http){
    $scope.myGoBack = function() {
      $ionicHistory.goBack();
    };

    $scope.disabled = "disabled";

    $scope.name = window.localStorage.getItem("firstName");

    $http({
      method : "GET",
      url : WEBROOT+"getBrandsWellcome",
    }).then(function mySucces(rB) {
        $scope.brands = rB.data;
      },function myError(resp) {
        });

        var brandUser = [];

        $scope.brandActive = [];

        $scope.brandSelected = function(id, name){
          if($scope.brandActive[id] == 'brandActive'){
            $scope.disabled = "disabled";
            for (var i = 0; i < brandUser.length; i++) {
              if(name == brandUser[i]){
                brandUser.splice(i, 1);
              }
            }
            $scope.brandActive[id] = '';
          }
          else{
            if(brandUser.length > 9){
            }
            else{
              if( brandUser.length == 9){
                $scope.disabled = "";
              }
              brandUser.push(name);
              $scope.brandActive[id] = 'brandActive';
            }
          }
        }
        $scope.saveInitBrands = function(data){
          myCount = 0;
          angular.forEach(brandUser, function(v, k) {
            brandUser[myCount] = v;
            myCount += 1;
          });
          var dataBrands= {
            brand1: brandUser[0],
            brand2: brandUser[1],
            brand3: brandUser[2],
            brand4: brandUser[3],
            brand5: brandUser[4],
            brand6: brandUser[5],
            brand7: brandUser[6],
            brand8: brandUser[7],
            brand9: brandUser[8],
            brand10: brandUser[9]
          }
          $http({
            method : "PUT",
            data: dataBrands,
            url : WEBROOT+"saveBrands/"+window.localStorage.getItem("userID"),
          }).then(function mySucces(r) {
            $state.go('appSix.settings');
            },function myError(resp) {

              });
        }
  })

  app.controller('settingsController', function($scope, $state, $ionicHistory,$http, functions){
    $scope.myGoBack = function() {
      $ionicHistory.goBack();
    };

    $scope.initSettings = {};
    $scope.initSettings['firstname'] = window.localStorage.getItem("firstName");

    $scope.caractOption1 = {};
    $scope.caractOption2 = {};
    $scope.caractOption3 = {};
    var sizes = ["",'XXS','XS','S','M','L','XL','XLL','0','2','4','6','8','10','12','4.5','5','5.5','6','6.5','7','7.5','8','8.5','9','9.5','10','10.5','11','11.5','12'];

    for (var i = 0; i <= 34; i++) {
      $scope.caractOption1[i] = "caractOption";
      $scope.caractOption3[i] = "caractOption";
      $scope.caractOption2[i] = "caractOption";
    }


    $scope.crt1 = function functionName(id) {
      if($scope.caractOption1[id] == "caractOptionActive"){
        if($scope.initSettings['sizeOneID'] == id){
          $scope.initSettings['sizeOneID'] = "";
          $scope.initSettings['sizeOne'] = "";
          $scope.caractOption1[id] = "caractOption";
        }
        else if($scope.initSettings['sizeOneID2'] == id){
          $scope.initSettings['sizeOneID2'] = "";
          $scope.initSettings['sizeOne2'] = "";
          $scope.caractOption1[id] = "caractOption";
        }
        else if($scope.initSettings['sizeOneID3'] == id){
          $scope.initSettings['sizeOneID3'] = "";
          $scope.initSettings['sizeOne3'] = "";
          $scope.caractOption1[id] = "caractOption";
        }
      }
      else{
        if(angular.isUndefined($scope.initSettings['sizeOneID']) || $scope.initSettings['sizeOneID'] == ""){
          $scope.initSettings['sizeOneID'] = id;
          $scope.initSettings['sizeOne'] = sizes[id];
          $scope.caractOption1[id] = "caractOptionActive";
        }
        else if(angular.isUndefined($scope.initSettings['sizeOneID2']) || $scope.initSettings['sizeOneID2'] == ""){
          $scope.initSettings['sizeOneID2'] = id;
          $scope.initSettings['sizeOne2'] = sizes[id];
          $scope.caractOption1[id] = "caractOptionActive";
        }
        else if(angular.isUndefined($scope.initSettings['sizeOneID3']) || $scope.initSettings['sizeOneID3'] == ""){
          $scope.initSettings['sizeOneID3'] = id;
          $scope.initSettings['sizeOne3'] = sizes[id];
          $scope.caractOption1[id] = "caractOptionActive";
        }
      }

    }

    $scope.crt2 = function functionName(id) {
      if($scope.caractOption2[id] == "caractOptionActive"){
        if($scope.initSettings['sizeTwoID'] == id){
          $scope.initSettings['sizeTwoID'] = "";
          $scope.initSettings['sizeTwo'] = "";
          $scope.caractOption2[id] = "caractOption";
        }
        else if($scope.initSettings['sizeTwoID2'] == id){
          $scope.initSettings['sizeTwoID2'] = "";
          $scope.initSettings['sizeTwo2'] = "";
          $scope.caractOption2[id] = "caractOption";
        }
        else if($scope.initSettings['sizeTwoID3'] == id){
          $scope.initSettings['sizeTwoID3'] = "";
          $scope.initSettings['sizeTwo3'] = "";
          $scope.caractOption2[id] = "caractOption";
        }
      }
      else{
        if(angular.isUndefined($scope.initSettings['sizeTwoID']) || $scope.initSettings['sizeTwoID'] == ""){
          $scope.initSettings['sizeTwoID'] = id;
          $scope.initSettings['sizeTwo'] = sizes[id];
          $scope.caractOption2[id] = "caractOptionActive";
        }
        else if(angular.isUndefined($scope.initSettings['sizeTwoID2']) || $scope.initSettings['sizeTwoID2'] == ""){
          $scope.initSettings['sizeTwoID2'] = id;
          $scope.initSettings['sizeTwo2'] = sizes[id];
          $scope.caractOption2[id] = "caractOptionActive";
        }
        else if(angular.isUndefined($scope.initSettings['sizeTwoID3']) || $scope.initSettings['sizeTwoID3'] == ""){
          $scope.initSettings['sizeTwoID3'] = id;
          $scope.initSettings['sizeTwo3'] = sizes[id];
          $scope.caractOption2[id] = "caractOptionActive";
        }
      }
      // $scope.initSettings['sizeTwoID'] = id;
      // $scope.initSettings['sizeTwo'] = sizes[id];
      //
      // angular.forEach($scope.caractOption2, function(v, k) {
      //   if(k == id){
      //     $scope.caractOption2[k] = "caractOptionActive";
      //   }
      //   else{
      //     $scope.caractOption2[k] = "caractOption";
      //   }
      // });
    }

    $scope.crt3 = function functionName(id) {
      if($scope.caractOption3[id] == "caractOptionActive"){
        if($scope.initSettings['sizeThreeID'] == id){
          $scope.initSettings['sizeThreeID'] = "";
          $scope.initSettings['sizeThree'] = "";
          $scope.caractOption3[id] = "caractOption";
        }
        else if($scope.initSettings['sizeThreeID2'] == id){
          $scope.initSettings['sizeThreeID2'] = "";
          $scope.initSettings['sizeThree2'] = "";
          $scope.caractOption3[id] = "caractOption";
        }
        else if($scope.initSettings['sizeThreeID3'] == id){
          $scope.initSettings['sizeThreeID3'] = "";
          $scope.initSettings['sizeThree3'] = "";
          $scope.caractOption3[id] = "caractOption";
        }
      }
      else{
        if(angular.isUndefined($scope.initSettings['sizeThreeID']) || $scope.initSettings['sizeThreeID'] == ""){
          $scope.initSettings['sizeThreeID'] = id;
          $scope.initSettings['sizeThree'] = sizes[id];
          $scope.caractOption3[id] = "caractOptionActive";
        }
        else if(angular.isUndefined($scope.initSettings['sizeThreeID2']) || $scope.initSettings['sizeThreeID2'] == ""){
          $scope.initSettings['sizeThreeID2'] = id;
          $scope.initSettings['sizeThree2'] = sizes[id];
          $scope.caractOption3[id] = "caractOptionActive";
        }
        else if(angular.isUndefined($scope.initSettings['sizeThreeID3']) || $scope.initSettings['sizeThreeID3'] == ""){
          $scope.initSettings['sizeThreeID3'] = id;
          $scope.initSettings['sizeThree3'] = sizes[id];
          $scope.caractOption3[id] = "caractOptionActive";
        }
      }

    }

    $scope.saveInitSettings = function(data){
      var dataSettings = {
        firstname: data.firstname,
        lastname: data.lastname,
        firstAddress: data.firstAddress,
        secondAddress: data.secondAddress,
        city: data.city,
        zip: data.zip,
        sizeOneID: data.sizeOneID,
        sizeTwoID: data.sizeTwoID,
        sizeThreeID: data.sizeThreeID,
        sizeOne: data.sizeOne,
        sizeTwo: data.sizeTwo,
        sizeThree: data.sizeThree,

        sizeOneID2: data.sizeOneID2,
        sizeTwoID2: data.sizeTwoID2,
        sizeThreeID2: data.sizeThreeID2,
        sizeOne2: data.sizeOne2,
        sizeTwo2: data.sizeTwo2,
        sizeThree2: data.sizeThree2,

        sizeOneID3: data.sizeOneID3,
        sizeTwoID3: data.sizeTwoID3,
        sizeThreeID3: data.sizeThreeID3,
        sizeOne3: data.sizeOne3,
        sizeTwo3: data.sizeTwo3,
        sizeThree3: data.sizeThree3
      }
      $http({
        method : "PUT",
        data: dataSettings,
        url : WEBROOT+"saveSettings/"+window.localStorage.getItem("userID"),
      }).then(function mySucces(r) {
        functions.saveLocalstorage(r.data);
        $state.go('app.feed');
        },function myError(resp) {

          });
    }
  })

  app.controller('feedController', function($scope, $ionicHistory, $state, $http, $ionicNavBarDelegate,functions) {
    // $state.go('app.youritem', {id:1});

    window.localStorage.setItem("userFirstTime", 0);
    $ionicNavBarDelegate.showBackButton(false);
    $scope.feeds = {};
    var likeImg = {};

    // var r = {}
    // r.data = {"items":[{"_id":"573b7392dd1c27f600643769","title":"Mi imagen","description":"Gail","pricesite":100,"priceyour":80,"user":"573abad3ddb00d61ac314add","brand":"1789 CALA","type":"shoes","size":"6.5","sizeID":23,"condition":"Great condition","material":"Wool","color":"Navy","img1":"WfIEF8gxpwXTynFsIw-sDT61.jpg","img2":"","img3":"","__v":0,"active":1,"skip":0,"likes":1},{"_id":"573ba32cdd1c27f60064376d","title":"torta","description":"Torta rica","pricesite":100,"priceyour":80,"user":"573ba093dd1c27f60064376c","brand":"1 2 3","type":"shoes","size":"7.5","sizeID":25,"condition":"Great condition","material":"Wood","color":"Beige","img1":"95_BqYBKazWTvlqvf-xx0FA0.jpg","img2":"","img3":"","__v":0,"active":1,"skip":0,"likes":1},{"_id":"573f7948d548195709f587b9","title":"Paisaje","description":"Test","pricesite":13,"priceyour":10.4,"user":"573f78edd548195709f587b8","brand":"1789 CALA","type":"clothes","size":"M","sizeID":4,"condition":"Good condition","material":"Sponge","color":"Navy","img1":"IuisotJ1HTWSMm_wC0ffNzzA.jpg","img2":"","img3":"","__v":0,"active":1,"skip":0,"likes":1},{"_id":"574308595d6f2981ef099910","title":"Venezuela","description":"Playas hermosas","pricesite":1000,"priceyour":800,"user":"574304eb5d6f2981ef09990c","brand":"1789 CALA","type":"clothes","size":"0","sizeID":0,"condition":"Great condition","material":"OTHER","color":"Blue","img1":"qoOcFKbykpD7UR9zgSY4GiHr.jpg","img2":"ne-L1gpPM37K56oAOiQT4bMx.jpg","img3":"-WRkQFN2ser2HGEHw13S1RuM.jpg","__v":0,"active":1,"skip":0,"likes":2},{"_id":"574309cb5d6f2981ef099911","title":"Gail","description":"Hybrid app","pricesite":500,"priceyour":400,"user":"574304eb5d6f2981ef09990c","brand":"10 CROSBY BY DL","type":"shoes","size":"7.5","sizeID":25,"condition":"Good condition","material":"Sponge","color":"Navy","img1":"vbclv-99inMe55hPRoCkmrWQ.jpg","img2":"","img3":"","__v":0,"active":1,"skip":0,"likes":1},{"_id":"57430cae5d6f2981ef099915","title":"Gato","description":"Gato","pricesite":300,"priceyour":240,"user":"57430a995d6f2981ef099912","brand":"1789 CALA","type":"clothes","size":"12","sizeID":14,"condition":"New with labels","material":"Denim - Jeans","color":"White","img1":"l8wWwSseeGVrhj35ZtbEc-sM.jpg","img2":"","img3":"","__v":0,"active":1,"skip":0,"likes":2},{"_id":"57437520b97884fb006160a9","title":"Playa","description":"Hola","pricesite":1000,"priceyour":800,"user":"57437474b97884fb006160a8","brand":"ADIDAS","type":"clothes","size":"8","sizeID":12,"condition":"Good condition","material":"Denim - Jeans","color":"Burgundy","img1":"5PF8F_EF_gS3Hr_p--gJmPYt.jpg","img2":"","img3":"","__v":0,"active":1,"skip":0,"likes":1}],"likes":[{"_id":"573b7e43dd1c27f60064376a","item":"573b7392dd1c27f600643769","user":"573a315d9a978af90026dfc4","owner":"573abad3ddb00d61ac314add","__v":0},{"_id":"573ce0ecdd1c27f600643771","item":"573ba32cdd1c27f60064376d","user":"573a315d9a978af90026dfc4","owner":"573ba093dd1c27f60064376c","__v":0},{"_id":"573f7bced548195709f587bb","item":"573f7948d548195709f587b9","user":"573a315d9a978af90026dfc4","owner":"573f78edd548195709f587b8","__v":0},{"_id":"5743701bb97884fb00616099","item":"574309cb5d6f2981ef099911","user":"573a315d9a978af90026dfc4","owner":"574304eb5d6f2981ef09990c","__v":0},{"_id":"5743701bb97884fb0061609b","item":"57430cae5d6f2981ef099915","user":"573a315d9a978af90026dfc4","owner":"57430a995d6f2981ef099912","__v":0},{"_id":"5743701cb97884fb0061609f","item":"574308595d6f2981ef099910","user":"573a315d9a978af90026dfc4","owner":"574304eb5d6f2981ef09990c","__v":0},{"_id":"57445bebb97884fb006160b3","item":"57437520b97884fb006160a9","user":"573a315d9a978af90026dfc4","owner":"57437474b97884fb006160a8","__v":0},{"_id":"57445bebb97884fb006160b4","item":"57437520b97884fb006160a9","user":"573a315d9a978af90026dfc4","owner":"57437474b97884fb006160a8","__v":0}]};

    $http({
      method : "GET",
      url : WEBROOT+"getFeeds/"+ window.localStorage.getItem("userID"),
    }).then(function mySucces(r) {

      angular.forEach(r.data['items'], function(v, k) {
        r.data['items'][k]['img1'] = WEBROOT+'images/'+r.data['items'][k]['img1'];

        r.data['items'][k]['likeIMG'] = "assets/heartempty.png";
        angular.forEach(r.data['likes'], function(val, key) {
          if(v['_id'] == val['item']){
            r.data['items'][k]['likeIMG'] = "assets/heartlikes.png";
            return;
          }
        });
      });
        $scope.feeds = r.data['items'];
      }, function myError(resp) {
    });
    $scope.likeHeart = function(feed){
      var likeData = {
        item: feed['_id'],
        user: window.localStorage.getItem("userID"),
        owner: feed['user']
      }

      functions.likeClick(likeData,feed,$http);
    }
	});

  app.controller('youritemController', function($scope, $ionicHistory, $state,$http, functions) {
    $scope.goToSideMenu = function(goToState) {
        $state.go(goToState);
    };
    $scope.fullItems = false;
    $scope.emptyItems = false;

    var owner = "";
    $scope.details = {};
    var imgStars = "";

    // var r = {};
    // r.data = {"item":{"_id":"57746a646f13625e2959c946","title":"Dress","description":"Fashion Dress","pricesite":90,"priceyour":72,"user":"5749c422836e991a7b37ee01","brand":"CALVIN KLEIN","type":"clothes","size":"XS","sizeID":2,"condition":"Great condition","material":"Cotton  ","color":"OTHER","img1":"Swxe3BLKflTAzpqn8nnlWlDP.jpg","img2":"","img3":"","__v":0,"active":1,"skip":3,"loveActive":0,"likes":1},"user":{"_id":"5749c422836e991a7b37ee01","firstname":"Marian","email":"marian@bepurpledash.com","username":"Marian","password":"12345678","__v":0,"brand10":"","brand9":"","brand8":"","brand7":"","brand6":"","brand5":"","brand4":"","brand3":"","brand2":"","brand1":"","swaps":0,"sales":0,"sizeThree3":"","sizeTwo3":"","sizeOne3":"","sizeThreeID3":0,"sizeTwoID3":0,"sizeOneID3":0,"sizeThree2":"","sizeTwo2":"","sizeOne2":"","sizeThreeID2":0,"sizeTwoID2":0,"sizeOneID2":0,"sizeThree":"10","sizeTwo":"4.5","sizeOne":"XS","sizeThreeID":26,"sizeTwoID":15,"sizeOneID":2,"star":0,"zip":"1178","city":"Buenos Aires","secondAddress":"","firstAddress":"3 de febrero 256","firstTime":"0","image":"Vvtv7kwzMFqVz5j97eWkr7Tq.jpg","lastname":"Sidero"},"like":false,"items":[{"_id":"577469a26f13625e2959c945","title":"Shoes","description":"Shoes","pricesite":60,"priceyour":48,"user":"5749c422836e991a7b37ee01","brand":"ALDO","type":"shoes","size":"8","sizeID":26,"condition":"New with labels","material":"Leather","color":"Black","img1":"o891ZS_oOTO08CBV39FrlIbJ.jpg","img2":"IrmP4pwRxH_Nh9d6LVt9Xa2R.jpg","img3":"","__v":0,"active":1,"skip":1,"loveActive":0,"likes":1},{"_id":"57746ad76f13625e2959c947","title":"Sneakers","description":"Sports Sneakers","pricesite":70,"priceyour":56,"user":"5749c422836e991a7b37ee01","brand":"ADIDAS","type":"shoes","size":"8","sizeID":26,"condition":"Great condition","material":"Leather","color":"Black","img1":"EKCMwWwzpjJdUgw6nNV6uhht.jpg","img2":"","img3":"","__v":0,"active":1,"skip":1,"loveActive":0,"likes":2},{"_id":"57746b1e6f13625e2959c948","title":"Fashion Bag","description":"Every day bag","pricesite":90,"priceyour":72,"user":"5749c422836e991a7b37ee01","brand":"BANANA REPUBLIC","type":"bags","size":"0","sizeID":0,"condition":"Great condition","material":"Leather","color":"Burgundy","img1":"hWI5J2-4nZ2HzaH37jD6POo1.jpg","img2":"Gp2xRftvSimxXSCVGqzgkSua.jpg","img3":"","__v":0,"active":1,"skip":9,"loveActive":0,"likes":2}],"lik":[{"_id":"5775afbd1b3ff1373a21efd3","item":"57746b1e6f13625e2959c948","user":"5772d1f46d66ec026fb2952e","owner":"5749c422836e991a7b37ee01","__v":0},{"_id":"5775afbd1b3ff1373a21efd5","item":"57746ad76f13625e2959c947","user":"5772d1f46d66ec026fb2952e","owner":"5749c422836e991a7b37ee01","__v":0}]}

    $http({
      method : "GET",
      url : WEBROOT+"detailsItem/"+$state.params.id+"/"+window.localStorage.getItem("userID"),
    }).then(function mySucces(r) {
          $scope.imgS = {};
          $scope.only1Img = false;
          $scope.only2Img = false;
          $scope.only3Img = false;
          // alert( r.data['item']['sizeID'] );

          if(r.data['item']['img1'] != "" && r.data['item']['img2'] == "" && r.data['item']['img3'] == ""){
            $scope.only1Img = true;
            $scope.imgS[1] = WEBROOT+'images/'+r.data['item']['img1'];
          }
          if(r.data['item']['img2'] != "" && r.data['item']['img1'] != "" && r.data['item']['img3'] == ""){
            $scope.only2Img = true;
            $scope.imgS[1] = WEBROOT+'images/'+r.data['item']['img1'];
            $scope.imgS[2] = WEBROOT+'images/'+r.data['item']['img2'];
          }
          if(r.data['item']['img3'] != "" && r.data['item']['img1'] != "" && r.data['item']['img2'] != ""){
            $scope.only3Img = true;
            $scope.imgS[1] = WEBROOT+'images/'+r.data['item']['img1'];
            $scope.imgS[2] = WEBROOT+'images/'+r.data['item']['img2'];
            $scope.imgS[3] = WEBROOT+'images/'+r.data['item']['img3'];
          }
          $scope.details = r.data['item'];

          if(r.data['user']['image'] != ""){
            r.data['user']['image'] = WEBROOT+'images/'+r.data['user']['image'];

          }else{
            r.data['user']['image'] = "assets/avatar2.png";
          }

          $scope.user = r.data['user'];
          owner = r.data['user']['_id'];
          // window.localStorage.setItem('idMEMEBER', owner);

          for (var i = 0; i < 5; i++) {
            if(i <= r.data['user']['star'] && i != 0){
              imgStars += '<img src="assets/starFull.png" />';
            }
            else{
              imgStars += '<img src="assets/starEmpty.png" />';
            }
          }
          $scope.stars = imgStars;
          if(r.data['like']){
            $scope.details['likeIMG'] = "assets/heartlikes.png";
          }
          else {
            $scope.details['likeIMG'] ="assets/heartempty.png";
          }

          for (var i = 0; i < r.data['items'].length; i++) {
            r.data['items'][i]['img1'] = WEBROOT+'images/'+r.data['items'][i]['img1'];
            r.data['items'][i]['likeIMG'] = "assets/heartempty.png";
            for (var ii = 0; ii < r.data['lik'].length; ii++) {
              if(r.data['items'][i]['_id'] == r.data['lik'][ii]['item']){
                r.data['items'][i]['likeIMG'] = "assets/heartlikes.png";
              }
            }
          }
          if(r.data['items'].length == 0){
            $scope.emptyItems = true;
          }
          else{
            $scope.fullItems = true;
          }
          $scope.foos = r.data['items'];
      },function myError(resp) {

        });

    $scope.likeHeart = function(details){
      var likeData = {
        item: details['_id'],
        user: window.localStorage.getItem("userID"),
        owner: details['user']
      }
      functions.likeClick(likeData, details, $http);
    }

    $scope.$on('ngRepeatFinished', function () {
      var mySwiper = new Swiper('.swiper-container',{
          //Your options here:
          mode:'horizontal',
          loop: true,
          keyboardControl: true,
          mousewheelControl: true,
          slidesPerView: 3,
          centeredSlides: true,
          nextButton: '.swiper-button-next, .resultButtonNext',
          prevButton: '.swiper-button-prev',
          onSlideClick: function (swiper) {
            angular.element(swiper.clickedSlide).scope().clicked(angular.element(swiper.clickedSlide).scope().$index)
          },
          onSlideNextEnd: function (swiper) {
            // $scope.nextIndex = swiper.previousIndex;
          }
      });
    });


  });

  app.controller('mylovesController', function($scope, $ionicHistory, $state, $http,$ionicNavBarDelegate, functions) {
    $ionicNavBarDelegate.showBackButton(false);

    // var r = {};
    // r.data = [{"_id":"577469a26f13625e2959c945","title":"Shoes","description":"Shoes","pricesite":60,"priceyour":48,"user":"5749c422836e991a7b37ee01","brand":"ALDO","type":"shoes","size":"8","sizeID":26,"condition":"New with labels","material":"Leather","color":"Black","img1":"o891ZS_oOTO08CBV39FrlIbJ.jpg","img2":"IrmP4pwRxH_Nh9d6LVt9Xa2R.jpg","img3":"","__v":0,"active":1,"skip":1,"loveActive":0,"likes":2},{"_id":"57746a646f13625e2959c946","title":"Dress","description":"Fashion Dress","pricesite":90,"priceyour":72,"user":"5749c422836e991a7b37ee01","brand":"CALVIN KLEIN","type":"clothes","size":"XS","sizeID":2,"condition":"Great condition","material":"Cotton  ","color":"OTHER","img1":"Swxe3BLKflTAzpqn8nnlWlDP.jpg","img2":"","img3":"","__v":0,"active":1,"skip":3,"loveActive":0,"likes":2},{"_id":"57746ad76f13625e2959c947","title":"Sneakers","description":"Sports Sneakers","pricesite":70,"priceyour":56,"user":"5749c422836e991a7b37ee01","brand":"ADIDAS","type":"shoes","size":"8","sizeID":26,"condition":"Great condition","material":"Leather","color":"Black","img1":"EKCMwWwzpjJdUgw6nNV6uhht.jpg","img2":"","img3":"","__v":0,"active":1,"skip":1,"loveActive":0,"likes":2},{"_id":"57746b1e6f13625e2959c948","title":"Fashion Bag","description":"Every day bag","pricesite":90,"priceyour":72,"user":"5749c422836e991a7b37ee01","brand":"BANANA REPUBLIC","type":"bags","size":"0","sizeID":0,"condition":"Great condition","material":"Leather","color":"Burgundy","img1":"hWI5J2-4nZ2HzaH37jD6POo1.jpg","img2":"Gp2xRftvSimxXSCVGqzgkSua.jpg","img3":"","__v":0,"active":1,"skip":9,"loveActive":0,"likes":2}];

    var myLoves = {};
    $http({
      method : "GET",
      url : WEBROOT+"getMylove/"+ window.localStorage.getItem("userID"),
    }).then(function mySucces(r) {


      angular.forEach(r.data, function(v, k) {
        r.data[k]['likeIMG'] = "assets/heartlikes.png";
        r.data[k]['img1'] = WEBROOT+'images/'+r.data[k]['img1'];
      })
        $scope.myLoves = r.data;

      }, function myError(resp) {

    });

    $scope.likeHeart = function(item){
      var likeData = {
        item: item['_id'],
        user: window.localStorage.getItem("userID"),
        owner: item['user']
      }

      functions.likeClick(likeData,item,$http);
    }

  });

  app.controller('lovemeController', function($ionicSideMenuDelegate, $scope, $ionicHistory, $state,$http,$ionicNavBarDelegate) {
    $ionicNavBarDelegate.showBackButton(false);
    var loveMe = {};
    // var r = {};
    // r.data = {"Item":{"577469a26f13625e2959c945":{"_id":"577469a26f13625e2959c945","title":"Shoes","description":"Shoes","pricesite":60,"priceyour":48,"user":"5749c422836e991a7b37ee01","brand":"ALDO","type":"shoes","size":"8","sizeID":26,"condition":"New with labels","material":"Leather","color":"Black","img1":"o891ZS_oOTO08CBV39FrlIbJ.jpg","img2":"IrmP4pwRxH_Nh9d6LVt9Xa2R.jpg","img3":"","__v":0,"active":1,"skip":1,"loveActive":0,"likes":1},"57746a646f13625e2959c946":{"_id":"57746a646f13625e2959c946","title":"Dress","description":"Fashion Dress","pricesite":90,"priceyour":72,"user":"5749c422836e991a7b37ee01","brand":"CALVIN KLEIN","type":"clothes","size":"XS","sizeID":2,"condition":"Great condition","material":"Cotton  ","color":"OTHER","img1":"Swxe3BLKflTAzpqn8nnlWlDP.jpg","img2":"","img3":"","__v":0,"active":1,"skip":3,"loveActive":0,"likes":0},"57746ad76f13625e2959c947":{"_id":"57746ad76f13625e2959c947","title":"Sneakers","description":"Sports Sneakers","pricesite":70,"priceyour":56,"user":"5749c422836e991a7b37ee01","brand":"ADIDAS","type":"shoes","size":"8","sizeID":26,"condition":"Great condition","material":"Leather","color":"Black","img1":"EKCMwWwzpjJdUgw6nNV6uhht.jpg","img2":"","img3":"","__v":0,"active":1,"skip":1,"loveActive":0,"likes":2},"57746b1e6f13625e2959c948":{"_id":"57746b1e6f13625e2959c948","title":"Fashion Bag","description":"Every day bag","pricesite":90,"priceyour":72,"user":"5749c422836e991a7b37ee01","brand":"BANANA REPUBLIC","type":"bags","size":"0","sizeID":0,"condition":"Great condition","material":"Leather","color":"Burgundy","img1":"hWI5J2-4nZ2HzaH37jD6POo1.jpg","img2":"Gp2xRftvSimxXSCVGqzgkSua.jpg","img3":"","__v":0,"active":1,"skip":9,"loveActive":0,"likes":1},"577e911c4fd39bc670d1a541":{"_id":"577e911c4fd39bc670d1a541","title":"Handkerchief","description":"Handkerchief","pricesite":30,"priceyour":24,"user":"5749c422836e991a7b37ee01","brand":"BENETTON","type":"accessories","size":"0","sizeID":0,"condition":"New with labels","material":"Cotton  ","color":"OTHER","img1":"ivSY9akE84BKiX42lrN0cHtf.jpg","img2":"","img3":"","__v":0,"active":1,"skip":0,"loveActive":1,"likes":1},"577e93ff4fd39bc670d1a549":{"_id":"577e93ff4fd39bc670d1a549","title":"Dress","description":"Dress hipie chic","pricesite":80,"priceyour":64,"user":"5749c422836e991a7b37ee01","brand":"ARMANI","type":"clothes","size":"14","sizeID":15,"condition":"Great condition","material":"Cotton  ","color":"Brown","img1":"tHwkHSOrCPGR5m2OJO7zLb0Y.jpg","img2":"","img3":"","__v":0,"active":1,"skip":0,"loveActive":1,"likes":1},"577e94474fd39bc670d1a54c":{"_id":"577e94474fd39bc670d1a54c","title":"Pants","description":"Pants","pricesite":90,"priceyour":72,"user":"5749c422836e991a7b37ee01","brand":"ANN TAYLOR","type":"clothes","size":"12","sizeID":14,"condition":"New with labels","material":"Cotton  ","color":"OTHER","img1":"kcHWiw2ZBDawvaJlNP4KbgH_.jpg","img2":"","img3":"","__v":0,"active":1,"skip":0,"loveActive":1,"likes":0},"577e94bc4fd39bc670d1a54d":{"_id":"577e94bc4fd39bc670d1a54d","title":"Dress","description":"Dress","pricesite":90,"priceyour":72,"user":"5749c422836e991a7b37ee01","brand":"BANANA MOON","type":"clothes","size":"XS","sizeID":2,"condition":"Great condition","material":"Silk","color":"Orange","img1":"V-_CiQGEx7SK1rfRWYfvPNhZ.jpg","img2":"","img3":"","__v":0,"active":1,"skip":0,"loveActive":1,"likes":1}},"Like":[{"_id":"5775afbd1b3ff1373a21efd3","item":"57746b1e6f13625e2959c948","user":"5772d1f46d66ec026fb2952e","owner":"5749c422836e991a7b37ee01","__v":0},{"_id":"5775afbd1b3ff1373a21efd5","item":"57746ad76f13625e2959c947","user":"5772d1f46d66ec026fb2952e","owner":"5749c422836e991a7b37ee01","__v":0},{"_id":"577d9560bc1db02162acc98a","item":"577469a26f13625e2959c945","user":"57604972a4ee8b557a362b16","owner":"5749c422836e991a7b37ee01","__v":0},{"_id":"577d9d84bc1db02162acc9ac","item":"57746ad76f13625e2959c947","user":"57604972a4ee8b557a362b16","owner":"5749c422836e991a7b37ee01","__v":0},{"_id":"577e932a4fd39bc670d1a546","item":"577e911c4fd39bc670d1a541","user":"5772aac66d66ec026fb294f6","owner":"5749c422836e991a7b37ee01","__v":0},{"_id":"577e940d4fd39bc670d1a54a","item":"577e93ff4fd39bc670d1a549","user":"5772aac66d66ec026fb294f6","owner":"5749c422836e991a7b37ee01","__v":0},{"_id":"577ecaab404c0b1774d1b636","item":"577e94bc4fd39bc670d1a54d","user":"5772aac66d66ec026fb294f6","owner":"5749c422836e991a7b37ee01","__v":0}],"User":{"57604972a4ee8b557a362b16":{"_id":"57604972a4ee8b557a362b16","firstname":"César","email":"cesar.hergueta.l@gmail.com","__v":0,"brand10":"KATE SPADE","brand9":"MAJE","brand8":"MAX MARA","brand7":"NINE WEST","brand6":"ASOS","brand5":"UNIQLO","brand4":"URBAN OUTFITTERS","brand3":"ZARA","brand2":"TOPSHOP","brand1":"RALPH LAUREN","swaps":0,"sales":0,"sizeThree3":"8","sizeTwo3":"10","sizeOne3":"XS","sizeThreeID3":22,"sizeTwoID3":13,"sizeOneID3":2,"sizeThree2":"6.5","sizeTwo2":"0","sizeOne2":"M","sizeThreeID2":19,"sizeTwoID2":8,"sizeOneID2":4,"sizeThree":"9","sizeTwo":"6","sizeOne":"XXS","sizeThreeID":24,"sizeTwoID":11,"sizeOneID":1,"star":0,"zip":"0212","city":"Caracas","secondAddress":"","firstAddress":"Caracas","firstTime":"0","image":"JH4dZhe30OaWLfpeISqvHhgR.jpg","lastname":"Hergueta"},"5772aac66d66ec026fb294f6":{"_id":"5772aac66d66ec026fb294f6","firstname":"Diogo1","email":"dietorreaba@gmail.com","username":"torr","password":"asdfghjk","__v":0,"brand10":"UNIQLO","brand9":"MAX MARA","brand8":"KATE SPADE","brand7":"GUESS","brand6":"ESPRIT","brand5":"BANANA REPUBLIC","brand4":"ANN TAYLOR","brand3":"AMERICAN APPAREL","brand2":"ALDO","brand1":"ADIDAS","swaps":1,"sales":0,"sizeThree3":"","sizeTwo3":"12","sizeOne3":"XS","sizeThreeID3":32,"sizeTwoID3":14,"sizeOneID3":2,"sizeThree2":"","sizeTwo2":"5","sizeOne2":"M","sizeThreeID2":31,"sizeTwoID2":16,"sizeOneID2":4,"sizeThree":"12","sizeTwo":"4.5","sizeOne":"S","sizeThreeID":30,"sizeTwoID":15,"sizeOneID":3,"star":0,"zip":"1080","city":"Buenos aires","secondAddress":"Hahaggs","firstAddress":"Gagaga","firstTime":"0","image":"ZZOiv8vNjr6GKIi5FLGxctcD.jpg","lastname":"Torrealba"}}}
    $http({
      method : "GET",
      url : WEBROOT+"getLovinme/"+window.localStorage.getItem("userID"),
    }).then(function mySucces(r) {
        angular.forEach(r.data['Like'], function(val, key) {
          if(r.data['User'][val['user']]){
            var details = {};
            var ex = 0;
            var fname = r.data['User'][val['user']]['firstname'];
            var lname = r.data['User'][val['user']]['lastname'];
            if(r.data['Item'][val['item']]['likes'] == 1){
              details['details'] = "<a menu-close href='#/appSeven/detailsMember/"+r.data['User'][val['user']]['_id']+"'  class='redColor' >"+fname+" "+lname+"</a> <img class='' src='assets/lovinmeRed.png'/> your item. ";
            }else{
              details['details'] = "<a menu-close href='#/appSeven/detailsMember/"+r.data['User'][val['user']]['_id']+"' class='redColor' >"+fname+" "+lname+"</a> and <br>"+r.data['Item'][val['item']]['likes']+" others <img class='' src='assets/lovinmeRed.png'/> your item. "+r.data['Item'][val['item']]['title'];
            }
            details['skip'] = r.data['Item'][val['item']]['skip'];
            details['id'] = r.data['Item'][val['item']]['_id'];
            details['img'] = WEBROOT+'images/'+r.data['Item'][val['item']]['img1'];

            angular.forEach(loveMe, function(vl, ky) {
              if(vl['id'] == details['id']){
                ex = 1;
              }
            })
            if(r.data['Item'][val['item']]['loveActive'] == 0){
              ex = 1;
            }
            if(ex == 0){
              loveMe[key] = details;
            }
          }
        });
        $scope.lovemes = loveMe;
      }, function myError(resp) {
    });

      $scope.goToSideMenu = function(goToState) {
          $state.go(goToState);
      };
  });

  app.controller('lovemedetails', function($scope, $ionicHistory, $state, $http, functions){
    // var r = {};
    // r.data = {"items":{"574f44e8836e991a7b37ee0e":{"0":{"_id":"574f4748836e991a7b37ee11","title":"Mod cloth lovely dress","description":"Lovely dress","pricesite":30,"priceyour":24,"user":"574f44e8836e991a7b37ee0e","brand":"MODCLOTH","type":"clothes","size":"M","sizeID":4,"condition":"New with labels","material":"Cotton","color":"Purple","img1":"OiTs0hn5OwRH6u7YCvof0b4P.jpg","img2":"XsdXPjZLpVAlEdjKUhc2mpsC.jpg","img3":"NkwThYVJjAgzn5fTal4E4mT-.jpg","__v":0,"active":1,"skip":7,"likes":4}},"575ee206859f8d51685db1f0":{"1":{"_id":"575ee398859f8d51685db1f1","title":"Pants","description":"Ekddkd","pricesite":10,"priceyour":null,"user":"575ee206859f8d51685db1f0","brand":"PETIT BATEAU","type":"clothes","size":"8","sizeID":12,"condition":"Great condition","material":"Denim - Jeans ","color":"Blue","img1":"scau6kZcLQD2VTvwG-O9t6-s.jpg","img2":"","img3":"","__v":0,"active":1,"skip":0,"likes":2}},"57604972a4ee8b557a362b16":{"2":{"_id":"57717ea46c3e11754f8eec99","title":"Mono","description":"Mono","pricesite":100,"priceyour":null,"user":"57604972a4ee8b557a362b16","brand":"ADIDAS","type":"clothes","size":"6","sizeID":11,"condition":"New with labels","material":"Cotton  ","color":"Black","img1":"8kGxq0DoGW4cI0zelUrTzKWO.jpg","img2":"","img3":"","__v":0,"active":1,"skip":0,"likes":1},"3":{"_id":"57717ed26c3e11754f8eec9a","title":"Zapatos","description":"Zapatos","pricesite":100,"priceyour":null,"user":"57604972a4ee8b557a362b16","brand":"ADIDAS","type":"shoes","size":"7","sizeID":24,"condition":"New with labels","material":"Polyester","color":"Black","img1":"biIr-H5ljZ_zb5WcUmh899rJ.jpg","img2":"","img3":"","__v":0,"active":1,"skip":0,"likes":1},"4":{"_id":"57717f046c3e11754f8eec9b","title":"Chaqueta","description":"Chaqueta","pricesite":100,"priceyour":null,"user":"57604972a4ee8b557a362b16","brand":"ADIDAS","type":"clothes","size":"M","sizeID":4,"condition":"Great condition","material":"Denim - Jeans ","color":"Brown","img1":"CsIRYAaDH-e-IUP2phog6Tdo.jpg","img2":"","img3":"","__v":0,"active":1,"skip":0,"likes":1}}},"likes":[{"_id":"5750aa4b836e991a7b37ee45","item":"574f4748836e991a7b37ee11","user":"5749c422836e991a7b37ee01","owner":"574f44e8836e991a7b37ee0e","__v":0},{"_id":"575f27a0ae7216836c0d85d4","item":"575ee398859f8d51685db1f1","user":"5749c422836e991a7b37ee01","owner":"575ee206859f8d51685db1f0","__v":0},{"_id":"5771885b6c3e11754f8eec9c","item":"57717ea46c3e11754f8eec99","user":"5749c422836e991a7b37ee01","owner":"57604972a4ee8b557a362b16","__v":0},{"_id":"5771885b6c3e11754f8eec9e","item":"57717f046c3e11754f8eec9b","user":"5749c422836e991a7b37ee01","owner":"57604972a4ee8b557a362b16","__v":0},{"_id":"5771885c6c3e11754f8eeca0","item":"57717ed26c3e11754f8eec9a","user":"5749c422836e991a7b37ee01","owner":"57604972a4ee8b557a362b16","__v":0}]}
    var res = {};
    var c = [];

    $http({
      method : "GET",
      url : WEBROOT+"detailsloveme/"+$state.params.id+"/"+$state.params.skip+"/"+window.localStorage.getItem('userID'),
    }).then(function mySucces(r) {
      var ct = 0;
      angular.forEach(r.data['items'], function(v, k) {
        angular.forEach(v, function(va, ke) {
          var sp = 0;
          r.data['items'][k][ke]['img1'] = WEBROOT+'images/'+r.data['items'][k][ke]['img1'];
          r.data['items'][k][ke]['likeIMG'] = "assets/heartempty.png";
          angular.forEach(r.data['likes'], function(val, key) {
            if(val['item'] == v[ke]['_id']){
              sp = 1;
            }
          })
          if(sp == 0){
            if(ct == 0){
              c[ct] = "";
            }
            else{
              c[ct] = "hide";
            }
            res[ct] = r.data['items'][k][ke];
            ct += 1;
          }
        })
      })
      $scope.foos = res;
      $scope.c = c;
      $scope.totalSearch = ct;

      }, function myError(resp) {
    });

    $scope.spaceDropIgnore = function(data, evtn){
      c[data] = 'hide';
      c[data+1] = "";

      $scope.c = c;
      $http({
        method : "GET",
        url : WEBROOT+"sumLess/"+$state.params.id,
      }).then(function mySucces(r) {
      }, function myError(resp) {
      });

      if(angular.isUndefined(res[data+1])){
        $http({
          method : "GET",
          url : WEBROOT+"disabledLove/"+$state.params.id,
        }).then(function mySucces(r) {
          $state.go('app.loveme');
        });
      }
    }

    $scope.spaceDropLike = function(data, evtn){
      c[data] = 'hide';
      c[data+1] = "";
      $scope.c = c;
      if(angular.isUndefined(res[data+1])){
        $http({
          method : "GET",
          url : WEBROOT+"sumLess/"+$state.params.id,
        }).then(function mySucces(r) {
        });
      }
      var likeData = {
        item: res[data]['_id'],
        user: window.localStorage.getItem("userID"),
        owner: res[data]['user']
      }
      functions.likeClick(likeData,data,$http);
    }

  })

  app.controller('detailsmemberController', function($rootScope, $scope, $ionicHistory, $state,$http,functions){
    var imgStars = "";
    $scope.myItems = {};
    var memberId;
    $http({
      method : "GET",
      url : WEBROOT+"getYourItems/"+$state.params.id+"/"+window.localStorage.getItem("userID"),
    }).then(function mySucces(r) {
        $scope.memberFollowers =r.data['follower'];
        $scope.memberFollowing =r.data['following'];

        if(r.data['Follow'] != null){
          $scope.status = "assets/FollowingMember.png";
        }
        else{
          $scope.status = "assets/FollowMember.png";
        }

        if(r.data['User']['image'] != ""){
          $scope.imageMProfile = WEBROOT+"images/"+r.data['User']['image'];
          $scope.imageMBackground = WEBROOT+"images/"+r.data['User']['image'];
        }
        else{
          $scope.imageMBackground = "assets/sinfiltrocopy.png"
          $scope.imageMProfile = "assets/avatar2.png";
        }
        memberId = r.data['User']['_id'];
        $rootScope.idMember = memberId;
        $scope.memberId = memberId;
        $scope.memberName = r.data['User']['firstname'] +" "+ r.data['User']['lastname'];
        for (var i = 0; i < 5; i++) {
          if(i <= r.data['User']['star'] && i != 0){
            imgStars += '<img src="assets/starFull.png" />';
          }
          else{
            imgStars += '<img src="assets/starEmpty.png" />';
          }
        }
        angular.forEach(r.data['Items'], function(v, k) {
          r.data['Items'][k]['img1'] = WEBROOT+"images/"+r.data['Items'][k]['img1'];
          r.data['Items'][k]['likeIMG'] = "assets/heartempty.png";
          angular.forEach(r.data['Likes'], function(val, key) {
            if(v['_id'] == val['item']){
              r.data['Items'][k]['likeIMG'] = "assets/heartlikes.png";
              return;
            }
          });
        });
        $scope.stars = imgStars;
        $scope.myItems = r.data['Items'];
      }, function myError(resp) {

    });

    $scope.follow = function(){
      var follow = {
        user: window.localStorage.getItem("userID"),
        follow: memberId
      };
      $http({
        method : "POST",
        data:follow,
        url : WEBROOT+"follow",
      }).then(function mySucces(r) {

        if($scope.status != "assets/FollowingMember.png"){
          $scope.status = "assets/FollowingMember.png";
          var ff = parseInt(window.localStorage.getItem("userFollowing")) + 1;
          $rootScope.followingUser = ff;
          window.localStorage.setItem("userFollowing", ff);
        }
        else{
          $scope.status = "assets/FollowMember.png";
          var ff = parseInt(window.localStorage.getItem("userFollowing")) - 1;
          $rootScope.followingUser = ff;
          window.localStorage.setItem("userFollowing", ff);
        }
      }, function myError(resp) {
      });
    }
    $scope.likeHeart = function(details){
      var likeData = {
        item: details['_id'],
        user: window.localStorage.getItem("userID"),
        owner: details['user']
      }
      functions.likeClick(likeData, details, $http);
    }

  })

  app.controller('contactmemberController', function($scope, $state, $ionicHistory,$http) {
    $scope.contact = {};
    $scope.contact['Username'] = window.localStorage.getItem('userUsername');
    $scope.myGoBack = function() {
      $ionicHistory.goBack();
    };
    var imgStars = "";
    var nameUser = "";
    var imgProfile = "";
    var imgBackground = "";

    $http({
      method : "GET",
      url : WEBROOT+"getUser/"+$state.params.id,
    }).then(function mySucces(r) {
      if(r.data['user']['image'] != ""){
        imgProfile = WEBROOT+"images/"+r.data['user']['image'];
        imgBackground = WEBROOT+"images/"+r.data['user']['image'];
        $scope.imageMProfile = WEBROOT+"images/"+r.data['user']['image'];
        $scope.imageMBackground = WEBROOT+"images/"+r.data['user']['image'];
      }
      else{
        imgProfile = "assets/avatar2.png";
        imgBackground = "assets/sinfiltrocopy.png";
        $scope.imageMBackground = "assets/sinfiltrocopy.png"
        $scope.imageMProfile = "assets/avatar2.png";
      }
      $scope.follower = r.data['follower'];
      $scope.following = r.data['following'];

      // nameUser = r.data['user']['firstname'] +" "+ r.data['user']['lastname'];
      $scope.name = r.data['user']['username'];
      for (var i = 0; i < 5; i++) {
        if(i <= r.data['user']['star'] && i != 0){
          imgStars += '<img src="assets/starFull.png" />';
        }
        else{
          imgStars += '<img src="assets/starEmpty.png" />';
        }
      }
      $scope.star = imgStars;
      },function myError(r) {
        });

    $scope.sendEmail = function(data){
      $http({
        method : "POST",
        data: data,
        url : WEBROOT+"sendEmail/"+$state.params.id+'/'+window.localStorage.getItem('userID'),
      }).then(function mySucces(r) {
          $state.go('appFive.contactsuccess',{name: nameUser,imP:imgProfile,imB:imgBackground});
        },function myError(r) {
          });
    }

  });

  app.controller('contactsuccessController', function($scope, $state, $ionicHistory){
    $scope.myGoBack = function() {
      $ionicHistory.goBack();
    };
    $scope.imP = $state.params.imP;
    $scope.imB = $state.params.imB;
    $scope.name = $state.params.name;
  })

  app.controller('forgotController', function($scope, $state, $ionicHistory, $http) {

    $scope.resetPass = function(data){
      $http({
        method : "GET",
        url : WEBROOT+"forgot/"+data,
      }).then(function mySucces(r) {
          $state.go('init');
        }, function myError(resp) {

      });
    }

  });

  app.controller('contactusController', function($scope, $state, $ionicHistory, $http){
    $scope.contact = {};
    $scope.contact['Username'] = window.localStorage.getItem('userUsername');
    $scope.sendEmail = function(data){
      $http({
        method : "POST",
        data: data,
        url : WEBROOT+"sendUsEmail/",
      }).then(function mySucces(r) {
          $state.go('appThree.myitem');
        },function myError(r) {
          });
    }
  })

  app.controller('followsController', function($rootScope, $scope, $ionicHistory, $state,$http) {
    $scope.followers = {};
    $scope.followings = {};
    // var r = {};
    // r.data = {"Following":[{"_id":"5772aac66d66ec026fb294f6","firstname":"Diogo1","email":"dietorreaba@gmail.com","username":"torr","password":"asdfghjk","__v":0,"brand10":"UNIQLO","brand9":"MAX MARA","brand8":"KATE SPADE","brand7":"GUESS","brand6":"ESPRIT","brand5":"BANANA REPUBLIC","brand4":"ANN TAYLOR","brand3":"AMERICAN APPAREL","brand2":"ALDO","brand1":"ADIDAS","swaps":1,"sales":0,"sizeThree3":"","sizeTwo3":"12","sizeOne3":"XS","sizeThreeID3":32,"sizeTwoID3":14,"sizeOneID3":2,"sizeThree2":"","sizeTwo2":"5","sizeOne2":"M","sizeThreeID2":31,"sizeTwoID2":16,"sizeOneID2":4,"sizeThree":"12","sizeTwo":"4.5","sizeOne":"S","sizeThreeID":30,"sizeTwoID":15,"sizeOneID":3,"star":0,"zip":"1080","city":"Buenos aires","secondAddress":"Hahaggs","firstAddress":"Gagaga","firstTime":"0","image":"ZZOiv8vNjr6GKIi5FLGxctcD.jpg","lastname":"Torrealba"}],"Followers":[]}
    $http({
      method : "GET",
      url : WEBROOT+"getFollow/"+window.localStorage.getItem("userID"),
    }).then(function mySucces(r) {
        for (var i = 0; i < r.data['Following'].length; i++) {
          r.data['Following'][i]['wineColorGail'] = "wineColorGail";
          r.data['Following'][i]['status'] = "Following";
          if(r.data['Following'][i]['image'] != ""){
            r.data['Following'][i]['image'] = WEBROOT+'images/'+r.data['Following'][i]['image'];
          }else{
            r.data['Following'][i]['image'] = "assets/avatar2.png";
          }
        }
        for (var i = 0; i < r.data['Followers'].length; i++) {
          r.data['Followers'][i]['wineColorGail'] = "";
          r.data['Followers'][i]['status'] = "+ Follow";

          if(r.data['Followers'][i]['image'] != ""){
            r.data['Followers'][i]['image'] = WEBROOT+'images/'+r.data['Followers'][i]['image'];
          }else{
            r.data['Followers'][i]['image'] = "assets/avatar2.png";
          }
          for (var x = 0; x < r.data['Following'].length; x++) {
            if(r.data['Followers'][i]['_id'] == r.data['Following'][x]['_id']){
              r.data['Followers'][i]['wineColorGail'] = "wineColorGail";
              r.data['Followers'][i]['status'] = "Following";
            }
          }
        }
        $scope.followers = r.data['Followers'];
        $scope.followings = [];
        $scope.followings = r.data['Following'];
      },function myError(r) {
        });

    $scope.follow = function(follow){
      var f = {
        user: window.localStorage.getItem("userID"),
        follow: follow._id
      };
      $scope.followings.push(follow);
      $http({
        method : "POST",
        data:f,
        url : WEBROOT+"follow",
      }).then(function mySucces(r) {
          if(follow['status'] == "Following"){
            var ff = parseInt(window.localStorage.getItem("userFollowing")) - 1;
            window.localStorage.setItem("userFollowing", ff);
            $rootScope.followingUser = ff;
            follow['wineColorGail'] = "";
            follow['status'] = "+ Follow";
          }
          else{
            var ff = parseInt(window.localStorage.getItem("userFollowing")) + 1;
            window.localStorage.setItem("userFollowing", ff);
            $rootScope.followingUser = ff;
            follow['wineColorGail'] = "wineColorGail";
            follow['status'] = "Following";
          }
        }, function myError(resp) {

      });
    }
  });

  app.controller('editItemController', function($scope, $ionicHistory, $state,$http,$cordovaFileTransfer, $cordovaImagePicker) {
    var sizes = ["",'XXS','XS','S','M','L','XL','XLL','0','2','4','6','8','10','12','14','16','18','20','4.5','5','5.5','6','6.5','7','7.5','8','8.5','9','9.5','10','10.5','11','11.5','12'];
    var opt = ['clothes','shoes', 'accessories', 'bags', 'jewelry'];

    $scope.img1 = "assets/plus.png";
    $scope.IsizE1 = "30%";
    $scope.tx1 = true;

    $scope.img2 = "assets/plus.png";
    $scope.IsizE2 = "30%";
    $scope.tx2 = true;

    $scope.img3 = "assets/plus.png";
    $scope.IsizE3 = "30%";
    $scope.tx3 = true;

    $scope.Item = [];
    $scope.caractOption = {};
    $scope.Ons = {};
    $scope.optActive = {};
    $scope.onlyJewelry = false;
    $scope.notJewelry = false;
    $scope.changeCategory = false;
    $scope.lastCategory = true;
    var pict1 = "";
    var pict2 = "";
    var pict3 = "";
    var priceSite;
    var priceYour;

    $scope.removeIma = function(number){
      if(number == 1){
        pict1 = "";
        $scope.img1 = "assets/plus.png";
        $scope.tx1 = true;
        $scope.dl1 = false;
        $scope.IsizE1 = "30%";
      }
      if(number == 2){
        pict2 = "";
        $scope.img2 = "assets/plus.png";
        $scope.tx2 = true;
        $scope.dl2 = false;
        $scope.IsizE2 = "30%";
      }
      if(number == 3){
        pict3 = "";
        $scope.img3 = "assets/plus.png";
        $scope.tx3 = true;
        $scope.dl3 = false;
        $scope.IsizE3 = "30%";
      }
    }

    $scope.addIma = function(number){
      var options = {
        maximumImagesCount: 1,
        width: 800,
        height: 800,
        quality: 80
       };

       $cordovaImagePicker.getPictures(options)
         .then(function (results) {
           var url = WEBROOT+"uploadPicImg/";
           var options = {
                fileKey: "file",
                chunkedMode: false,
                mimeType: "image/png"
            };

            $cordovaFileTransfer.upload(url, results[0], options).then(function (result) {
               var spl = result['response'].split("/");
               spl[2]= spl[2].replace('"', '');
               spl[2]= spl[2].replace('"', '');
               if(number != 1 && (number == 2 || number == 3) && pict1 == ""){
                 number = 1;
               }
               else if ( number != 2 && number == 3 && pict2 == "") {
                 number = 2;
               }
               if(number == 1){
                 pict1 = spl[2];
                 $scope.img1 = WEBROOT+'images/'+spl[2];
                 $scope.tx1 = false;
                 $scope.IsizE1 = "cover";
                 $scope.dl1 = true;
               }

               if(number == 2){
                 pict2 = spl[2];
                 $scope.img2 = WEBROOT+'images/'+spl[2];
                 $scope.tx2 = false;
                 $scope.IsizE2 = "cover";
                 $scope.dl2 = true;
               }

               if(number == 3){
                 pict3 = spl[2];
                 $scope.img3 = WEBROOT+'images/'+spl[2];
                 $scope.tx3 = false;
                 $scope.IsizE3 = "cover";
                 $scope.dl3 = true;
               }


            }, function (err) {
               console.log("ERROR: " + JSON.stringify(err));
            }, function (progress) {
                // PROGRESS HANDLING GOES HERE
            });

         }, function(error) {
           // error getting photos
         });
    }


    $scope.changeCat = function(){
      if($scope.changeCategory == true) {
        $scope.changeCategory = false;
        $scope.lastCategory = true;
      }
      else{
        $scope.changeCategory = true;
        $scope.lastCategory = false;
      }
    }

    for (var i = 0; i < opt.length; i++) {
      $scope.Ons[opt[i]] = false;
      $scope.optActive[opt[i]] = 'redColor';
    }

    for (var i = 0; i <= 34; i++) {
      $scope.caractOption[i] = "caractOption";
    }

    $scope.crt = function functionName(id) {
      $scope.Item['sizeID'] = id;
      $scope.Item['size'] = sizes[id];

      angular.forEach($scope.caractOption, function(v, k) {
        if(k == id){
          $scope.caractOption[k] = "caractOptionActive";
        }
        else{
          $scope.caractOption[k] = "caractOption";
        }
      });
    }

    $scope.clothesOpts = function(section){
      $scope.Item['type'] = section;
      if (section != 'clothes' && section != 'shoes'){
        $scope.Item['size'] = 0;
        $scope.Item['sizeID'] = 0;
      }
      // else{
      //   $scope.Item['size'] = "";
      // }
      if(section == 'jewelry'){
        $scope.notJewelry = false;
        $scope.onlyJewelry = true;
      }
      else{
        $scope.onlyJewelry = false;
        $scope.notJewelry = true;
      }

      for (var i = 0; i <= 30; i++) {
        $scope.caractOption[i] = "caractOption";
      }

      angular.forEach($scope.Ons, function(v, k) {
        if(k == section){
          $scope.Ons[k] = true;
          $scope.optActive[k] = "buttonShowActive";
        }
        else{
          $scope.Ons[k] = false;
          $scope.optActive[k] = "redColor";
        }
      });
    }

    $http({
      method : "GET",
      url : WEBROOT+"getBrands",
    }).then(function mySucces(r) {
        $scope.brands = r.data;
      },function myError(resp) {

        });

    $http({
      method : "GET",
      url : WEBROOT+"oneItem/"+$state.params.id,
    }).then(function mySucces(r) {

      if(r.data['img1'] != ""){
        pict1 = r.data['img1'];
        $scope.img1 = WEBROOT+'images/'+r.data['img1'];
        $scope.tx1 = false;
        $scope.IsizE1 = "cover";
      }

      if(r.data['img2'] != ""){
        pict2 = r.data['img2'];
        $scope.img2 = WEBROOT+'images/'+r.data['img2'];
        $scope.tx2 = false;
        $scope.IsizE2 = "cover";
      }

      if(r.data['img3'] != ""){
        pict3 = r.data['img3'];
        $scope.img3 = WEBROOT+'images/'+r.data['img3'];
        $scope.tx3 = false;
        $scope.IsizE3 = "cover";
      }
        $scope.Item = r.data;
        if(r.data['type'] == 'jewelry'){
          $scope.notJewelry = false;
          $scope.onlyJewelry = true;
        }
        else{
          $scope.onlyJewelry = false;
          $scope.notJewelry = true;
        }

        priceSite = r.data['pricesite'];
        priceYour = r.data['priceyour'];
      }, function myError(resp) {

    });

    $scope.add = function(data){
      if(angular.isUndefined(data.priceSite) || data.priceSite == ""){
        data.priceSite = priceSite;
      }

      if(angular.isUndefined(data.priceYour) || data.priceYour == ""){
        data.priceYour = priceYour;
      }
      else{
        var result = document.getElementById("priceYour");
        var wrappedResult = angular.element(result);
        var priceY=  wrappedResult.val();
        data.priceYour = priceY.replace('$', '');
      }

      var Item = {
        title: data.title,
        description: data.description,
        pricesite: data.priceSite,
        priceyour: data.priceYour,
        user: window.localStorage.getItem("userID"),
        brand: data.brand,
        type: data.type,
        size: data.size,
        sizeID: data.sizeID,
        condition: data.condition,
        material: data.material,
        color: data.color,
        img1: pict1,
        img2: pict2,
        img3: pict3
      }
      $http({
        method : "PUT",
        data: Item,
        url : WEBROOT+"editItem/"+$state.params.id,
      }).then(function mySucces(r) {
          if(r.data){
            $state.go('appTwo.profile');
          }
          else{
          }
        },function myError(resp) {

          });
    }

  });

  app.controller('mymatchesController', function($sce, $scope, $state, $ionicHistory,$http) {

    var matchs = {};
    var matchSaveds = {};
    var count = 0;
    var count2 = 0;

    var r = {};
    var r2 = {};
    $http({
      method : "GET",
      url : WEBROOT+"listMatchSaved/"+window.localStorage.getItem("userID"),
      }).then(function mySucces(r2) {
        $http({
          method : "GET",
          url : WEBROOT+"listMatchs/"+window.localStorage.getItem("userID"),
        }).then(function mySucces(r) {
          var data = r.data;
          var data2 = r2.data;

          var cd1 = [];
          var cd2 = {};
          var co2 = 0;

          angular.forEach(data['closedeals'], function(l, y) {
            if(l['type'] == 1){
              data['closedeals'][y]['img'] = WEBROOT+"images/"+data['closedeals'][y]['img'];
              cd1.push(l);
            }
            else{
              cd2[co2] = l;
              co2 += 1;
            }
          })

          angular.forEach(data['us'], function(la, ye) {
            data['us'][ye]['image'] = WEBROOT+"images/"+data['us'][ye]['image'];
          })
          $scope.usersR = data['us'];
          $scope.closeDeals = cd1;
          $scope.byRates = cd2;

          angular.forEach(data['myItems'], function(val, key) {
            var item = {};
            item = data['items'][val['item']];

            angular.forEach(data['yourItems'], function(v, k) {
              var pass = true;
              angular.forEach(data2['matchs'], function(va, ke) {
                if( va['status1'] == 2 && (val['item'] ==  va['itemA1'] || val['item'] ==  va['itemB1']) && (v['item'] ==  va['itemA1'] || v['item'] ==  va['itemB1'])){
                  pass = false;
                  return;
                }
              })
              if(angular.isDefined(item)){
                if(val['user'] == v['owner'] && pass){
                  var it = {};
                  it = data['items'][v['item']];
                  if(angular.isDefined(it)){
                    matchs[count] = {};
                    matchs[count]['my'] = {};
                    item['img'] = "";
                    if(item['img'] != WEBROOT+"images/"+item['img']){
                      item['img'] = WEBROOT+"images/"+item['img1'];
                    }
                    it['img'] = "";
                    if(it['img'] != WEBROOT+"images/"+it['img']){
                      it['img'] = WEBROOT+"images/"+it['img1'];
                    }
                    matchs[count]['your'] = it;
                    matchs[count]['my'] = item;
                    count += 1;
                  }
                }
              }
            })
          });

          angular.forEach(data2['matchs'], function(v, k) {
            if(v['status1'] < 1){
            matchSaveds[count2] = {};
            matchSaveds[count2]['id'] = v['_id'];
            if(v['userA'] == window.localStorage.getItem('userID')){
              if(v['itemA3'] && data2['items'][v['itemA3']]){
                var cont = '<div style="margin-right:5px; height: 70px;" class="itemFeed">'+
                    '<a href="#/app/youritem/'+data2['items'][v['itemA1']]['_id']+'" menu-close ><div class="itemIMGTwo" style="background-image:url('+WEBROOT+'images/'+data2['items'][v['itemA1']]['img1']+');"></div>'+
                    '<div class="itemDetailsThreeMatch redColor">'+
                      '<div class="pbrand">'+data2['items'][v['itemA1']]['brand']+'</div>'+
                      '<div class="pname">'+data2['items'][v['itemA1']]['title']+'</div>'+
                      '<p style="margin-top:-3px; font-size:12px !important;" class="pprice">$'+data2['items'][v['itemA1']]['pricesite']+'</p>'+
                    '</div>'+
                    '<div class="itemLikedThree redColor" style="background-image:url(assets/heartempty.png);">'+data2['items'][v['itemA1']]['likes']+'</div>'+
                  '</a></div>'+
                  '<div style="margin-right:5px; height: 70px; margin-top:5px;" class="itemFeed">'+
                    '<a href="#/app/youritem/'+data2['items'][v['itemA2']]['_id']+'" menu-close ><div class="itemIMGTwo" style="background-image:url('+WEBROOT+'images/'+data2['items'][v['itemA2']]['img1']+');"></div>'+
                    '<div class="itemDetailsThreeMatch redColor">'+
                      '<div class="pbrand">'+data2['items'][v['itemA2']]['brand']+'</div>'+
                      '<div class="pname">'+data2['items'][v['itemA2']]['title']+'</div>'+
                      '<p style="margin-top:-3px; font-size:12px !important;" class="pprice">$'+data2['items'][v['itemA2']]['pricesite']+'</p>'+
                    '</div>'+
                    '<div class="itemLikedThree redColor" style="background-image:url(assets/heartempty.png);">  '+data2['items'][v['itemA2']]['likes']+'  </div>'+
                  '</a></div>'+
                  '<div style="margin-right:5px; height: 70px; margin-top:5px;" class="itemFeed">'+
                    '<a href="#/app/youritem/'+data2['items'][v['itemA1']]['_id']+'" menu-close ><div class="itemIMGTwo" style="background-image:url('+WEBROOT+'images/'+data2['items'][v['itemA3']]['img1']+');"></div>'+
                    '<div class="itemDetailsThreeMatch redColor">'+
                      '<div class="pbrand">'+data2['items'][v['itemA3']]['brand']+'</div>'+
                      '<div class="pname">'+data2['items'][v['itemA3']]['title']+'</div>'+
                      '<p style="margin-top:-3px; font-size:12px !important;" class="pprice">$'+data2['items'][v['itemA3']]['pricesite']+'</p>'+
                    '</div>'+
                    '<div class="itemLikedThree redColor" style="background-image:url(assets/heartempty.png);">  '+data2['items'][v['itemA3']]['likes']+'  </div>'+
                  '</a></div>';
                var content2 = $sce.trustAsHtml(cont);
                matchSaveds[count2]['my'] = content2;
              }
              else if(v['itemA2'] && data2['items'][v['itemA2']]){
                var cont = '<div style="margin-right:5px; height: 105px;" class="itemFeed">'+
                    '<a href="#/app/youritem/'+data2['items'][v['itemA1']]['_id']+'" menu-close ><div class="itemIMGTwo" style="background-image:url('+WEBROOT+'images/'+data2['items'][v['itemA1']]['img1']+');"></div>'+
                    '<div class="itemDetailsTwo redColor">'+
                      '<div style="margin-top:7px !important;" class="pbrand">'+data2['items'][v['itemA1']]['brand']+'</div>'+
                      '<div style="margin-top:-3px !important;" class="pname">'+data2['items'][v['itemA1']]['title']+'</div>'+
                      '<p style="margin-top:-3px !important;font-size: 15px;" class="pprice">$'+data2['items'][v['itemA1']]['pricesite']+'</p>'+
                    '</div>'+
                    '<div class="itemLikedTwoMatch redColor" style="background-image:url(assets/heartempty.png);">'+data2['items'][v['itemA1']]['likes']+'</div>'+
                  '</a></div>'+
                  '<div style="margin-right:5px; height: 105px; margin-top:10px;" class="itemFeed">'+
                    '<a href="#/app/youritem/'+data2['items'][v['itemA2']]['_id']+'" menu-close ><div class="itemIMGTwo" style="background-image:url('+WEBROOT+'images/'+data2['items'][v['itemA2']]['img1']+');"></div>'+
                    '<div class="itemDetailsTwo redColor">'+
                      '<div style="margin-top:7px !important;" class="pbrand">'+data2['items'][v['itemA2']]['brand']+'</div>'+
                      '<div style="margin-top:-3px !important;" class="pname">'+data2['items'][v['itemA2']]['title']+'</div>'+
                      '<p style="margin-top:-3px !important;font-size: 15px;" class="pprice">$'+data2['items'][v['itemA2']]['pricesite']+'</p>'+
                    '</div>'+
                    '<div class="itemLikedTwoMatch redColor" style="background-image:url(assets/heartempty.png);">'+data2['items'][v['itemA2']]['likes']+'</div>'+
                  '</a></div>';
                var content2 = $sce.trustAsHtml(cont);
                matchSaveds[count2]['my'] = content2;
              }
              else if(v['itemA1'] && data2['items'][v['itemA1']]){
                if(data2['items'][v['itemA1']]['size'] == 0){
                  data2['items'][v['itemA1']]['size'] = " -";
                }
                var cont = '<a href="#/app/youritem/'+data2['items'][v['itemA1']]['_id']+'" menu-close ><div class="itemIMG" style="background-image:url('+WEBROOT+'images/'+data2['items'][v['itemA1']]['img1']+');"></div>'+
                '<hr style="width:10px; position:absolute; text-align:left; margin-left:7px; border: 0; border-top: 1px solid #BC0000;"/>'+
                  '<div class="itemDetails redColor">'+
                    '<div class="pbrand">'+data2['items'][v['itemA1']]['brand']+'</div>'+
                    '<div class="pname">'+data2['items'][v['itemA1']]['title']+'</div>'+
                    '<p class="psize">Size:'+data2['items'][v['itemA1']]['size']+'</p>'+
                    '<p class="pprice">$'+data2['items'][v['itemA1']]['pricesite']+'</p>'+
                  '</div>'+
                  '<div class="itemLiked redColor" style="background-image:url(assets/heartempty.png);">'+data2['items'][v['itemA1']]['likes']+'</div></a>';
                var content2 = $sce.trustAsHtml(cont);
                matchSaveds[count2]['my'] = content2;
              }

              if(v['itemB3'] && data2['items'][v['itemB3']]){
                var cont2 = '<div style="margin-right:5px; height: 70px;" class="itemFeed">'+
                    '<a href="#/app/youritem/'+data2['items'][v['itemB1']]['_id']+'" menu-close ><div class="itemIMGTwo" style="background-image:url('+WEBROOT+'images/'+data2['items'][v['itemB1']]['img1']+');"></div>'+
                    '<div class="itemDetailsThreeMatch redColor">'+
                      '<div class="pbrand">'+data2['items'][v['itemB1']]['brand']+'</div>'+
                      '<div class="pname">'+data2['items'][v['itemB1']]['title']+'</div>'+
                      '<p style="margin-top:-3px; font-size:12px !important;" class="pprice">$'+data2['items'][v['itemB1']]['pricesite']+'</p>'+
                    '</div>'+
                    '<div class="itemLikedThree redColor" style="background-image:url(assets/heartlikes.png);">'+data2['items'][v['itemB1']]['likes']+'</div>'+
                  '</a></div>'+
                  '<div style="margin-right:5px; height: 70px; margin-top:5px;" class="itemFeed">'+
                    '<a href="#/app/youritem/'+data2['items'][v['itemB2']]['_id']+'" menu-close ><div class="itemIMGTwo" style="background-image:url('+WEBROOT+'images/'+data2['items'][v['itemB2']]['img1']+');"></div>'+
                    '<div class="itemDetailsThreeMatch redColor">'+
                      '<div class="pbrand">'+data2['items'][v['itemB2']]['brand']+'</div>'+
                      '<div class="pname">'+data2['items'][v['itemB2']]['title']+'</div>'+
                      '<p style="margin-top:-3px; font-size:12px !important;" class="pprice">$'+data2['items'][v['itemB2']]['pricesite']+'</p>'+
                    '</div>'+
                    '<div class="itemLikedThree redColor" style="background-image:url(assets/heartlikes.png);">'+data2['items'][v['itemB2']]['likes']+'</div>'+
                  '</a></div>'+
                  '<div style="margin-right:5px; height: 70px; margin-top:5px;" class="itemFeed">'+
                    '<a href="#/app/youritem/'+data2['items'][v['itemB3']]['_id']+'" menu-close ><div class="itemIMGTwo" style="background-image:url('+WEBROOT+'images/'+data2['items'][v['itemB3']]['img1']+');"></div>'+
                    '<div class="itemDetailsThreeMatch redColor">'+
                      '<div class="pbrand">'+data2['items'][v['itemB3']]['brand']+'</div>'+
                      '<div class="pname">'+data2['items'][v['itemB3']]['title']+'</div>'+
                      '<p style="margin-top:-3px; font-size:12px !important;" class="pprice">$'+data2['items'][v['itemB3']]['pricesite']+'</p>'+
                    '</div>'+
                    '<div class="itemLikedThree redColor" style="background-image:url(assets/heartlikes.png);">'+data2['items'][v['itemB3']]['likes']+'</div>'+
                  '</a></div>';
                var content22 = $sce.trustAsHtml(cont2);
                matchSaveds[count2]['your'] = content22;
              }
              else if(v['itemB2'] && data2['items'][v['itemB2']]){
                var cont2 = '<div style="margin-right:5px; height: 105px;" class="itemFeed">'+
                    '<a href="#/app/youritem/'+data2['items'][v['itemB1']]['_id']+'" menu-close ><div class="itemIMGTwo" style="background-image:url('+WEBROOT+'images/'+data2['items'][v['itemB1']]['img1']+');"></div>'+
                    '<div class="itemDetailsTwo redColor">'+
                      '<div style="margin-top:7px !important;" class="pbrand">'+data2['items'][v['itemB1']]['brand']+'</div>'+
                      '<div style="margin-top:-3px !important;" class="pname">'+data2['items'][v['itemB1']]['title']+'</div>'+
                      '<p style="margin-top:-3px !important;font-size: 15px;" class="pprice">$'+data2['items'][v['itemB1']]['pricesite']+'</p>'+
                    '</div>'+
                  '</a></div>'+
                  '<div style="margin-right:5px; height: 105px; margin-top:10px;" class="itemFeed">'+
                    '<a href="#/app/youritem/'+data2['items'][v['itemB2']]['_id']+'" menu-close ><div class="itemIMGTwo" style="background-image:url('+WEBROOT+'images/'+data2['items'][v['itemB2']]['img1']+');"></div>'+
                    '<div class="itemDetailsTwo redColor">'+
                      '<div style="margin-top:7px !important;" class="pbrand">'+data2['items'][v['itemB2']]['brand']+'</div>'+
                      '<div style="margin-top:-3px !important;" class="pname">'+data2['items'][v['itemB2']]['title']+'</div>'+
                      '<p style="margin-top:-3px !important;font-size: 15px;" class="pprice">$'+data2['items'][v['itemB2']]['pricesite']+'</p>'+
                    '</div>'+
                  '</a></div>';
                var content22 = $sce.trustAsHtml(cont2);
                matchSaveds[count2]['your'] = content22;
              }
              else if(v['itemB1'] && data2['items'][v['itemB1']]){
                if(data2['items'][v['itemB1']]['size'] == 0){
                  data2['items'][v['itemB1']]['size'] = " -";
                }
                var cont2 = '<a href="#/app/youritem/'+data2['items'][v['itemB1']]['_id']+'" menu-close ><div class="itemIMG" style="background-image:url('+WEBROOT+'images/'+data2['items'][v['itemB1']]['img1']+');"></div>'+
                '<hr style="width:10px; position:absolute; text-align:left; margin-left:7px; border: 0; border-top: 1px solid #BC0000;"/>'+
                  '<div class="itemDetails redColor">'+
                    '<div class="pbrand">'+data2['items'][v['itemB1']]['brand']+'</div>'+
                    '<div class="pname">'+data2['items'][v['itemB1']]['title']+'</div>'+
                    '<p class="psize">Size:'+data2['items'][v['itemB1']]['size']+'</p>'+
                    '<p class="pprice">$'+data2['items'][v['itemB1']]['pricesite']+'</p>'+
                  '</div>'+
                  '<div class="itemLiked redColor" style="background-image:url(assets/heartlikes.png);">'+data2['items'][v['itemB1']]['likes']+'</div></a>';
                var content22 = $sce.trustAsHtml(cont2);
                matchSaveds[count2]['your'] = content22;
              }

            }
            else{
              if(v['itemA3'] && data2['items'][v['itemA3']]){
                var cont = '<div style="margin-right:5px; height: 70px;" class="itemFeed">'+
                    '<a href="#/app/youritem/'+data2['items'][v['itemA1']]['_id']+'" menu-close ><div class="itemIMGTwo" style="background-image:url('+WEBROOT+'images/'+data2['items'][v['itemA1']]['img1']+');"></div>'+
                    // '<hr style="width:10px; position:absolute; text-align:left; margin-left:7px; border: 0; border-top: 1px solid #BC0000;"/>'+
                    '<div class="itemDetailsThreeMatch redColor">'+
                      '<div class="pbrand">'+data2['items'][v['itemA1']]['brand']+'</div>'+
                      '<div class="pname">'+data2['items'][v['itemA1']]['title']+'</div>'+
                      '<p style="margin-top:-3px; font-size:12px !important;" class="pprice">$'+data2['items'][v['itemA1']]['pricesite']+'</p>'+
                    '</div>'+
                    '<div class="itemLikedThree redColor" style="background-image:url(assets/heartlikes.png);">'+data2['items'][v['itemA1']]['likes']+'</div>'+
                  '</a></div>'+
                  '<div style="margin-right:5px; height: 70px; margin-top:5px;" class="itemFeed">'+
                    '<a href="#/app/youritem/'+data2['items'][v['itemA2']]['_id']+'" menu-close ><div class="itemIMGTwo" style="background-image:url('+WEBROOT+'images/'+data2['items'][v['itemA2']]['img1']+');"></div>'+
                    // '<hr style="width:10px; position:absolute; text-align:left; margin-left:7px; border: 0; border-top: 1px solid #BC0000;"/>'+
                    '<div class="itemDetailsThreeMatch redColor">'+
                      '<div class="pbrand">'+data2['items'][v['itemA2']]['brand']+'</div>'+
                      '<div class="pname">'+data2['items'][v['itemA2']]['title']+'</div>'+
                      '<p style="margin-top:-3px; font-size:12px !important;" class="pprice">$'+data2['items'][v['itemA2']]['pricesite']+'</p>'+
                    '</div>'+
                    '<div class="itemLikedThree redColor" style="background-image:url(assets/heartlikes.png);">  '+data2['items'][v['itemA2']]['likes']+'  </div>'+
                  '</a></div>'+
                  '<div style="margin-right:5px; height: 70px; margin-top:5px;" class="itemFeed">'+
                    '<a href="#/app/youritem/'+data2['items'][v['itemA3']]['_id']+'" menu-close ><div class="itemIMGTwo" style="background-image:url(assets/jacket.png);"></div>'+
                    // '<hr style="width:10px; position:absolute; text-align:left; margin-left:7px; border: 0; border-top: 1px solid #BC0000;"/>'+
                    '<div class="itemDetailsThreeMatch redColor">'+
                      '<div class="pbrand">'+data2['items'][v['itemA3']]['brand']+'</div>'+
                      '<div class="pname">'+data2['items'][v['itemA3']]['title']+'</div>'+
                      '<p style="margin-top:-3px; font-size:12px !important;" class="pprice">$'+data2['items'][v['itemA3']]['pricesite']+'</p>'+
                    '</div>'+
                    '<div class="itemLikedThree redColor" style="background-image:url(assets/heartlikes.png);">  '+data2['items'][v['itemA3']]['likes']+'  </div>'+
                  '</a></div>';
                var content2 = $sce.trustAsHtml(cont);
                matchSaveds[count2]['your'] = content2;
              }
              else if(v['itemA2'] && data2['items'][v['itemA2']]){
                var cont = '<div style="margin-right:5px; height: 105px;" class="itemFeed">'+
                    '<a href="#/app/youritem/'+data2['items'][v['itemA1']]['_id']+'" menu-close ><div class="itemIMGTwo" style="background-image:url('+WEBROOT+'images/'+data2['items'][v['itemA1']]['img1']+');"></div>'+
                    '<div class="itemDetailsTwo redColor">'+
                      '<div style="margin-top:7px !important;" class="pbrand">'+data2['items'][v['itemA1']]['brand']+'</div>'+
                      '<div style="margin-top:-3px !important;" class="pname">'+data2['items'][v['itemA1']]['title']+'</div>'+
                      '<p style="margin-top:-3px !important;font-size: 15px;" class="pprice">$'+data2['items'][v['itemA1']]['pricesite']+'</p>'+
                    '</div>'+
                    '<div class="itemLikedTwoMatch redColor" style="background-image:url(assets/heartlikes.png);">'+data2['items'][v['itemA1']]['likes']+'</div>'+
                  '</a></div>'+
                  '<div style="margin-right:5px; height: 105px; margin-top:10px;" class="itemFeed">'+
                    '<a href="#/app/youritem/'+data2['items'][v['itemA2']]['_id']+'" menu-close ><div class="itemIMGTwo" style="background-image:url('+WEBROOT+'images/'+data2['items'][v['itemA2']]['img1']+');"></div>'+
                    '<div class="itemDetailsTwo redColor">'+
                      '<div style="margin-top:7px !important;" class="pbrand">'+data2['items'][v['itemA2']]['brand']+'</div>'+
                      '<div style="margin-top:-3px !important;" class="pname">'+data2['items'][v['itemA2']]['title']+'</div>'+
                      '<p style="margin-top:-3px !important;font-size: 15px;" class="pprice">$'+data2['items'][v['itemA2']]['pricesite']+'</p>'+
                    '</div>'+
                    '<div class="itemLikedTwoMatch redColor" style="background-image:url(assets/heartlikes.png);">'+data2['items'][v['itemA2']]['likes']+'</div>'+
                  '</a></div>';
                var content2 = $sce.trustAsHtml(cont);
                matchSaveds[count2]['your'] = content2;
              }
              else if(v['itemA1'] && data2['items'][v['itemA1']]){
                if(data2['items'][v['itemA1']]['size'] == 0){
                  data2['items'][v['itemA1']]['size'] = " -";
                }
                var cont = '<a href="#/app/youritem/'+data2['items'][v['itemA1']]['_id']+'" menu-close ><div class="itemIMG" style="background-image:url('+WEBROOT+'images/'+data2['items'][v['itemA1']]['img1']+');"></div>'+
                '<hr style="width:10px; position:absolute; text-align:left; margin-left:7px; border: 0; border-top: 1px solid #BC0000;"/>'+
                  '<div class="itemDetails redColor">'+
                    '<div class="pbrand">'+data2['items'][v['itemA1']]['brand']+'</div>'+
                    '<div class="pname">'+data2['items'][v['itemA1']]['title']+'</div>'+
                    '<p class="psize">Size:'+data2['items'][v['itemA1']]['size']+'</p>'+
                    '<p class="pprice">$'+data2['items'][v['itemA1']]['pricesite']+'</p>'+
                  '</div>'+
                  '<div class="itemLiked redColor" style="background-image:url(assets/heartlikes.png);">'+data2['items'][v['itemA1']]['likes']+'</div></a>';
                var content2 = $sce.trustAsHtml(cont);
                matchSaveds[count2]['your'] = content2;
              }

              if(v['itemB3'] && data2['items'][v['itemB3']]){
                var cont2 = '<div style="margin-right:5px; height: 70px;" class="itemFeed">'+
                    '<a href="#/app/youritem/'+data2['items'][v['itemB1']]['_id']+'" menu-close > <div class="itemIMGTwo" style="background-image:url('+WEBROOT+'images/'+data2['items'][v['itemB1']]['img1']+');"></div>'+
                    // '<hr style="width:10px; position:absolute; text-align:left; margin-left:7px; border: 0; border-top: 1px solid #BC0000;"/>'+
                    '<div class="itemDetailsThreeMatch redColor">'+
                      '<div class="pbrand">'+data2['items'][v['itemB1']]['brand']+'</div>'+
                      '<div class="pname">'+data2['items'][v['itemB1']]['title']+'</div>'+
                      '<p style="margin-top:-3px !important; font-size:12px !important;" class="pprice">$'+data2['items'][v['itemB1']]['pricesite']+'</p>'+
                    '</div>'+
                  '</a></div>'+
                  '<div style="margin-right:5px; height: 70px; margin-top:5px;" class="itemFeed">'+
                    '<a href="#/app/youritem/'+data2['items'][v['itemB2']]['_id']+'" menu-close > <div class="itemIMGTwo" style="background-image:url('+WEBROOT+'images/'+data2['items'][v['itemB2']]['img1']+');"></div>'+
                    // '<hr style="width:10px; position:absolute; text-align:left; margin-left:7px; border: 0; border-top: 1px solid #BC0000;"/>'+
                    '<div class="itemDetailsThreeMatch redColor">'+
                      '<div class="pbrand">'+data2['items'][v['itemB2']]['brand']+'</div>'+
                      '<div class="pname">'+data2['items'][v['itemB2']]['title']+'</div>'+
                      '<p style="margin-top:-3px !important; font-size:12px !important;" class="pprice">$'+data2['items'][v['itemB2']]['pricesite']+'</p>'+
                    '</div>'+
                  '</a></div>'+
                  '<div style="margin-right:5px; height: 70px; margin-top:5px;" class="itemFeed">'+
                    '<a href="#/app/youritem/'+data2['items'][v['itemB3']]['_id']+'" menu-close > <div class="itemIMGTwo" style="background-image:url('+WEBROOT+'images/'+data2['items'][v['itemB3']]['img1']+');"></div>'+
                    // '<hr style="width:10px; position:absolute; text-align:left; margin-left:7px; border: 0; border-top: 1px solid #BC0000;"/>'+
                    '<div class="itemDetailsThreeMatch redColor">'+
                      '<div class="pbrand">'+data2['items'][v['itemB3']]['brand']+'</div>'+
                      '<div class="pname">'+data2['items'][v['itemB3']]['title']+'</div>'+
                      '<p style="margin-top:-3px !important; font-size:12px !important;" class="pprice">$'+data2['items'][v['itemB3']]['pricesite']+'</p>'+
                    '</div>'+
                  '</a></div>';
                var content22 = $sce.trustAsHtml(cont2);
                matchSaveds[count2]['my'] = content22;
              }
              else if(v['itemB2'] && data2['items'][v['itemB2']]){
                var cont2 = '<div style="margin-right:5px; height: 105px;" class="itemFeed">'+
                    '<a href="#/app/youritem/'+data2['items'][v['itemB1']]['_id']+'" menu-close > <div class="itemIMGTwo" style="background-image:url('+WEBROOT+'images/'+data2['items'][v['itemB1']]['img1']+');"></div>'+
                    // '<hr style="width:10px; position:absolute; text-align:left; margin-left:7px; border: 0; border-top: 1px solid #BC0000;"/>'+
                    '<div class="itemDetailsTwo redColor">'+
                      '<div style="margin-top:7px !important;" class="pbrand">'+data2['items'][v['itemB1']]['brand']+'</div>'+
                      '<div style="margin-top:-3px !important;" class="pname">'+data2['items'][v['itemB1']]['title']+'</div>'+
                      '<p style="margin-top:-3px !important;font-size: 15px;" class="pprice">$'+data2['items'][v['itemB1']]['pricesite']+'</p>'+
                    '</div>'+
                    '<div class="itemLikedTwoMatch redColor" style="background-image:url(assets/heartempty.png);">'+data2['items'][v['itemB1']]['likes']+'</div>'+
                  '</a></div>'+
                  '<div style="margin-right:5px; height: 105px; margin-top:10px;" class="itemFeed">'+
                    '<a href="#/app/youritem/'+data2['items'][v['itemB2']]['_id']+'" menu-close > <div class="itemIMGTwo" style="background-image:url('+WEBROOT+'images/'+data2['items'][v['itemB2']]['img1']+');"></div>'+
                    // '<hr style="width:10px; position:absolute; text-align:left; margin-left:7px; border: 0; border-top: 1px solid #BC0000;"/>'+
                    '<div class="itemDetailsTwo redColor">'+
                      '<div style="margin-top:7px !important;" class="pbrand">'+data2['items'][v['itemB2']]['brand']+'</div>'+
                      '<div style="margin-top:-3px !important;" class="pname">'+data2['items'][v['itemB2']]['title']+'</div>'+
                      '<p style="margin-top:-3px !important;font-size: 15px;" class="pprice">$'+data2['items'][v['itemB2']]['pricesite']+'</p>'+
                    '</div>'+
                    '<div class="itemLikedTwoMatch redColor" style="background-image:url(assets/heartempty.png);">'+data2['items'][v['itemB2']]['likes']+'</div>'+
                  '</a></div>';
                var content22 = $sce.trustAsHtml(cont2);
                matchSaveds[count2]['my'] = content22;
              }
              else if(v['itemB1'] && data2['items'][v['itemB1']]){
                if(data2['items'][v['itemB1']]['size'] == 0){
                  data2['items'][v['itemB1']]['size'] = " -";
                }
                var cont2 = '<a href="#/app/youritem/'+data2['items'][v['itemB1']]['_id']+'" menu-close > <div class="itemIMG" style="background-image:url('+WEBROOT+'images/'+data2['items'][v['itemB1']]['img1']+');"></div>'+
                '<hr style="width:10px; position:absolute; text-align:left; margin-left:7px; border: 0; border-top: 1px solid #BC0000;"/>'+
                  '<div class="itemDetails redColor">'+
                    '<div class="pbrand">'+data2['items'][v['itemB1']]['brand']+'</div>'+
                    '<div class="pname">'+data2['items'][v['itemB1']]['title']+'</div>'+
                    '<p class="psize">Size:'+data2['items'][v['itemB1']]['size']+'</p>'+
                    '<p class="pprice">$'+data2['items'][v['itemB1']]['pricesite']+'</p>'+
                  '</div>'+
                  '<div class="itemLiked redColor" style="background-image:url(assets/heartempty.png);">'+data2['items'][v['itemB1']]['likes']+'</div></a>';
                var content22 = $sce.trustAsHtml(cont2);
                matchSaveds[count2]['my'] = content22;
              }
            }
            count2 += 1;
            }
          })
          $scope.matchSaveds = matchSaveds;
          $scope.matchs = matchs;

        });
    });

    $scope.msj = function(notify,index){

        $http({
          method : "GET",
          url : WEBROOT+"deleteClosedeals/"+notify._id,
        }).then(function mySucces(r) {
          $scope.closeDeals.splice($scope.closeDeals.indexOf(notify), 1);
          },function myError(r) {

            });
    }
  });

  app.controller('matchOldController', function($sce, $scope, $state, $ionicHistory, $http){
    // var data = {"matchs":[{"_id":"5730d8b24377dbf979f8d19d","userA":"572e4f283cfd4aa4529ee32b","userB":"572f86d0328ed6b75d353c4d","itemA1":"572e5d583cfd4aa4529ee32d","itemB1":"572f878a328ed6b75d353c4e","__v":0,"status1":1,"itemB3":"","itemB2":"572f883e328ed6b75d353c4f","itemA3":"572e5d583cfd4aa4529ee32d","itemA2":"572e5d583cfd4aa4529ee32d"}],"items":{"572e5d583cfd4aa4529ee32d":{"_id":"572e5d583cfd4aa4529ee32d","title":"TWO 2B","description":"Give Out you","user":"572e4f283cfd4aa4529ee32b","brand":"& OTHER STORIES","type":"clothes","size":"12","sizeID":14,"condition":"Fair condition","material":"Fur","color":"Blue","__v":0,"pricesite":34,"priceyour":12,"active":0,"likes":1},"572f878a328ed6b75d353c4e":{"_id":"572f878a328ed6b75d353c4e","title":"ONE 4D","description":"Txt","user":"572f86d0328ed6b75d353c4d","brand":"ASH","type":"clothes","size":"M","sizeID":4,"condition":"New with labels","material":"Sponge","color":"Navy","__v":0,"pricesite":12,"priceyour":12,"active":0,"likes":1},"572f883e328ed6b75d353c4f":{"_id":"572f883e328ed6b75d353c4f","title":"TWO","description":"Bien","pricesite":14,"priceyour":52,"user":"572f86d0328ed6b75d353c4d","brand":"3 SUISSES","type":"clothes","size":"L","sizeID":5,"condition":"Good condition","material":"Wool","color":"Burgundy","__v":0,"active":0,"likes":0}},"AllItems":[{"_id":"572f878a328ed6b75d353c4e","title":"ONE 4D","description":"Txt","user":"572f86d0328ed6b75d353c4d","brand":"ASH","type":"clothes","size":"M","sizeID":4,"condition":"New with labels","material":"Sponge","color":"Navy","__v":0,"pricesite":12,"priceyour":12,"active":0,"likes":1},{"_id":"572f883e328ed6b75d353c4f","title":"TWO","description":"Bien","pricesite":14,"priceyour":52,"user":"572f86d0328ed6b75d353c4d","brand":"3 SUISSES","type":"clothes","size":"L","sizeID":5,"condition":"Good condition","material":"Wool","color":"Burgundy","__v":0,"active":0,"likes":0},{"_id":"5730c88655dd68647483cafc","title":"Quien sabe","description":"Esta como nueva","pricesite":14,"priceyour":15,"user":"572f86d0328ed6b75d353c4d","brand":"1789 CALA","type":"clothes","size":"XL","sizeID":6,"condition":"Good condition","material":"Fur","color":"Navy","__v":0,"active":0,"likes":0}],"User":{"_id":"572f86d0328ed6b75d353c4d","firstname":"Diego","email":"diego@gmail.com","username":"D9","password":"12345678","__v":0,"brand10":"AGENT PROVOCATEUR","brand9":"ADIDAS","brand8":"AG JEANS","brand7":"ABERCROMBIE & FITCH","brand6":"7 FOR ALL MANKIND","brand5":"3 SUISSES","brand4":"1789 CALA","brand3":"1 ET 1 FONT 3","brand2":"& OTHER STORIES","brand1":"APC","sizeThree":"6","sizeTwo":"6","sizeOne":"M","swaps":0,"sales":0,"sizeThreeID":18,"sizeTwoID":11,"sizeOneID":4,"star":0,"zip":"0212","city":"Caracaw","secondAddress":"","firstAddress":"Santa fe","firstTime":"1","image":"","lastname":"Brito"}}
    $scope.my = {};
    $scope.my1 = {};
    $scope.my2 = {};
    $scope.your = {};
    $scope.extra1 = {};
    $scope.extra2 = {};
    $scope.my['_id'] = "";
    $scope.my1['_id'] = "";
    $scope.my2['_id'] = "";
    $scope.your['_id'] = "";
    $scope.extra1['_id'] = "";
    $scope.extra2['_id'] = "";
    $scope.buttonOptions = true;
    $scope.waiting = false;
    $scope.decline = false;
    $scope.oneOnly = true;
    $scope.threeItems = false;
    $scope.twoItems =  false;
    $scope.itemsAndProfile = false;
    $scope.addItems = "addItems";
    $scope.twoItemsEmpty = false;
    $scope.twoItemsfull = false;
    $scope.ItemsEmpty = false;
    $scope.twoItems1 = false;
    $scope.twoItemsfull1 = false;
    $scope.threeItems =  false;
    $scope.threeItemsEmpty = false;
    $scope.threeItemsfull = false;
    $scope.MyOnlyItems = false;
    $scope.MyTwoItems = false;
    $scope.MyTwoItemsfull = false;
    $scope.MyTwoItems1 = false;
    $scope.MyTwoItemsfull1 = false;
    $scope.MyThreeItemsfull = false;
    var retch = 0;
    var imgStars = "";
    var memberId;
    var anotherStatus;
    var imgTheItem;
    var memberNAME;
    $scope.addItemMatch = function(){
      if($scope.addItems == "addItems"){
        if($scope.twoItemsfull ==  true){
          $scope.sendMatch = "sendMatchDisabled";
          $scope.addItems = "addItemsDisabled";
          $scope.oneOnly = false;
          $scope.twoItems1 = true;
          $scope.twoItemsfull1 = true;
          $scope.twoItemsfull = false;
          $scope.twoItemsEmpty =  false;
          $scope.twoItems =  false;
          $scope.threeItemsEmpty = true;
          $scope.buttonOptions = false;
          $scope.itemsAndProfile = true;
        }
        else{
          $scope.sendMatch = "sendMatchDisabled";
          $scope.addItems = "addItemsDisabled";
          $scope.buttonOptions = false;
          $scope.itemsAndProfile = true;
          $scope.oneOnly = false;
          $scope.twoItemsEmpty =  true;
          $scope.twoItems =  true;
        }
      }
    }
    var data;
    $http({
      method : "GET",
      url : WEBROOT+"getAMatch/"+$state.params.id+"/"+window.localStorage.getItem('userID'),
    }).then(function mySucces(r) {
       data= r.data;
      memberId = data['User']['_id'];
      angular.forEach(data['AllItems'], function(val, key) {
        data['AllItems'][key]['img1'] = WEBROOT+'images/'+data['AllItems'][key]['img1'];
        data['AllItems'][key]['actuve'] = "";

        if(data['matchs'][0]['userA'] == window.localStorage.getItem('userID')){
          if(data['matchs'][0]['itemB1'] == data['AllItems'][key]['_id'] ){
            data['AllItems'][key]['actuve'] = "disabledItem";
          }
        }
        if(data['matchs'][0]['userB'] == window.localStorage.getItem('userID')){
          if(data['matchs'][0]['itemA1'] == data['AllItems'][key]['_id'] ){
            data['AllItems'][key]['actuve'] = "disabledItem";
          }
        }
      })

      angular.forEach(data['items'], function(v, k) {
        data['items'][k]['img1'] = WEBROOT+'images/'+data['items'][k]['img1'];
      })
      if(data['AllItems'].length == 1){
        $scope.addItems = "addItemsDisabled";
      }
      $scope.myItems = data['AllItems'];

      memberNAME = data['User']['firstname']+" "+data['User']['lastname'];
      $scope.memberName = memberNAME;

      if(r.data['User']['image'] != ""){
        $scope.memberImage = WEBROOT+'images/'+r.data['User']['image'];
      }else{
        $scope.memberImage = "assets/avatar2.png";
      }

      $scope.memberIdUser = memberId;

      if(data['matchs'][0]['userA'] == window.localStorage.getItem('userID')){
        imgTheItem = data['matchs'][0]['itemA1'];
        if(data['matchs'][0]['rematchA'] == 1){
          $scope.rematchUser = true;
        }
        anotherStatus = data['matchs'][0]['statusB'];
        if(data['matchs'][0]['itemA3']){
          $scope.oneOnly = false;
          $scope.sonTres = true;
          $scope.MyTwoItems1 = true;
          $scope.MyTwoItemsfull1 = true;
          $scope.MyThreeItemsfull = true;
          $scope.my = data['items'][ data['matchs'][0]['itemA1'] ];
          $scope.my1 = data['items'][ data['matchs'][0]['itemA2'] ];
          $scope.my2 = data['items'][ data['matchs'][0]['itemA3'] ];
        }
        else if(data['matchs'][0]['itemA2']){
          $scope.MyOnlyItems = false;
          $scope.sonTres = false;
          $scope.MyTwoItems = true;
          $scope.MyTwoItemsfull = true;
          $scope.sonDos = true;
          $scope.my = data['items'][ data['matchs'][0]['itemA1'] ];
          $scope.my1 = data['items'][ data['matchs'][0]['itemA2'] ];
        }
        else {
          $scope.MyOnlyItems = true;
          $scope.my = data['items'][ data['matchs'][0]['itemA1'] ];
        }

        if(data['matchs'][0]['itemB3']){
          $scope.addItems = "hidden";
          $scope.oneOnly = false;
          $scope.twoItems1 = true;
          $scope.twoItemsfull1 = true;
          $scope.threeItemsfull = true;
          $scope.your = data['items'][ data['matchs'][0]['itemB1'] ];
          $scope.extra1 = data['items'][ data['matchs'][0]['itemB2'] ];
          $scope.extra2 = data['items'][ data['matchs'][0]['itemB3'] ];
        }
        else if(data['matchs'][0]['itemB2']){
          $scope.oneOnly = false;
          $scope.twoItemsfull =  true;
          $scope.twoItems =  true;
          $scope.your = data['items'][ data['matchs'][0]['itemB1'] ];
          $scope.extra1 = data['items'][ data['matchs'][0]['itemB2'] ];
        }
        else {
          $scope.oneOnly = true;
          $scope.your = data['items'][ data['matchs'][0]['itemB1'] ];
        }

        if(data['matchs'][0]['statusA'] == 1){
          $scope.addItems = "hidden";
          $scope.buttonOptions = false;
          $scope.waiting = true;
          $scope.sendMatch = false;
        }
        else{
          $scope.buttonOptions = true;
        }

      }
      else{
        imgTheItem = data['matchs'][0]['itemB1'];
        if(data['matchs'][0]['rematchB'] == 1){
          $scope.rematchUser = true;
        }
        anotherStatus = data['matchs'][0]['statusA'];
        if(data['matchs'][0]['itemA3']){
          $scope.addItems = "hidden";
          $scope.oneOnly = false;
          $scope.twoItems1 = true;
          $scope.twoItemsfull1 = true;
          $scope.threeItemsfull = true;
          $scope.your = data['items'][ data['matchs'][0]['itemA1'] ];
          $scope.extra1 = data['items'][ data['matchs'][0]['itemA2'] ];
          $scope.extra2 = data['items'][ data['matchs'][0]['itemA3'] ];
        }
        else if(data['matchs'][0]['itemA2']){
          $scope.oneOnly = false;
          $scope.twoItemsfull =  true;
          $scope.twoItems =  true;
          $scope.your = data['items'][ data['matchs'][0]['itemA1'] ];
          $scope.extra1 = data['items'][ data['matchs'][0]['itemA2'] ];
        }
        else {
          $scope.oneOnly = true;
          $scope.your = data['items'][ data['matchs'][0]['itemA1'] ];
        }

        if(data['matchs'][0]['itemB3']){
          $scope.MyOnlyItems = false;
          $scope.sonTres = true;
          $scope.MyTwoItems1 = true;
          $scope.MyTwoItemsfull1 = true;
          $scope.MyThreeItemsfull = true;
          $scope.my = data['items'][ data['matchs'][0]['itemB1'] ];
          $scope.my1 = data['items'][ data['matchs'][0]['itemB2'] ];
          $scope.my2 = data['items'][ data['matchs'][0]['itemB3'] ];
        }
        else if(data['matchs'][0]['itemB2']){
          $scope.MyTwoItems = true;
          $scope.MyTwoItemsfull = true;
          $scope.sonDos = true;
          $scope.my = data['items'][ data['matchs'][0]['itemB1'] ];
          $scope.my1 = data['items'][ data['matchs'][0]['itemB2'] ];
        }
        else {
          $scope.MyOnlyItems = true;
          $scope.my = data['items'][ data['matchs'][0]['itemB1'] ];
        }


        if(data['matchs'][0]['statusB'] == 1){
          $scope.addItems = "hidden";
          $scope.buttonOptions = false;
          $scope.waiting = true;
          $scope.sendMatch = false;
        }
        else{
          $scope.buttonOptions = true;
        }

      }

      }, function myError(resp) {

    });

    $scope.deleteItem = function(item,number){
      if(number == 2){
        $scope.sendMatch = "sendMatchDisabled";
        $scope.addItems = "addItemsDisabled";
        $scope.buttonOptions = false;
        $scope.itemsAndProfile = true;
        $scope.oneOnly = false;
        $scope.twoItemsEmpty =  true;
        $scope.twoItems =  true;
        $scope.twoItemsfull = false;
        item['actuve'] = "";
        return(itemToAdd);
      }
      if(number == 3){
        $scope.sendMatch = "sendMatchDisabled";
        $scope.addItems = "addItemsDisabled";
        $scope.oneOnly = false;
        $scope.twoItems1 = true;
        $scope.twoItemsfull1 = true;
        $scope.twoItemsfull = false;
        $scope.twoItemsEmpty =  false;
        $scope.twoItems =  false;
        $scope.threeItemsEmpty = true;
        $scope.threeItemsfull = false;
        item['actuve'] = "";
        return(itemToAdd);
      }
    }


    $scope.addNewItem = function(itemToAdd, index){
      if(itemToAdd['actuve'] != "disabledItem"){
        if($scope.twoItemsEmpty){
          $scope.twoItemsEmpty = false;
          $scope.twoItemsfull = true;
          $scope.extra1 = itemToAdd;
          $scope.addItems = "addItems";
          $scope.sendMatch = "sendMatch";
          itemToAdd['actuve'] = "disabledItem";
          itemToAdd['thisview'] = true;
          return(itemToAdd);
        }
        if($scope.threeItemsEmpty){
          $scope.sendMatch = "sendMatch";
          $scope.threeItemsEmpty = false;
          $scope.threeItemsfull = true;
          $scope.extra2 = itemToAdd;
          $scope.addItems = "addItemsDisabled";
          itemToAdd['actuve'] = "disabledItem";
          itemToAdd['thisview'] = true;
          return(itemToAdd);
        }
        if($scope.ItemsEmpty){
          $scope.sendMatch = "sendMatch";
          $scope.ItemsEmpty = false;
          $scope.oneOnly = true;
          $scope.your = itemToAdd;
          itemToAdd['actuve'] = "disabledItem";
          return(itemToAdd);
        }
      }
    }

    $scope.approve = function(){
      $scope.addItems = "hidden";
      $scope.buttonOptions = false;
      $scope.waiting = true;
      if(window.localStorage.getItem("userID") == memberId){
        var data = {
          itemA1: $scope.my['_id'],
          itemA2: $scope.my1['_id'],
          itemA3: $scope.my2['_id'],
          itemB1: $scope.your['_id'],
          itemB2: $scope.extra1['_id'],
          itemB3: $scope.extra2['_id'],
          statusB: anotherStatus,
          statusA: 1
        }
      }
      else{
        var data = {
          itemB1: $scope.my['_id'],
          itemB2: $scope.my1['_id'],
          itemB3: $scope.my2['_id'],
          itemA1: $scope.your['_id'],
          itemA2: $scope.extra1['_id'],
          itemA3: $scope.extra2['_id'],
          statusB: 1,
          statusA: anotherStatus
        }
      }

      $http({
        method : "PUT",
        data : data,
        url : WEBROOT+"updateMatch/"+$state.params.id,
      }).then(function mySucces(r) {
        if( (data['statusB'] == 1) && (data['statusA'] == 1) ){
          $scope.buttonOptions = false;
          $scope.sendMatch = "hidden";
          $scope.addItems = "hidden";
          $scope.successMatch = true;
          $scope.waiting = false;
          var dataCD = {
                  user: window.localStorage.getItem('userID'),
                  member: memberId,
                  action: "swapped",
                  size: 30,
                  icon: "assets/matchRed.png",
                  img: imgTheItem,
                  name: memberNAME,
                  type: 1
                };

          $http({
            method : "POST",
            data : dataCD,
            url : WEBROOT+"saveClosedeals/",
          }).then(function mySucces(r2) {

          }, function myError(resp) {

          });

        }
        else{
          $scope.sendMatch = "hidden";
          $scope.addItems = "hidden";
          $scope.buttonOptions = false;
          $scope.waiting = true;
        }

        }, function myError(resp) {

      });

    }

    $scope.declined = function(){
      $http({
        method : "PUT",
        url : WEBROOT+"declineMatch/"+$state.params.id,
      }).then(function mySucces(r) {
          $scope.addItems = "hidden";
          $scope.buttonOptions = false;
          $scope.decline = true;
        }, function myError(resp) {

      });
    }

    $scope.rematch = function(){
      // $scope.addItems = "hidden";
      angular.forEach(data['AllItems'], function(val, key) {
        data['AllItems'][key]['actuve'] = "";
      })
      $scope.ItemsEmpty = true;
      $scope.oneOnly = false;
      $scope.buttonOptions = false;
      $scope.itemsAndProfile = true;
      retch = 1;
    }

    $scope.sendMatchToServer = function(){

      if(!$scope.threeItemsEmpty && !$scope.twoItemsEmpty){
        if(angular.isUndefined($scope.my1['_id'])){
          $scope.my1['_id'] = "";
        }
        if(angular.isUndefined($scope.my2['_id'])){
          $scope.my2['_id'] = "";
        }
        if(angular.isUndefined($scope.extra1['_id'])){
          $scope.extra1['_id'] = "";
        }
        if(angular.isUndefined($scope.extra2['_id'])){
          $scope.extra2['_id'] = "";
        }
        if(window.localStorage.getItem("userID") == memberId){
          var data = {
            itemA1: $scope.my['_id'],
            itemA2: $scope.my1['_id'],
            itemA3: $scope.my2['_id'],
            itemB1: $scope.your['_id'],
            itemB2: $scope.extra1['_id'],
            itemB3: $scope.extra2['_id'],
            statusB: 0,
            statusA: 1
          }
          if(retch == 1){
            data['rematchA'] = 1;
          }
        }
        else{
          var data = {
            itemB1: $scope.my['_id'],
            itemB2: $scope.my1['_id'],
            itemB3: $scope.my2['_id'],
            itemA1: $scope.your['_id'],
            itemA2: $scope.extra1['_id'],
            itemA3: $scope.extra2['_id'],
            statusB: 1,
            statusA: 0
          }
          if(retch == 1){
            data['rematchB'] = 1;
          }
        }
        $http({
          method : "PUT",
          data : data,
          url : WEBROOT+"updateMatch/"+$state.params.id,
        }).then(function mySucces(r) {
            $scope.sendMatch = "hidden";
            $scope.itemsAndProfile = false;
            $scope.addItems = "hidden";
            $scope.buttonOptions = false;
            $scope.waiting = true;
          }, function myError(resp) {

        });
      }
    }


  })

  app.controller('newmatchController', function($scope, $ionicHistory, $state,$http) {
    $scope.my = {};
    $scope.my1 = {};
    $scope.my2 = {};
    $scope.your = {};
    $scope.extra1 = {};
    $scope.extra2 = {};

    $scope.my['_id'] = "";
    $scope.my1['_id'] = "";
    $scope.my2['_id'] = "";
    $scope.your['_id'] = "";
    $scope.extra1['_id'] = "";
    $scope.extra2['_id'] = "";

    $scope.buttonOptions = true;
    $scope.waiting = false;
    $scope.decline = false;
    $scope.oneOnly = true;
    $scope.threeItems = false;
    $scope.twoItems =  false;
    $scope.itemsAndProfile = false;
    $scope.addItems = "addItems";
    $scope.twoItemsEmpty = false;
    $scope.twoItemsfull = false;
    $scope.ItemsEmpty = false;
    $scope.twoItems1 = false;
    $scope.twoItemsfull1 = false;

    $scope.threeItems =  false;
    $scope.threeItemsEmpty = false;
    $scope.threeItemsfull = false;
    var myIte;
    var yourIte;
    var imgStars = "";
    var memberId;
    $scope.addItemMatch = function(){
      if($scope.addItems == "addItems"){
        if($scope.twoItemsfull ==  true){
          $scope.sendMatch = "sendMatchDisabled";
          $scope.addItems = "addItemsDisabled";
          $scope.oneOnly = false;
          $scope.twoItems1 = true;
          $scope.twoItemsfull1 = true;
          $scope.twoItemsfull = false;
          $scope.twoItemsEmpty =  false;
          $scope.twoItems =  false;
          $scope.threeItemsEmpty = true;
        }
        else{
          $scope.sendMatch = "sendMatchDisabled";
          $scope.addItems = "addItemsDisabled";
          $scope.buttonOptions = false;
          $scope.itemsAndProfile = true;
          $scope.oneOnly = false;
          $scope.twoItemsEmpty =  true;
          $scope.twoItems =  true;
        }
      }
    }
    var data;
    $http({
      method : "GET",
      url : WEBROOT+"newMatch/"+$state.params.my+"/"+$state.params.your,
    }).then(function mySucces(r) {
      memberId = r.data['User']['_id'];
      myIte = r.data['my']['_id'];
      yourIte = r.data['your']['_id'];

      r.data['my']['img1'] = WEBROOT+'images/'+r.data['my']['img1'];
      r.data['your']['img1'] = WEBROOT+'images/'+r.data['your']['img1'];

      $scope.my = r.data['my'];
      $scope.your = r.data['your'];
      data = r.data['Items'];
      angular.forEach(r.data['Items'], function(val, key) {
        r.data['Items'][key]['img1'] = WEBROOT+'images/'+r.data['Items'][key]['img1'];
        r.data['Items'][key]['actuve'] = "";
        if(r.data['Items'][key]['_id'] == r.data['your']['_id']){
          r.data['Items'][key]['actuve'] = "disabledItem";
        }
      })
      if(r.data['Items'].length == 1){
        $scope.addItems = "addItemsDisabled";
      }
      $scope.myItems = r.data['Items'];
      $scope.memberName = r.data['User']['firstname'] +" "+ r.data['User']['lastname'];
      if(r.data['User']['image'] != ""){
        $scope.memberImage = WEBROOT+'images/'+r.data['User']['image'];
      }else{
        $scope.memberImage = "assets/avatar2.png";
      }

      $scope.memberIdUser = memberId;

      for (var i = 0; i < 5; i++) {
        if(i <= r.data['User']['star'] && i != 0){
          imgStars += '<img src="assets/starFull.png" />';
        }
        else{
          imgStars += '<img src="assets/starEmpty.png" />';
        }
      }
      $scope.stars = imgStars;
      }, function myError(resp) {

    });

    $scope.deleteItem = function(item,number){
      if(number == 2){
        $scope.sendMatch = "sendMatchDisabled";
        $scope.addItems = "addItemsDisabled";
        $scope.buttonOptions = false;
        $scope.itemsAndProfile = true;
        $scope.oneOnly = false;
        $scope.twoItemsEmpty =  true;
        $scope.twoItems =  true;
        $scope.twoItemsfull = false;
        item['actuve'] = "";
        return(itemToAdd);
      }
      if(number == 3){
        $scope.sendMatch = "sendMatchDisabled";
        $scope.addItems = "addItemsDisabled";
        $scope.oneOnly = false;
        $scope.twoItems1 = true;
        $scope.twoItemsfull1 = true;
        $scope.twoItemsfull = false;
        $scope.twoItemsEmpty =  false;
        $scope.twoItems =  false;
        $scope.threeItemsEmpty = true;
        $scope.threeItemsfull = false;
        item['actuve'] = "";
        return(itemToAdd);
      }
    }

    $scope.addNewItem = function(itemToAdd, index){
      if(itemToAdd['actuve'] != "disabledItem"){
        if($scope.twoItemsEmpty){
          $scope.twoItemsEmpty = false;
          $scope.twoItemsfull = true;
          $scope.extra1 = itemToAdd;
          $scope.addItems = "addItems";
          $scope.sendMatch = "sendMatch";
          itemToAdd['actuve'] = "disabledItem";
          if(data.length == 2){
            $scope.addItems = "addItemsDisabled";
          }
          return(itemToAdd);
        }
        if($scope.threeItemsEmpty){
          $scope.sendMatch = "sendMatch";
          $scope.threeItemsEmpty = false;
          $scope.threeItemsfull = true;
          $scope.extra2 = itemToAdd;
          $scope.addItems = "addItemsDisabled";
          itemToAdd['actuve'] = "disabledItem";
          return(itemToAdd);
        }
        if($scope.ItemsEmpty){
          $scope.sendMatch = "sendMatch";
          $scope.ItemsEmpty = false;
          $scope.oneOnly = true;
          $scope.your = itemToAdd;
          itemToAdd['actuve'] = "disabledItem";
          return(itemToAdd);
        }
      }
    }

    $scope.approve = function(){
      $scope.addItems = "hidden";
      $scope.buttonOptions = false;
      $scope.waiting = true;
      var data = {
        userA: window.localStorage.getItem('userID'),
        userB: memberId,
        itemA1: $scope.my['_id'],
        itemB1: $scope.your['_id'],
        statusA: 1
      }
      $http({
        method : "POST",
        data : data,
        url : WEBROOT+"saveMatch",
      }).then(function mySucces(r) {
        $scope.sendMatch = "hidden";
        $scope.addItems = "hidden";
        $scope.buttonOptions = false;
        $scope.waiting = true;
        }, function myError(resp) {

      });

    }

    $scope.declined = function(){
      var data = {
        userA:window.localStorage.getItem('userID'),
        userB:memberId,
        itemA1:myIte,
        itemB1:yourIte,
        status1: 2
      };
      $http({
        method : "POST",
        data : data,
        url : WEBROOT+"saveMatch",
      }).then(function mySucces(r) {
        $scope.sendMatch = "hidden";
        $scope.addItems = "hidden";
        $scope.buttonOptions = false;
        $scope.decline = true;
        }, function myError(resp) {

      });
    }

    $scope.rematch = function(){
      angular.forEach(data['Items'], function(val, key) {
        data['Items'][key]['actuve'] = "";
      })
      // $scope.addItems = "hidden";
      $scope.ItemsEmpty = true;
      $scope.oneOnly = false;
      $scope.buttonOptions = false;
      $scope.itemsAndProfile = true;
    }

    $scope.sendMatchToServer = function(){

      if(!$scope.threeItemsEmpty && !$scope.twoItemsEmpty){
        if(angular.isUndefined($scope.my1['_id'])){
          $scope.my1['_id'] = "";
        }
        if(angular.isUndefined($scope.my2['_id'])){
          $scope.my2['_id'] = "";
        }
        if(angular.isUndefined($scope.extra1['_id'])){
          $scope.extra1['_id'] = "";
        }
        if(angular.isUndefined($scope.extra2['_id'])){
          $scope.extra2['_id'] = "";
        }
        var data = {
          userA: window.localStorage.getItem('userID'),
          userB: memberId,
          itemA1: $scope.my['_id'],
          itemA2: $scope.my1['_id'],
          itemA3: $scope.my2['_id'],
          itemB1: $scope.your['_id'],
          itemB2: $scope.extra1['_id'],
          itemB3: $scope.extra2['_id'],
          statusA: 1
        }
        $http({
          method : "POST",
          data : data,
          url : WEBROOT+"saveMatch",
        }).then(function mySucces(r) {

            $scope.sendMatch = "hidden";
            $scope.itemsAndProfile = false;
            $scope.addItems = "hidden";
            $scope.buttonOptions = false;
            $scope.waiting = true;
          }, function myError(resp) {

        });
      }
    }

  });

  app.controller('searchController', function($scope, $ionicHistory, $state,$http, $timeout, functions) {
    var sizes = ["",'XXS','XS','S','M','L','XL','XLL','0','2','4','6','8','10','12','14','16','18','20','4.5','5','5.5','6','6.5','7','7.5','8','8.5','9','9.5','10','10.5','11','11.5','12'];
    var opt = ['clothes','shoes', 'accessories', 'bags', 'jewelry'];
    $scope.modal = true;

    $scope.formSearch = true;
    $scope.sliderResult = false;
    $scope.Search = {};
    $scope.caractOption = {};
    $scope.Ons = {};
    $scope.optActive = {};
    $scope.onlyJewelry = false;
    $scope.notJewelry = false;
    $scope.title = "Search";
    for (var i = 0; i < opt.length; i++) {
      $scope.Ons[opt[i]] = false;
      $scope.optActive[opt[i]] = 'redColor';
    }

    for (var i = 0; i <= 34; i++) {
      $scope.caractOption[i] = "caractOption";
    }

    $scope.crt = function functionName(id) {
      if($scope.caractOption[id] == "caractOptionActive"){

        if($scope.Search['size'] == sizes[id]){
          $scope.Search['size'] = "";
          $scope.caractOption[id] = "caractOption";
        }
        else if($scope.Search['size2'] == sizes[id]){
          $scope.Search['size2'] = "";
          $scope.caractOption[id] = "caractOption";
        }
        else if($scope.Search['size3'] == sizes[id]){
          $scope.Search['size3'] = "";
          $scope.caractOption[id] = "caractOption";
        }
      }
      else{
        if(angular.isUndefined($scope.Search['size']) || $scope.Search['size'] == ""){
          $scope.Search['size'] = sizes[id];
          $scope.caractOption[id] = "caractOptionActive";
        }
        else if(angular.isUndefined($scope.Search['size2']) || $scope.Search['size2'] == ""){
          $scope.Search['size2'] = sizes[id];
          $scope.caractOption[id] = "caractOptionActive";
        }
        else if(angular.isUndefined($scope.Search['size3']) || $scope.Search['size3'] == ""){
          $scope.Search['size3'] = sizes[id];
          $scope.caractOption[id] = "caractOptionActive";
        }
      }
      // $scope.Search['size'] = sizes[id];
      //
      // angular.forEach($scope.caractOption, function(v, k) {
      //   if(k == id){
      //     $scope.caractOption[k] = "caractOptionActive";
      //   }
      //   else{
      //     $scope.caractOption[k] = "caractOption";
      //   }
      // });
    }

    $scope.clothesOpts = function(section){
      $scope.Search['type'] = section;
      if (section != 'clothes' && section != 'shoes'){
        $scope.Search['size'] = 0;
      }
      else{
        $scope.Search['size'] = "";
        $scope.Search['size2'] = "";
        $scope.Search['size3'] = "";
      }
      if(section == 'jewelry'){
        $scope.notJewelry = false;
        $scope.onlyJewelry = true;
      }
      else{
        $scope.onlyJewelry = false;
        $scope.notJewelry = true;
      }

      for (var i = 0; i <= 30; i++) {
        $scope.caractOption[i] = "caractOption";
      }

      angular.forEach($scope.Ons, function(v, k) {
        if(k == section){

          if($scope.optActive[k] != "buttonShowActive"){
            $scope.optActive[k] = "buttonShowActive";
            $scope.Ons[k] = true;
          }
          else{
            for (var i = 0; i <= 34; i++) {
              $scope.caractOption[i] = "caractOption";
            }
            $scope.optActive[k] = "redColor";
            $scope.Ons[k] = false;
          }
        }
        else{
          $timeout(function() {
            $scope.Ons[k] = false;
            $scope.optActive[k] = "redColor";
          }, 100);

        }
      });
    }

    $scope.goToSideMenu = function(goToState) {
        $state.go(goToState);
    };

    $scope.closeModal = function(){
      $scope.modal = true;
      // $scope.withoutScroll = '';
    }

    $http({
      method : "GET",
      url : WEBROOT+"getBrands",
    }).then(function mySucces(r) {
        $scope.brands = r.data;
      },function myError(resp) {

        });

    $scope.find = function(dat){
      $http({
        method : "POST",
        data: dat,
        url : WEBROOT+"search/"+window.localStorage.getItem('userID'),
      }).then(function mySucces(r) {
        // var r = {};
        // r.data = { "items":[{ "likes": 4,"loveActive": 1,"skip": 7,"active": 1,"__v": 0,"img3": 'RUzYHAVsFbxjQiNSXybEgbps.jpg',"img2": '4LyER_bGOWydpPhk0re_cpPo.jpg',"img1": 'zlbttxmuyLzu-5n2h6AwXpkP.jpg',"color": 'Black',"material": 'Cotton',"condition": 'Great condition',"sizeID": 4,"size": 'M',"type": 'clothes',"brand": 'MANGO',"user": "574f3ed9836e991a7b37ee0a","priceyour": 32,"pricesite": 40,"description": 'Great Mango top',"title": 'Dots funny top',"_id": "574f422c836e991a7b37ee0c" },{ "likes": 4,"loveActive": 1,"skip": 7,"active": 1,"__v": 0,"img3": '',"img2": 'ySysPBUqFH3PY37vN_0m7L8V.jpg',"img1": 'YAzsn3CrppL1kkgkdMCLT3C4.jpg',"color": 'Multicolour',"material": 'Cotton',"condition": 'Great condition',"sizeID": 4,"size": 'M',"type": 'clothes',"brand": 'ZARA',"user": "574f3ed9836e991a7b37ee0a","priceyour": 24,"pricesite": 30,"description": 'Boho dress. Perfect for Summer.',"title": 'Bohemian dress',"_id": "574f4309836e991a7b37ee0d" },{ "likes": 3,"loveActive": 1,"skip": 4,"active": 1,"__v": 0,"img3": '',"img2": 'KxOKVAE3H7ezt9HCrYbP5USf.jpg',"img1": 'oHm3w4MxGRpMq-Yb7mS3cgyt.jpg',"color": 'Grey',"material": 'Cotton',"condition": 'Good condition',"sizeID": 4,"size": 'M',"type": 'clothes',"brand": 'REEBOOK',"user": "574f44e8836e991a7b37ee0e","priceyour": 16,"pricesite": 20,"description": 'Lot of 2 tshirts',"title": 'Lot of 2 Reebook tshirts',"_id": "574f4639836e991a7b37ee0f" },{ "likes": 4,"loveActive": 1,"skip": 7,"active": 1,"__v": 0,"img3": 'NkwThYVJjAgzn5fTal4E4mT-.jpg',"img2": 'XsdXPjZLpVAlEdjKUhc2mpsC.jpg',"img1": 'OiTs0hn5OwRH6u7YCvof0b4P.jpg',"color": 'Purple',"material": 'Cotton',"condition": 'New with labels',"sizeID": 4,"size": 'M',"type": 'clothes',"brand": 'MODCLOTH',"user": "574f44e8836e991a7b37ee0e","priceyour": 24,"pricesite": 30,"description": 'Lovely dress',"title": 'Mod cloth lovely dress',"_id": "574f4748836e991a7b37ee11" },{ "likes": 1,"loveActive": 1,"skip": 0,"active": 1,"__v": 0,"img3": '',"img2": '',"img1": 'CsIRYAaDH-e-IUP2phog6Tdo.jpg',"color": 'Brown',"material": 'Denim - Jeans ',"condition": 'Great condition',"sizeID": 4,"size": 'M',"type": 'clothes',"brand": 'ADIDAS',"user": "57604972a4ee8b557a362b16","priceyour": null,"pricesite": 100,"description": 'Chaqueta',"title": 'Chaqueta',"_id": "57717f046c3e11754f8eec9b" } ],"likes": [ { "__v": 0,"owner": "574f3ed9836e991a7b37ee0a","user": "57604972a4ee8b557a362b16","item": "574f422c836e991a7b37ee0c","_id": "57717d7c6c3e11754f8eec8c" },{ "__v": 0,"owner": "574f3ed9836e991a7b37ee0a","user": "57604972a4ee8b557a362b16","item": "574f4309836e991a7b37ee0d","_id": "57717d7e6c3e11754f8eec8e" },{ "__v": 0,"owner": "574f44e8836e991a7b37ee0e","user": "57604972a4ee8b557a362b16","item": "574f4639836e991a7b37ee0f","_id": "57717d7f6c3e11754f8eec90" },{ "__v": 0,"owner": "574f44e8836e991a7b37ee0e","user": "57604972a4ee8b557a362b16","item": "574f4748836e991a7b37ee11","_id": "57717d826c3e11754f8eec94" } ] };
        if(r.data['items'].length > 0 ){
          ct = 0;
          var res = {};
          $scope.formSearch = false;
          $scope.sliderResult = true;

          angular.forEach(r.data['items'], function(v, k) {
            if( r.data['items'][k]['user'] != window.localStorage.getItem('userID') ){
              r.data['items'][k]['img1'] = WEBROOT+'images/'+r.data['items'][k]['img1'];
              r.data['items'][k]['likeIMG'] = "assets/heartempty.png";
              angular.forEach(r.data['likes'], function(val, key) {
                if(val['item'] == v['_id']){
                  r.data['items'][k]['likeIMG'] = "assets/heartlikes.png";
                  r.data['items'][k]['buttonLiked'] = "disabled";
                }
              })
              res[ct] = r.data['items'][k];
              ct += 1;
            }
          })
          $scope.title = "SEARCH RESULTS";
          $scope.foos = res;
          $scope.totalSearch = ct;

        }
        else{
          $scope.Ons['clothes'] = false;
          $scope.Ons['shoes'] = false;
          $scope.modal = false;
        }
      },function myError(resp) {
      });
    }

    $scope.likeHeart = function(feed){
      var likeData = {
        item: feed['_id'],
        user: window.localStorage.getItem("userID"),
        owner: feed['user']
      }
      feed['buttonLiked'] = "disabled";
      functions.likeClick(likeData,feed,$http);
    }

    // $scope.foos = new Array(40);
    $scope.clicked = function(index) {
    }

      $scope.$on('ngRepeatFinished', function () {
        var mySwiper = new Swiper('.swiper-container',{
            //Your options here:
            mode:'horizontal',
            loop: false,
            keyboardControl: true,
            mousewheelControl: true,
            slidesPerView: 1.25,
            centeredSlides: true,
            nextButton: '.swiper-button-next, .resultButtonNext',
            prevButton: '.swiper-button-prev',
            onSlideClick: function (swiper) {
              angular.element(swiper.clickedSlide).scope().clicked(angular.element(swiper.clickedSlide).scope().$index)
            },
            onSlideNextEnd: function (swiper) {
              // $scope.nextIndex = swiper.previousIndex;
            }
        });
      });

  });

  app.controller('resultsearchController', function($scope, $ionicHistory, $state,$http) {
    $scope.goToSideMenu = function(goToState) {
        $state.go(goToState);
    };

    $scope.foos = new Array(40);
    $scope.clicked = function(index) {
    }

    $scope.$on('ngRepeatFinished', function () {
      var mySwiper = new Swiper('.swiper-container',{
          //Your options here:
          mode:'horizontal',
          loop: false,
          keyboardControl: true,
          mousewheelControl: true,
          slidesPerView: 1.25,
          centeredSlides: true,
          nextButton: '.swiper-button-next, .resultButtonNext',
          prevButton: '.swiper-button-prev',
          onSlideClick: function (swiper) {
            angular.element(swiper.clickedSlide).scope().clicked(angular.element(swiper.clickedSlide).scope().$index)
          },
          onSlideNextEnd: function (swiper) {
            // $scope.nextIndex = swiper.previousIndex;
          }
      });
    });

  });

  app.controller('notificationsController', function($scope, $ionicHistory, $state, $http) {

    // var r = {};
    // r.data = {"notifi":[{"_id":"5772d2db6d66ec026fb29559","user":"5772d1f46d66ec026fb2952e","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"57727954da6f2cb6648026ea","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"5772d2da6d66ec026fb29555","user":"5772d1f46d66ec026fb2952e","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"57727954da6f2cb6648026ea","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"5772d2da6d66ec026fb29551","user":"5772d1f46d66ec026fb2952e","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"57727954da6f2cb6648026ea","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"5772d2d96d66ec026fb2954d","user":"5772d1f46d66ec026fb2952e","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"57727954da6f2cb6648026ea","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"5772d2d86d66ec026fb29549","user":"5772d1f46d66ec026fb2952e","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"57727933da6f2cb6648026e9","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"5772d2d66d66ec026fb29545","user":"5772d1f46d66ec026fb2952e","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"57727954da6f2cb6648026ea","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"5772d2d56d66ec026fb29543","user":"5772d1f46d66ec026fb2952e","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"57727933da6f2cb6648026e9","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"5772d2cf6d66ec026fb29541","user":"5772d1f46d66ec026fb2952e","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"5772797ada6f2cb6648026eb","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"5772cb106d66ec026fb29520","user":"5772aac66d66ec026fb294f6","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"57727933da6f2cb6648026e9","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"5772c7a56d66ec026fb2951b","user":"5772aac66d66ec026fb294f6","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"57727933da6f2cb6648026e9","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"5772c7976d66ec026fb29517","user":"5772aac66d66ec026fb294f6","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"57727933da6f2cb6648026e9","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"5772c75d6d66ec026fb29513","user":"5772aac66d66ec026fb294f6","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"57727954da6f2cb6648026ea","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"5772c75a6d66ec026fb29511","user":"5772aac66d66ec026fb294f6","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"57727933da6f2cb6648026e9","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"5772c4d36d66ec026fb2950b","user":"5772aac66d66ec026fb294f6","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"5772797ada6f2cb6648026eb","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"5772c4cf6d66ec026fb29509","user":"5772aac66d66ec026fb294f6","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"57727933da6f2cb6648026e9","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"5772c4c96d66ec026fb29507","user":"5772aac66d66ec026fb294f6","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"57727954da6f2cb6648026ea","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"5772c4636d66ec026fb29504","user":"5772aac66d66ec026fb294f6","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"57727933da6f2cb6648026e9","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"5772c45b6d66ec026fb29500","user":"5772aac66d66ec026fb294f6","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"5772797ada6f2cb6648026eb","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"5772c4576d66ec026fb294fd","user":"5772aac66d66ec026fb294f6","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"57727933da6f2cb6648026e9","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"5772c4536d66ec026fb294fa","user":"5772aac66d66ec026fb294f6","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"57727933da6f2cb6648026e9","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"5772c4516d66ec026fb294f8","user":"5772aac66d66ec026fb294f6","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"57727954da6f2cb6648026ea","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"57727f0b0b1d415b65035415","user":"575ee206859f8d51685db1f0","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"57727933da6f2cb6648026e9","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"57727df20b1d415b65035413","user":"575ee206859f8d51685db1f0","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"57727954da6f2cb6648026ea","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"5772d34acfad083d751734da","user":"5772d1f46d66ec026fb2952e","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"5772797ada6f2cb6648026eb","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"5772d34ecfad083d751734dd","user":"5772d1f46d66ec026fb2952e","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"57727933da6f2cb6648026e9","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"5772d3910d38c65575a5291c","user":"5772d1f46d66ec026fb2952e","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"57727933da6f2cb6648026e9","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"5772d39d0d38c65575a5291f","user":"5772d1f46d66ec026fb2952e","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"57727954da6f2cb6648026ea","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"5772d4150d38c65575a52925","user":"5772d1f46d66ec026fb2952e","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"57727954da6f2cb6648026ea","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"5772d8460d38c65575a5292d","user":"5772d1f46d66ec026fb2952e","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"57727954da6f2cb6648026ea","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"5772d8a833f169ed759fb1f4","user":"5772d1f46d66ec026fb2952e","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"57727933da6f2cb6648026e9","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"5772d8b333f169ed759fb1f9","user":"5772d1f46d66ec026fb2952e","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"5772797ada6f2cb6648026eb","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"5772d92033f169ed759fb200","user":"5772d1f46d66ec026fb2952e","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"57727933da6f2cb6648026e9","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"5772da1e33f169ed759fb20a","user":"5772d1f46d66ec026fb2952e","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"57727933da6f2cb6648026e9","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"5772da2833f169ed759fb210","user":"5772d1f46d66ec026fb2952e","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"5772797ada6f2cb6648026eb","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"5772da3a33f169ed759fb213","user":"5772d1f46d66ec026fb2952e","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"57727933da6f2cb6648026e9","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"5772da5e33f169ed759fb216","user":"5772d1f46d66ec026fb2952e","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"57727933da6f2cb6648026e9","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"5772da6c33f169ed759fb21a","user":"5772d1f46d66ec026fb2952e","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"57727954da6f2cb6648026ea","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"5772da9633f169ed759fb21c","user":"5772d1f46d66ec026fb2952e","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"57727933da6f2cb6648026e9","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"5772daa033f169ed759fb21e","user":"5772d1f46d66ec026fb2952e","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"5772797ada6f2cb6648026eb","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"5772dad633f169ed759fb223","user":"5772d1f46d66ec026fb2952e","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"57727933da6f2cb6648026e9","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"5772dd6333f169ed759fb234","user":"5772d1f46d66ec026fb2952e","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"57727933da6f2cb6648026e9","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"5772de6533f169ed759fb238","user":"5772d1f46d66ec026fb2952e","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"57727933da6f2cb6648026e9","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"5772de6933f169ed759fb23a","user":"5772d1f46d66ec026fb2952e","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"57727954da6f2cb6648026ea","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"5773d5362532877a1bd01933","user":"5773d36b2532877a1bd01931","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"57727933da6f2cb6648026e9","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"5773d5ae2532877a1bd01936","user":"5773d36b2532877a1bd01931","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"57727933da6f2cb6648026e9","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"5773d657d04d43e71b378de0","user":"5773d36b2532877a1bd01931","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"57727933da6f2cb6648026e9","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"5773d65fd04d43e71b378de2","user":"5773d36b2532877a1bd01931","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"57727954da6f2cb6648026ea","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"5773d662d04d43e71b378de4","user":"5773d36b2532877a1bd01931","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"5772797ada6f2cb6648026eb","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"5773d66dd04d43e71b378deb","user":"5773d36b2532877a1bd01931","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"57727954da6f2cb6648026ea","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"5773d67cd04d43e71b378def","user":"5773d36b2532877a1bd01931","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"57727954da6f2cb6648026ea","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"5773d687d04d43e71b378df3","user":"5773d36b2532877a1bd01931","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"57727933da6f2cb6648026e9","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"5773d689d04d43e71b378df7","user":"5773d36b2532877a1bd01931","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"5772797ada6f2cb6648026eb","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"5773f82fd51a45081fe5b77b","user":"5773d36b2532877a1bd01931","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"57727954da6f2cb6648026ea","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"57740b88d51a45081fe5b791","user":"5772d1f46d66ec026fb2952e","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"57727933da6f2cb6648026e9","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"57759e3f1b3ff1373a21ef5d","user":"5749c422836e991a7b37ee01","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"57727933da6f2cb6648026e9","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"57759e401b3ff1373a21ef5f","user":"5749c422836e991a7b37ee01","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"57727954da6f2cb6648026ea","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"57759e401b3ff1373a21ef61","user":"5749c422836e991a7b37ee01","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"5772797ada6f2cb6648026eb","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"5775a3171b3ff1373a21efa4","user":"5772d1f46d66ec026fb2952e","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"57727954da6f2cb6648026ea","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"5775a3291b3ff1373a21efa8","user":"5772d1f46d66ec026fb2952e","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"57727954da6f2cb6648026ea","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"577d94b220b840796054bc42","user":"5749c422836e991a7b37ee01","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"57727933da6f2cb6648026e9","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"577d94b720b840796054bc44","user":"5749c422836e991a7b37ee01","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"57727954da6f2cb6648026ea","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"577dc860749509c16506d3c3","user":"5749c422836e991a7b37ee01","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"5772797ada6f2cb6648026eb","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"577ef2e9bd5fb3dd7632ceef","user":"5772aac66d66ec026fb294f6","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"5772797ada6f2cb6648026eb","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"577ef30abd5fb3dd7632cef4","user":"5772aac66d66ec026fb294f6","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"577da1bbbc1db02162acc9ae","__v":0,"view":1,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"577ef43bbd5fb3dd7632cef9","user":"5772aac66d66ec026fb294f6","member":"57604972a4ee8b557a362b16","action":"approved the match with your","size":30,"item":"57727933da6f2cb6648026e9","__v":0,"view":0,"news":0,"icon":"assets/acceptMatch.png"},{"_id":"577ef5dbbd5fb3dd7632cefc","user":"5772aac66d66ec026fb294f6","member":"57604972a4ee8b557a362b16","action":"approved the match with your","size":30,"item":"57727933da6f2cb6648026e9","__v":0,"view":1,"news":0,"icon":"assets/acceptMatch.png"},{"_id":"57852d01dc2e70c56ffdfadb","user":"574f3ed9836e991a7b37ee0a","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"57727954da6f2cb6648026ea","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"57854e78dc2e70c56ffdfb17","user":"574f44e8836e991a7b37ee0e","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"57727954da6f2cb6648026ea","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"57854e79dc2e70c56ffdfb19","user":"574f44e8836e991a7b37ee0e","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"5772797ada6f2cb6648026eb","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"5786c308dc2e70c56ffdfb37","user":"574f44e8836e991a7b37ee0e","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"57727954da6f2cb6648026ea","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"5787bf4d63c427bb0be80c0a","user":"5749c422836e991a7b37ee01","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"57727954da6f2cb6648026ea","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"},{"_id":"5787c25963c427bb0be80c2b","user":"5749c422836e991a7b37ee01","member":"57604972a4ee8b557a362b16","action":"likes your","size":30,"item":"577da1bbbc1db02162acc9ae","__v":0,"view":0,"news":0,"icon":"assets/lovinmeRed.png"}],"member":{"5749c422836e991a7b37ee01":{"_id":"5749c422836e991a7b37ee01","firstname":"Marian","email":"marian@bepurpledash.com","username":"Marian","password":"12345678","__v":0,"brand10":"","brand9":"","brand8":"","brand7":"","brand6":"","brand5":"","brand4":"","brand3":"","brand2":"","brand1":"","swaps":1,"sales":0,"sizeThree3":"","sizeTwo3":"","sizeOne3":"","sizeThreeID3":0,"sizeTwoID3":0,"sizeOneID3":0,"sizeThree2":"","sizeTwo2":"","sizeOne2":"","sizeThreeID2":0,"sizeTwoID2":0,"sizeOneID2":0,"sizeThree":"10","sizeTwo":"4.5","sizeOne":"XS","sizeThreeID":26,"sizeTwoID":15,"sizeOneID":2,"star":0,"zip":"1178","city":"Buenos Aires","secondAddress":"","firstAddress":"3 de febrero 256","firstTime":"0","image":"Vvtv7kwzMFqVz5j97eWkr7Tq.jpg","lastname":"Sidero"},"574f3ed9836e991a7b37ee0a":{"_id":"574f3ed9836e991a7b37ee0a","firstname":"Clem","email":"clem@gailandjudy.com","username":"Clem","password":"Daphne2006","__v":0,"brand10":"","brand9":"","brand8":"ANNA SUI","brand7":"3.1 Phillip Lim","brand6":"3 SUISSES","brand5":"2CHILLIES","brand4":"10 CROSBY BY DL","brand3":"1 2 3","brand2":"1 ET 1 FONT 3","brand1":"& OTHER STORIES","swaps":2,"sales":0,"sizeThree3":"","sizeTwo3":"","sizeOne3":"S","sizeThreeID3":0,"sizeTwoID3":null,"sizeOneID3":3,"sizeThree2":"","sizeTwo2":"8","sizeOne2":"XL","sizeThreeID2":0,"sizeTwoID2":12,"sizeOneID2":6,"sizeThree":"9.5","sizeTwo":"6","sizeOne":"M","sizeThreeID":25,"sizeTwoID":11,"sizeOneID":4,"star":0,"zip":"10538","city":"Latchmont","secondAddress":"","firstAddress":"71 beechtree drive","firstTime":"0","image":"x18QijIvW2Ee9H1fDvba2CKF.jpg","lastname":"Normand"},"574f44e8836e991a7b37ee0e":{"_id":"574f44e8836e991a7b37ee0e","firstname":"Marie","email":"clementine_2904@yahoo.com","username":"Marie","password":"Scoubidou2904","__v":0,"brand10":"ANN TAYLOR","brand9":"ADELINE CACHEUX","brand8":"7FOR ALL MANKIND","brand7":"3.1 Phillip Lim","brand6":"3 SUISSES","brand5":"2CHILLIES","brand4":"1789 CALA","brand3":"1 2 3","brand2":"1 ET 1 FONT 3","brand1":"& OTHER STORIES","swaps":2,"sales":0,"sizeThree3":"","sizeTwo3":"","sizeOne3":"","sizeThreeID3":0,"sizeTwoID3":0,"sizeOneID3":0,"sizeThree2":"","sizeTwo2":"","sizeOne2":"","sizeThreeID2":0,"sizeTwoID2":0,"sizeOneID2":0,"sizeThree":"7","sizeTwo":"8","sizeOne":"XL","sizeThreeID":20,"sizeTwoID":12,"sizeOneID":6,"star":0,"zip":"83500","city":"Toulon","secondAddress":"","firstAddress":"29 rue Vincent Allegre","firstTime":"0","image":"0FktqlBqJYDChmRYvtQk8I4y.jpg","lastname":"Deniel"},"575ee206859f8d51685db1f0":{"_id":"575ee206859f8d51685db1f0","firstname":"Ruth","email":"ruth.mendez16@gmail.com","username":"Ruth","password":"12345678","__v":0,"brand10":"ANN TAYLOR","brand9":"GAP","brand8":"NINE WEST","brand7":"MAX MARA","brand6":"KATE SPADE","brand5":"ESPRIT","brand4":"BANANA REPUBLIC","brand3":"AMERICAN APPAREL","brand2":"ZARA","brand1":"RALPH LAUREN","swaps":0,"sales":0,"sizeThree3":"","sizeTwo3":"","sizeOne3":"","sizeThreeID3":0,"sizeTwoID3":0,"sizeOneID3":0,"sizeThree2":"","sizeTwo2":"","sizeOne2":"","sizeThreeID2":0,"sizeTwoID2":0,"sizeOneID2":0,"sizeThree":"9.5","sizeTwo":"8","sizeOne":"M","sizeThreeID":25,"sizeTwoID":12,"sizeOneID":4,"star":0,"zip":"1204","city":"Carrizal","secondAddress":"","firstAddress":"Venezuela","firstTime":"0","image":"U0mUl6KQwCQPo5IJEAwYsCbB.jpg","lastname":"Mendez"},"5772aac66d66ec026fb294f6":{"_id":"5772aac66d66ec026fb294f6","firstname":"Diogo1","email":"dietorreaba@gmail.com","username":"torr","password":"asdfghjk","__v":0,"brand10":"UNIQLO","brand9":"MAX MARA","brand8":"KATE SPADE","brand7":"GUESS","brand6":"ESPRIT","brand5":"BANANA REPUBLIC","brand4":"ANN TAYLOR","brand3":"AMERICAN APPAREL","brand2":"ALDO","brand1":"ADIDAS","swaps":3,"sales":0,"sizeThree3":"","sizeTwo3":"12","sizeOne3":"XS","sizeThreeID3":32,"sizeTwoID3":14,"sizeOneID3":2,"sizeThree2":"","sizeTwo2":"5","sizeOne2":"M","sizeThreeID2":31,"sizeTwoID2":16,"sizeOneID2":4,"sizeThree":"12","sizeTwo":"4.5","sizeOne":"S","sizeThreeID":30,"sizeTwoID":15,"sizeOneID":3,"star":3.75,"zip":"1080","city":"Buenos aires","secondAddress":"Hahaggs","firstAddress":"Gagaga","firstTime":"0","image":"ZZOiv8vNjr6GKIi5FLGxctcD.jpg","lastname":"Torrealba"},"5772d1f46d66ec026fb2952e":{"_id":"5772d1f46d66ec026fb2952e","firstname":"Diego Torrealba","email":"dietorrealbax@hotmail.com","__v":0,"brand10":"DSQUARED2","brand9":"ASOS","brand8":"NINE WEST","brand7":"LEVI'S","brand6":"GUESS","brand5":"GAP","brand4":"ESPRIT","brand3":"CLUB MONACO","brand2":"ANN TAYLOR","brand1":"ADIDAS","swaps":1,"sales":0,"sizeThree3":"","sizeTwo3":"","sizeOne3":"","sizeThreeID3":31,"sizeTwoID3":0,"sizeOneID3":0,"sizeThree2":"10.5","sizeTwo2":"","sizeOne2":"","sizeThreeID2":27,"sizeTwoID2":0,"sizeOneID2":0,"sizeThree":"8.5","sizeTwo":"8","sizeOne":"M","sizeThreeID":23,"sizeTwoID":12,"sizeOneID":4,"star":0,"zip":"Ms1111","city":"Bzbbdbd","secondAddress":"Bbbbbbbbbs","firstAddress":"Aaa","firstTime":"0","image":"jyzrZkFHzIW0Jq0W3tL-wPwM.jpg","lastname":"Hahhahaha"},"5773d36b2532877a1bd01931":{"_id":"5773d36b2532877a1bd01931","firstname":"Cesar","email":"cesar.herguetal@gmail.com","username":"cahl92","password":"12345678","__v":0,"brand10":"TOPSHOP","brand9":"KATE SPADE","brand8":"GAP","brand7":"DIESEL","brand6":"ANN TAYLOR","brand5":"BANANA REPUBLIC","brand4":"BALLY","brand3":"AMERICAN APPAREL","brand2":"ALDO","brand1":"ADIDAS","swaps":0,"sales":0,"sizeThree3":"8.5","sizeTwo3":"10","sizeOne3":"XL","sizeThreeID3":23,"sizeTwoID3":13,"sizeOneID3":6,"sizeThree2":"7.5","sizeTwo2":"6","sizeOne2":"XS","sizeThreeID2":21,"sizeTwoID2":11,"sizeOneID2":2,"sizeThree":"6.5","sizeTwo":"2","sizeOne":"M","sizeThreeID":19,"sizeTwoID":9,"sizeOneID":4,"star":0,"zip":"0212","city":"Caraacs","secondAddress":"Caracas","firstAddress":"Caracas","firstTime":"0","image":"","lastname":"Leon"}},"items":{"57727933da6f2cb6648026e9":{"_id":"57727933da6f2cb6648026e9","title":"Mono","description":"Mono","pricesite":100,"priceyour":null,"user":"57604972a4ee8b557a362b16","brand":"ADIDAS","type":"clothes","size":"M","sizeID":4,"condition":"New with labels","material":"Cotton  ","color":"Black","img1":"M_E4YdIM3BNfhi4RHiagVTvT.jpg","img2":"","img3":"","__v":0,"active":1,"skip":0,"loveActive":1,"likes":3},"57727954da6f2cb6648026ea":{"_id":"57727954da6f2cb6648026ea","title":"Chaqueta","description":"Chaqueta","pricesite":100,"priceyour":null,"user":"57604972a4ee8b557a362b16","brand":"ADIDAS","type":"clothes","size":"0","sizeID":8,"condition":"New with labels","material":"Fake fur","color":"Blue","img1":"jNdKIuSehh8nL-PEgsnEIxQI.jpg","img2":"","img3":"","__v":0,"active":1,"skip":4,"loveActive":0,"likes":6},"5772797ada6f2cb6648026eb":{"_id":"5772797ada6f2cb6648026eb","title":"Zapato","description":"Zapato","pricesite":120,"priceyour":96,"user":"57604972a4ee8b557a362b16","brand":"ADIDAS","type":"shoes","size":"6.5","sizeID":23,"condition":"New with labels","material":"Denim - Jeans ","color":"Blue","img1":"fCKom9eqi-vznbWh6Q849OvZ.jpg","img2":"","img3":"","__v":0,"active":1,"skip":0,"loveActive":1,"likes":2},"577da1bbbc1db02162acc9ae":{"_id":"577da1bbbc1db02162acc9ae","title":"A car","description":"Newone","pricesite":1200,"priceyour":null,"user":"57604972a4ee8b557a362b16","brand":"APC","type":"accessories","size":"0","sizeID":0,"condition":"Great condition","material":"OTHER","color":"Silver","img1":"NdcnKNWTKMNuW9VHmIUQPs9V.jpg","img2":"","img3":"","__v":0,"active":1,"skip":0,"loveActive":1,"likes":1}}}

    $http({
      method : "GET",
      url : WEBROOT+"getMyNotifications/"+ window.localStorage.getItem("userID"),
    }).then(function mySucces(r) {
          angular.forEach(r.data['notifi'], function(v, k) {
            r.data['notifi'][k]['old'] = '';
            if( r.data['notifi'][k]['view'] == 1){
               r.data['notifi'][k]['old'] = 'old';
            }
          })
          $scope.notifications = r.data['notifi'];

          $scope.users = r.data['member'];
          angular.forEach(r.data['items'], function(v, k) {
            r.data['items'][k]['img1'] = WEBROOT+'images/'+r.data['items'][k]['img1'];
          })
          $scope.items = r.data['items'];
        }, function myError(resp) {
      });

      $scope.validate = function(id, icon){
        $http({
          method : "GET",
          url : WEBROOT+"viewNotification/"+id,
        }).then(function mySucces(r) {
            if(icon =="assets/addedItemRed.png" || icon == "assets/declinedMatch.png" || icon == "assets/acceptMatch.png"){
              $state.go('app.mymatches');
            }
            if(icon == "assets/lovinmeRed.png"){
              $state.go('app.loveme');
            }

            }, function myError(resp) {
          });
      }

      $scope.goToSideMenu = function(goToState) {
          $state.go(goToState);
      };
  });

  app.directive('capitalizeFirst', function($parse) {
     return {
       require: 'ngModel',
       link: function(scope, element, attrs, modelCtrl) {
         element.bind('keyup', function(event) {
           element.val( element.val().toLowerCase() );
         });
       }
     };
  });

  app.directive('capitalizeAll', function($parse) {
     return {
       require: 'ngModel',
       link: function(scope, element, attrs, modelCtrl) {
         element.bind('keyup', function(event) {
           element.val( element.val().toLowerCase() );
         });
       }
     };
  });

  app.directive('format', ['$filter', function ($filter) {
    return {
      require: '?ngModel',
      link: function (scope, elem, attrs, ctrl) {
        if (!ctrl) return;
        ctrl.$formatters.unshift(function (a) {
          return $filter(attrs.format)(ctrl.$modelValue)
        });
        elem.bind('click', function(event) {
          elem.val(" ");
        });
        elem.bind('keyup', function(event) {
          if(event.keyCode == 13){
            var pfy =  ( 20*elem.val() ) / 100;
            pfy = elem.val() - pfy;
            elem.val($filter(attrs.format)(elem.val()));
            var result = document.getElementById("priceYour");
            var wrappedResult = angular.element(result);
            wrappedResult.val($filter(attrs.format)(pfy))
          }
          var plainNumber = elem.val().replace(/[^\d|\-+|\.+]/g, '');
          elem.val(plainNumber);
        });
        elem.bind('blur', function(event) {
          var pfy =  ( 20*elem.val() ) / 100;
          pfy = elem.val() - pfy;
          elem.val($filter(attrs.format)(elem.val()));
          var result = document.getElementById("priceYour");
          var wrappedResult = angular.element(result);
          wrappedResult.val($filter(attrs.format)(pfy))
        });
      }
    };
  }]);

  app.directive('endRepeat', ['$timeout', function ($timeout) {
    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        if (scope.$last === true) {
          $timeout(function () {
            scope.$emit('ngRepeatFinished');
          });
        }
      }
    }
  }]);

  app.filter('reverse', function() {
    // return function(items) {
      // return items.slice().reverse();
    // };
  });

  app.directive('uploadfile', function () {
      return {
        restrict: 'A',
        link: function(scope, elem) {
          elem.bind('click', function(e) {
            setTimeout(function() {
              document.getElementById('upload').click()
            }, 0);
          });
        }
      };
  });

  app.directive('scrollOnClick', function() {
    return {
      restrict: 'A',
      link: function(scope, $elm) {
        $elm.on('click', function() {
          $("ion-content").scrollTop(0);
        });
      }
    }
  });

})()
