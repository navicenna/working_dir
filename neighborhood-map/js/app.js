var map;
var markers = [];
var loc;
var filtered;
var locations;

var ViewModel = function () {
  var self = this;
  this.locs = ko.observableArray([]);
  this.search = ko.observable("");


  // Create a function which will get the top 12 highest rated 
  // restaurants around Austin, Texas from the Zomato API
  // This function will also initialize the Google Map after
  // acquiring and parsing the Zomato restaurant data
  this.get_restaurants = function (callback_initMap) {

    var count = 10; // # of results
    var lat = 30.271475; //Austin, TX
    var lon = -97.753591; //Austin, TX
    var radius = 1100; // in meters
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
        locations = parse_zomato(data);
        callback_initMap(locations);
      },
      error: function () {
        alert('Sorry, the Zomato API is not working right now!');
      },
      beforeSend: setHeader
    });
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
        lat: 30.271475,
        lng: -97.793591
      },
      zoom: 12,
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
        map: map,
        cuisines: locations[i].cuisines,
        cost: locations[i].cost,
        img: locations[i].img,
        rating: locations[i].rating,
      });

      // Push the marker to our array of markers.
      markers.push(marker);

      // Create an onclick event to open an infowindow at each marker.
      marker.addListener('click', function () {
        populateInfoWindow(this, largeInfowindow);
      });
    }

    // Store locations in an obserable array
    self.locs(markers);

    // Bounce marker by clicking restaurant name
    self.clickName = function () {
      var id = this.id;
      populateInfoWindow(markers[id], largeInfowindow);
      // alert('foo function ' + id);
    }
  }
  this.get_restaurants(this.initMap);

  this.filteredLocs = ko.computed(function () {
    var rv = [];
    var all_locations = self.locs();

    for (let index = 0; index < all_locations.length; index++) {
      const element = all_locations[index];
      var search_string = self.search().toLowerCase();
      var title = element.title.toLowerCase();
      if (title.includes(search_string)) {
        rv.push(element);
        markers[index].setVisible(true);
      } else {
        markers[index].setVisible(false);
      }
    }

    return rv;
  })

  loc = this.locs;
  filtered = this.filteredLocs;
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
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  // document.getElementById("main").style.marginLeft = "0";
}

// var response;
// var results;

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
populateInfoWindow = function (marker, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    var content = `<div> <span class="infowindow-title"> ${marker.title}</span><br><br>
    <span>Cost: ${marker.cost}</span><br>
    <span>Cuisines: ${marker.cuisines}</span><br>
    <span>Rating: ${marker.rating}</span><br><br>
    <img src="${marker.img}" alt="restaurant pic" height="111">

    
    
    </div>
    `;
    console.log(`"${marker.img}"`)
    infowindow.setContent(content);
    var imageObj = new Image();
    imageObj.src = marker.img;
    imageObj.onload = function () {
      infowindow.open(map, marker);
    };
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function () { marker.setAnimation(null); }, 750);

    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function () {
      infowindow.marker = null;
    });
  }
}


function main() {
  ko.applyBindings(new ViewModel());
}

function googleAPIerror() {
  alert('Google Maps API failed to load');
}