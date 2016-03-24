angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $http) {
            
      $scope.getLocation=function() {
          console.log('done');
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
	console.log('entered showPosition')
     $scope.lat=position.coords.latitude;
     $scope.lon=position.coords.longitude;
     $http.get('http://api.openweathermap.org/data/2.5/weather?lat='+$scope.lat+'&lon='+$scope.lon+'&appid=aecc1ada15291787e9f4ec95ab382165&units=metric').success(function(data) {
                console.log(data);
                $scope.cityEnd=data.name;

                $scope.descEnd = data.weather[0].main;
                $scope.tempidEnd= data.main.temp;
                $scope.windspeedEnd = data.wind.speed;
                $scope.iconEnd=data.weather[0].icon;
/*    console.log(lat);
    console.log(lon);*/
})}
    $scope.getWeatherEnd = function() {
        // onSuccess Callback
// This method accepts a Position object, which contains the
// current GPS coordinates
//
      /*  navigator.geolocation.getCurrentPosition(onSuccess);
var onSuccess = function(position) {
    alert('Latitude: '          + position.coords.latitude          + '\n' +
          'Longitude: '         + position.coords.longitude         + '\n' +
          'Altitude: '          + position.coords.altitude          + '\n' +
          'Accuracy: '          + position.coords.accuracy          + '\n' +
          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
          'Heading: '           + position.coords.heading           + '\n' +
          'Speed: '             + position.coords.speed             + '\n' +
          'Timestamp: '         + position.timestamp                + '\n');
};
        var lat=position.coords.latitude;
        var lon=position.coords.longitude;

// onError Callback receives a PositionError object
//
function onError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}
        

navigator.geolocation.getCurrentPosition(onSuccess, onError);*/
console.log($scope.lat);
    console.log($scope.lon+'hi');
            var end = document.getElementById('CityName').value;
            $http.get('http://api.openweathermap.org/data/2.5/weather?lat='+$scope.lat+'&lon='+$scope.lon+'&appid=aecc1ada15291787e9f4ec95ab382165').success(function(data) {
                console.log(data);
                $scope.cityEnd=data.name;

                $scope.descEnd = data.weather[0].main;
                $scope.tempidEnd= data.main.temp;
                $scope.windspeedEnd = data.wind.speed;
                $scope.iconEnd=data.weather[0].icon;
                
            })
        };
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope,$http) {
   $scope.venueList = new Array();
        $scope.mostRecentReview;
                

        $scope.getVenues = function () {
            var placeEntered = document.getElementById("CityName1").value;
            var searchQuery = "Restaurant";
            if (placeEntered != null && placeEntered != "" && searchQuery != null && searchQuery != "") {
                document.getElementById('div_ReviewList').style.display = 'none';
                //This is the API that gives the list of venues based on the place and search query.
                var handler = $http.get("https://api.foursquare.com/v2/venues/search" +
                    "?client_id=Q0ENF1YHFTNPJ31DCF13ALLENJW0P5MTH13T1SA0ZP1MUOCI" +
                    "&client_secret=ZH4CRZNEWBNTALAE3INIB5XG0QI12R4DT5HKAJLWKYE1LHOG" +
                    "&v=20160215&limit=5" +
                    "&near=" + placeEntered +
                    "&query=" + searchQuery);
                handler.success(function (data) {

                    if (data != null && data.response != null && data.response.venues != undefined && data.response.venues != null) {
                        for (var i = 0; i < data.response.venues.length; i++) {
                            $scope.venueList[i] = {
                                "name": data.response.venues[i].name,
                                "id": data.response.venues[i].id,
                                "location": data.response.venues[i].location
                            };
                        }
                    }

                })
                handler.error(function (data) {
                    alert("There was some error processing your request. Please try after some time.");
                });
            }
        }
        $scope.getReviews = function (venueSelected) {
            if (venueSelected != null) {
                //This is the API call being made to get the reviews(tips) for the selected place or venue.
                var handler = $http.get("https://api.foursquare.com/v2/venues/" + venueSelected.id + "/tips" +
                    "?sort=recent" +
                    "&client_id=Q0ENF1YHFTNPJ31DCF13ALLENJW0P5MTH13T1SA0ZP1MUOCI" +
                    "&client_secret=ZH4CRZNEWBNTALAE3INIB5XG0QI12R4DT5HKAJLWKYE1LHOG&v=20160215" +
                    "&limit=5");
                handler.success(function (result) {
                    if (result != null && result.response != null && result.response.tips != null &&
                        result.response.tips.items != null) {
                        $scope.mostRecentReview = result.response.tips.items[0];
                        //This is the Alchemy API for getting the sentiment of the most recent review for a place.
                        var callback = $http.get("http://gateway-a.watsonplatform.net/calls/text/TextGetTextSentiment" +
                            "?apikey=d0e7bf68cdda677938e6c186eaf2b755ef737cd8" +
                            "&outputMode=json&text=" + $scope.mostRecentReview.text);
                        callback.success(function (data) {
                            if(data!=null && data.docSentiment!=null)
                            {
                                $scope.ReviewWithSentiment = {"reviewText" : $scope.mostRecentReview.text,
                                                            "sentiment":data.docSentiment.type,
                                                             "score":data.docSentiment.score  };
                                document.getElementById('div_ReviewList').style.display = 'block';


                            }
                        })
                    }
                })
                handler.error(function (result) {
                    alert("There was some error processing your request. Please try after some time.")
                })
            }

        }
        $scope.getWeatherEnd = function() {
            var end = document.getElementById('CityName1').value;
            console.log(end);
            $http.get('http://api.openweathermap.org/data/2.5/weather?q='+end+'&appid=aecc1ada15291787e9f4ec95ab382165&units=metric').success(function(data) {
                console.log(data);
                $scope.cityEnd=data.name;
            })
        };
    });