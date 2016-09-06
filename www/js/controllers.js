angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})
.controller('PeopleCtrl', function($scope, $http, User, Chats, Data) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  $scope.view={}

  $scope.testLogin=function(){
    $http.post('http://localhost:3000/auth/getUser', {token:window.localStorage.getItem('token')}).then(function(res){
      console.log(res.data);
      // if(res.data.error!=true){
      //   console.log(res.data);
      //   User.login(res.data)
      //   $location.path('/tab/dash');
      // }
    })
  }
  console.log("here");
  $scope.controllertest="otherwords";

})
.controller('PlacesCtrl', function($scope, $http, User, Chats, Data, $state) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  console.log("here");
  $scope.controllertest="words";
  $scope.view={}
  $scope.$on('$ionicView.enter', function(e) {
    console.log("here");
    console.log(User);
    var user=User.getCurrUser();
    if(user.loggedin===true){
      console.log("loggedin");
      $http.get('http://localhost:4567/users/'+user.id+"/data/"+window.localStorage.getItem('token')).then(function(res){
        if(res.data.error!=true){
          console.log(res.data);
          Data.formatData(res.data)
          $scope.view.places=Data.getData();
        }
        console.log($scope.view.places);
      })
    }
    $scope.addPlace=function(){
      $http.post('http://localhost:4567/places/'+window.localStorage.getItem('token'), {
        name:$scope.view.newName
      }).then(function(res){
        $scope.update();
      })
    }
    $scope.update=function(){
      $http.get('http://localhost:4567/users/'+user.id+"/data/"+window.localStorage.getItem('token')).then(function(res){
        if(res.data.error!=true){
          console.log(res.data);
          Data.formatData(res.data)
          $scope.view.places=Data.getData();
        }
        console.log($scope.view.places);
      })
    }
  });
  $scope.display=function(place){
    Data.setSelected("place", place.id)
    $state.go("tab.places-show")
  }
  $scope.textFilter=function(place){
  return ($scope.view.search===undefined)? true :!(place.name.indexOf($scope.view.search)===-1 )
}
})
.controller('PlacesDisplayCtrl', function($scope, $stateParams, $http, User, Data,  $location, $state){
  console.log("in this controller...");
  $scope.view={}
  $scope.$on('$ionicView.enter',function(){
    $scope.view.place=Data.getSelected("place");
    console.log($scope.view.place);
  })
})
.controller('LoginCtrl', function($scope, $stateParams, $http, User, $location, $state){
  console.log("stuff");

  $scope.view={}
  $scope.$on('$ionicView.enter',function(){
    console.log("get ready for login");
  })
  $scope.login=function(){
    console.log("gonna login");
    console.log($scope);
    console.log($scope.view.username);
    console.log($scope.view.password);
    $http.post('http://localhost:4567/auth/login', {
      username:$scope.view.username,
      password:$scope.view.password,
    }).then(function(res){
      if(res.data==="User Not Found"){
        console.log(res.data);
      $scope.view.errormessage=res.data;
      }
      else{
        console.log(res.data);
        window.localStorage.setItem("token", res.data);
        $http.get('http://localhost:4567/users/' +window.localStorage.getItem('token')).then(function(res){
          if(res.data.error!=true){
            console.log(res.data);
            User.login(res.data)
          }
        })

      }
    })
  }
  $scope.signup=function(){
    console.log("gonna signup");
    console.log($scope);
    console.log($scope.view.username);
    console.log($scope.view.password);
    console.log($scope.view.accountType);
    $http.post('http://localhost:4567/auth/signup', {
      username:$scope.view.username,
      password:$scope.view.password,
    }).then(function(res){
      if(res.data==="User Not Found"){
        console.log(res.data);
      $scope.view.errormessage=res.data;
      }
      else{
        console.log(res.data);
        window.localStorage.setItem("token", res.data);
        $http.get('http://localhost:4567/users/' +window.localStorage.getItem('token')).then(function(res){
          if(res.data.error!=true){
            console.log(res.data);
            User.login(res.data)
          }
        })

      }
    })
  }

})
.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
