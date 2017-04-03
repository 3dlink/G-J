(function(){
  var app = angular.module('gailJudy.functions', []);
  app.factory('functions', function(){
    return{
      lol: function(data, $http, $scope,$cordovaFileTransfer,$rootScope){
        // var url = WEBROOT+"uploadFilePic/";
        // var options = new FileUploadOptions();
        //   options.headers = {};
        //   options.fileKey= "file";
        //   options.chunkedMode= false;
        //   options.mimeType= "image/png";
        //   options.headers = {Connection: "close"};
        //   $cordovaFileTransfer.upload(url, data, options).then(function (result) {
        //     var spl = result['response'];
        //     spl = spl.replace('"', '');
        //     spl = spl.replace('"', '');
        //     $rootScope.imgUserProfile = WEBROOT+'images/'+spl;
        //     $scope.imgaProfile = WEBROOT+'images/'+spl;
        //     $scope.imgaBackground = WEBROOT+'images/'+spl;
        //     window.localStorage.setItem("userIMG", WEBROOT+'images/'+spl);
        //     $scope.fullImg = true;
        //     $scope.emptyImg = false;
        //     // imgaProfile2 = WEBROOT+'images/'+spl;
        //     // imgaBackground2 = WEBROOT+'images/'+spl;
        //  }, function (err) {
        //      $scope.modal = true;
        //      $scope.withoutScroll = '';
        //  },
        //  function (progress) {
        //      $scope.modal = true;
        //      $scope.withoutScroll = '';
        //  });

        // alert(data)
        $http({
          method : "POST",
          data: data,
          contentType: false,
          processData: false,
          headers: {
            'Content-Type': undefined
            // 'Content-type': image
          },
          url : WEBROOT+"uploadFilePic",
        }).then(function mySucces(r) {
          $scope.modal = true;
          $scope.withoutScroll = '';
          // alert(r.data);
            // alert('Termine la llamda al server con exito');
          },function myError(resp) {
            $scope.modal = true;
            $scope.withoutScroll = '';
              // alert('Error 501')
            });
      },
      saveLocalstorage: function(data, follower, following){
        window.localStorage.setItem("firstName", data.firstname);
        window.localStorage.setItem("userUsername", data.username);
        window.localStorage.setItem("lastName", data.lastname);
        window.localStorage.setItem("userEmail", data.email);
        window.localStorage.setItem("userID", data._id);
        window.localStorage.setItem("userStar", data.star);
        window.localStorage.setItem("userFirstTime", data.firstTime);
        window.localStorage.setItem("userFollowers", follower);
        window.localStorage.setItem("userFollowing", following);
        if(data.image != "" && data.image != null){
          window.localStorage.setItem("userIMG", WEBROOT+'images/'+data.image);
        }
        else{
          window.localStorage.setItem("userIMG", "");
        }
      },
      likeClick: function(likeData, item,$http){

        $http({
          method : "POST",
          data: likeData,
          url : WEBROOT+"likeItem",
        }).then(function mySucces(r) {
            if(item['likeIMG'] =="assets/heartlikes.png"){
              item['likeIMG'] ="assets/heartempty.png";
            }
            else{
              item['likeIMG'] ="assets/heartlikes.png";
            }
            item['likes'] = r.data;
            return(item);

          },function myError(resp) {
              // alert('Error 501')
            });
        }
      }
  })
})()
