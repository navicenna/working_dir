var map;
// var locations = get_restaurants();
// console.log('after get', locations)
var markers = [];

var ViewModel = function () {

  this.firstName = ko.observable("abcdef");
  this.fullName = ko.pureComputed(function () {
    // Knockout tracks dependencies automatically. It knows that fullName depends on firstName and lastName, because these get called when evaluating fullName.
    return "Mr. " + this.firstName() + " Fooderberg";
  }, this);
  this.foo = ko.observable("foobartest");

  // Initialize a list of places in Austin, TX.
  // this.locations = ko.observableArray([{
  //     title: "Stubb's Bar-B-Q",
  //     location: {
  //       lat: 30.268949,
  //       lng: -97.736112
  //     }
  //   },
  //   {
  //     title: 'Whole Foods Market',
  //     location: {
  //       lat: 30.271080,
  //       lng: -97.751368
  //     }
  //   },
  //   {
  //     title: 'Republic Square',
  //     location: {
  //       lat: 30.267809,
  //       lng: -97.747313
  //     }
  //   },
  //   {
    //     title: 'Wu Chow',
    //     location: {
      //       lat: 30.268930,
      //       lng: -97.747882
      //     }
      //   },
      //   {
  //     title: 'Texas Capitol',
  //     location: {
    //       lat: 30.275796,
  //       lng: -97.740415
  //     }
  //   }
  // ]);
  // console.log(this.locations());

  // console.log('before get', locations);
  // get_restaurants();
  // console.log('after_get', locations);
  
  this.get_restaurants = function(callback_initMap) {
  
    var count = 12;
    var lat = 30.268949;
    var lon = -97.736112;
    var radius = 5000;
    var sort = 'rating';
    var order = 'desc';
    var url = 'https://developers.zomato.com/api/v2.1/search?count=' + count + 
      '&lat=' + lat + '&lon=' + lon + '&radius=' + radius + '&sort=' + sort + '&order=' + order;
  
  
    // var response;
    $.ajax({
      url: url,
      type: 'GET',
      dataType: 'json',
      success: function (data) {
        // alert('hello!');
        // console.log(data);
        // response = data;
        locations = parse_zomato(data);
        callback_initMap(locations);
      },
      error: function () {
        alert('foo!');
      },
      beforeSend: setHeader
    });
    return locations;
  }
  
  
  // Parse Zomato response and extract necessary info for each restaurant
  function parse_zomato(response) {
    var parsed_restaurants = [];
    var restaurants = response.restaurants;
    
    restaurants.forEach(element => {
      // console.log(element);
      var temp_restaurant = {
        name: element.restaurant.name,
        cost: element.restaurant.average_cost_for_two/2,
        cuisines: element.restaurant.cuisines,
        rating: element.restaurant.user_rating.aggregate_rating,
        img: element.restaurant.featured_image,
        lat: element.restaurant.location.latitude,
        lon: element.restaurant.location.longitude,
      }
      parsed_restaurants.push(temp_restaurant);
  
      
    });
    return parsed_restaurants;
  }
  
  // This function sets the Ajax request header
  function setHeader(xhr) {
    var key = 'ef9cdebf16fb2439540ef6b1fdf77d55';
    xhr.setRequestHeader('user-key', key);
  }
  this.initMap = function (locations) {
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
      center: {
        lat: 30.273943,
        lng: -97.753997
      },
      zoom: 14,
      mapTypeControl: false
    });
    
    
    var largeInfowindow = new google.maps.InfoWindow();
    
    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < locations.length; i++) {
      console.log(i, locations[i]);
      // Get the position from the location array.
      var position = locations[i].location;
      var title = locations[i].title;
      // Create a marker per location, and put into markers array.
      var marker = new google.maps.Marker({
        position: position,
        title: title,
        animation: google.maps.Animation.DROP,
        id: i,
        map: map
      });
      // Push the marker to our array of markers.
      markers.push(marker);
      // Create an onclick event to open an infowindow at each marker.
      marker.addListener('click', function () {
        populateInfoWindow(this, largeInfowindow);
      });
    }
    document.getElementById('show-listings').addEventListener('click', showListings);
    document.getElementById('hide-listings').addEventListener('click', hideListings);
  }
  
  get_restaurants(this.initMap);
  // console.log('after map', locations);
  
  // This function populates the infowindow when the marker is clicked. We'll only allow
  // one infowindow which will open at the marker that is clicked, and populate based
  // on that markers position.
  this.populateInfoWindow = function (marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
      infowindow.marker = marker;
      infowindow.setContent('<div>' + marker.title + '</div>');
      infowindow.open(map, marker);
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick', function () {
        infowindow.marker = null;
      });


    }
  }

  this.bar = ko.observable("foo");
  // console.log(this.bar());

}

// This function will loop through the markers array and display them all.
function showListings() {
  var bounds = new google.maps.LatLngBounds();
  // Extend the boundaries of the map for each marker and display the marker
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
    bounds.extend(markers[i].position);
  }
  map.fitBounds(bounds);
}

// This function will loop through the listings and hide them all.
function hideListings() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
}


/* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
function openNav() {
  document.getElementById("mySidenav").style.width = "320px";
  // document.getElementById("main").style.marginLeft = "320px";
}

function toggleNav() {
  $("#mySidenav").toggleClass("collapsed");
  var foo = 1;
  foo = 2;
  var bar = document.getElementById("mySidenav").classList;
  // console.log(bar);
  // document.getElementById("main").style.marginLeft = "320px";
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  // document.getElementById("main").style.marginLeft = "0";
}

// TODO: massage the zomato API to return 20 restaurants with high scores
// TODO: populate the array with the restaurants
// TODO: create the infowindow thing from one of the existing examples

// G
var response;
var results;



function main() {
  ko.applyBindings(new ViewModel());
}