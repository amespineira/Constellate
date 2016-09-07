angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})
.controller('PeopleCtrl', function($scope, $http, User, Chats, Data, $state) {
})
.controller('PlacesCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  console.log("here");
  $scope.controllertest="words";

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
            console.log(User.getCurrUser());
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
        //console.log(res.data);
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
})
.controller('NewPerson', function($scope, $ionicPopup, $timeout, Places, People, Notes, Links, User) {
  var user_id = User.getCurrUser().id;
  $scope.places = [];
  $scope.notes = [];
  $scope.links = [];
  $scope.getPlaces = function(){
    console.log("Expected "  + user_id);
    console.log(Places.getPlaces(user_id));
    //console.log(Places.Places(user_id));
    Places.getPlaces(user_id).then(function(places){//place & id
      console.log(places);
      for (var i = 0; i < places.length; i++) {
        $scope.places.push(places[i])
      }
    })
  }
  $scope.getPlaces()
  $scope.input = {
    link_name: '', url: '', note_text:'', note_type:'', first: '', last: '', place: ''
  }
  $scope.addNote = function(){
    $scope.notes.push({text: $scope.input.note_text, type: $scope.input.note_type})
  }
  $scope.removeNote = function(index){
    $scope.notes.splice(index, 1)
  }
  $scope.addLink = function(){
    $scope.links.push({link_name: $scope.input.link_name, url: $scope.input.url})
  }
  $scope.removeLink = function(index){
    $scope.links.splice(index, 1)
  }
  $scope.showPopup = function() {//make code shorter + new route
    if ($scope.input.place === "NEW"){
    var myPopup = $ionicPopup.show({
      template: '<input type="text" ng-model="input.pop_place">',
      title: 'Place Name',
      subTitle: 'please enter a place name',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Save</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.input.pop_place) {
              e.preventDefault();
            } else {
            //  $scope.places.push($scope.input.pop_place);
              Places.addNew({name: $scope.input.pop_place});
            //  return $scope.input.pop_place;
            }
          }
        },
      ]
    });
    }
   };
   $scope.submitNew = function(){
     People.createNew({first_name: $scope.input.first, last_name: $scope.input.last, place_id: $scope.input.place.id}).then(function(person_id){
       for (var i = 0; i < $scope.notes.length; i++) {
         Notes.addNew($scope.notes[i], $scope.input.place.id)
       }
       for (var y = 0; y < $scope.links.length; y++) {
         Links.add($scope.links[y], $scope.input.place.id)
       }
     })
   }
   $scope.peopleRedirect = function(){
     $state.go('tab.people')
   }
});
