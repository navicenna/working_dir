var map;
// var locations = get_restaurants();
// console.log('after get', locations)
var markers = [];
var loc;

var ViewModel = function () {

  // Create a function which will get the top 12 highest rated 
  // restaurants around Austin, Texas from the Zomato API
  // This function will also initialize the Google Map after
  // acquiring and parsing the Zomato restaurant data
  this.get_restaurants = function (callback_initMap) {

    var count = 12;  // # of results
    var lat = 30.268949;  //Austin, TX
    var lon = -97.736112;  //Austin, TX
    var radius = 5000;  // in meters
    var sort = 'rating';
    var order = 'desc';
    var url = 'https://developers.zomato.com/api/v2.1/search?count=' + count +
      '&lat=' + lat + '&lon=' + lon + '&radius=' + radius + '&sort=' + sort + '&order=' + order;


    // Asynchronously get the Zomato data
    $.ajax({
      url: url,
      type: 'GET',
      dataType: 'json',
      success: function (data) {
        var locations = parse_zomato(data);
        callback_initMap(locations);
      },
      error: function () {
        alert('Sorry, the Zomato API is not working right now!');
      },
      beforeSend: setHeader
    });
    // return locations;
  }    
  
  this.locations_obs = ko.observableArray([]);
  // Parse Zomato response and extract necessary info for each restaurant
  function parse_zomato(response) {
    var parsed_restaurants = [];
    var restaurants = response.restaurants;

    restaurants.forEach(element => {
      var temp_restaurant = {
        name: element.restaurant.name,
        cost: element.restaurant.average_cost_for_two / 2,
        cuisines: element.restaurant.cuisines,
        rating: element.restaurant.user_rating.aggregate_rating,
        img: element.restaurant.featured_image,
        lat: parseFloat(element.restaurant.location.latitude),
        lon: parseFloat(element.restaurant.location.longitude),
      }
      parsed_restaurants.push(temp_restaurant);
    });
    return parsed_restaurants;
  }


  // This function sets the user key in the Ajax request header
  function setHeader(xhr) {
    var key = 'ef9cdebf16fb2439540ef6b1fdf77d55';
    xhr.setRequestHeader('user-key', key);
  }

  // initMap initializes the Google Map given an array of locations
  this.initMap = function (locations) {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {
        lat: 30.260006,
        lng: -97.754512
      },
      zoom: 14,
      mapTypeControl: false
    });

    var largeInfowindow = new google.maps.InfoWindow();

    for (var i = 0; i < locations.length; i++) {
      var position = {
        lat: locations[i].lat,
        lng: locations[i].lon
      }
      var title = locations[i].name;
      
      // Create a marker per location
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
    
    // Store locations in an obserable array
    self.locs(locations);
    // loc = self.locations_obs;
    // console.log(self.locations_obs()[1]);
  }  
  console.log(this.locations_obs()[1]);
  this.get_restaurants(this.initMap);

  
  this.bar = ko.observable("foo");
  // console.log(this.bar());
  console.log(this.locations_obs()[1]);
  loc = this.locs;
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

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
populateInfoWindow = function (marker, infowindow) {
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


function main() {
  ko.applyBindings(new ViewModel());
}