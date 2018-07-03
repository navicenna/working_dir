# Neighborhood Map Project

Source code for a project planner website, based on KnockoutJS, Google Maps API, 
and Zomato API. I'm using the Zomato API to dynamically gather the top 10-reviewed
restaurants around Austin, TX. If rankings change on Zomato, then my list will also change,
because the API query is run everytime the website in refreshed.

By: Navid Bahmanyar


SOURCES

- Some code adapted from Udacity lessons
- Collapsable sidebar inspired by tutorial here: https://www.w3schools.com/howto/howto_js_sidenav.asp
- Zomato API documentation
- Viewed gmawji's neighborhood map project on Github to see
a live example of knockoutJS used as a ModelView to the Google Maps API: https://github.com/gmawji/neighborhood-map


MODULES

1. js/app.js: main application
2. static/styles.css: styling
3. index.html: main page and data bindings


HOW TO USE:

1. Clone my repository: https://github.com/nbahmanyar/working_dir.git
2. Navigate to working_dir/neighborhood-map/
3. Open index.html in a web browser
4. Click on a marker to see a picture and some info on the restaurant
5. Type text in the search bar to limit results