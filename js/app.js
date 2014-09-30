var api = {

	currentPosition: null,
	map: null,
	marker: null,
	infowindow: null,

	init: function(){
		api.locationFinder();
		api.LoadWeather();
		$("#js-geolocation").click(MyAPI.getCurrentLocation);
	},

	// get current location's coordinate.
	locationFinder: function (){
	    if (navigator.geolocation) 
	    {
	        navigator.geolocation.getCurrentPosition(showPosition);
	    } 
	    else
	    {
	        alert("Geolocation is not supported by this browser.");
	    }
		//function to get current position
		function showPosition(position) {
		   	api.mapProperties(position.coords);
		   	api.currentPosition = position.coords;
			var params = {lat: api.currentPosition.latitude, lon: api.currentPosition.longitude};
   		    api.LoadWeather(params);
		}
	},

	//function to draw the map
	mapProperties: function(coordinates) {
		// Map properties.
		var mapProp = {
		  center: new google.maps.LatLng(coordinates.latitude, coordinates.longitude),
		  zoom: 12,
		  mapTypeId:google.maps.MapTypeId.TERRAIN
		};
	
		api.map  =new google.maps.Map(document.getElementById("googleMap"), mapProp);
		//Marker constructor to create a marker
		api.marker = new google.maps.Marker({
		  	position: mapProp.center,
		  	animation: google.maps.Animation.BOUNCE
		 });
		api.marker.setMap(api.map);

		// Zoom to 15 when clicking on marker
		google.maps.event.addListener(api.marker,'click',function() {
		  api.map.setZoom(15);
		  api.map.setCenter(api.marker.getPosition());
		});

		//reset center postion of marker when changed after 10s
		google.maps.event.addListener(api.map,'center_changed',function() {
		  window.setTimeout(function() {
		    api.map.panTo(api.marker.getPosition());
		  },10000);
		});

		google.maps.event.addListener(api.map, 'click', function(event) {
	  		api.placeMarker(event.latLng);
	  	});
	},

	//places a marker where the user has clicked and shows an infowindow with the longitudes & latitudes of the marker
	placeMarker: function (location){
		

		var markerProp = {
			marker: api.marker,
		  	position: location,
		  	map: api.map,
		};

			api.marker.setPosition(location)
			var params = {lat: location.lat(), lon: location.lng()};
		  	api.infowindow = new google.maps.InfoWindow({
			    content: 'Latitude: ' + location.lat() + ' Longitude: ' + location.lng()
	 	});

		api.infowindow.open(api.map,api.marker);	
		api.LoadWeather(params);
	},
 
 	// Display weather for the current location.
	LoadWeather: function(params){
			var weatherAPI = 'http://api.openweathermap.org/data/2.5/weather?callback=?';
	        $.getJSON(weatherAPI, params, function(response) {
	       			console.log(response);
	       			var temp = response.main.temp;
	       			api.TemperatureInCent= Math.round(temp - 273.15);
	       			console.log(api.TemperatureInCent)

       			var displayParam = 'http://openweathermap.org/img/w/'+ response.weather[0].icon+".png";
				$('#weather').html("<marquee behavior='alternate'><ul>"+ "<li><span id='icon' class='temp_value'>" + '<img src="' + displayParam +'"/>' + '</span></li>' + "<li><span class='temp_value'>" + api.TemperatureInCent + "&deg;C" +'</span></li>'+ "<li><span class='temp_value'>Humidity: " + response.main.humidity + "</span></li>" + "<li><span class='temp_value'>Pressure: " + response.main.pressure + "</span></li>" + "<li><span class='temp_value'>Wind: " + response.wind.deg + "</span></li>"+"<li><span id='weather_descr' class='temp_value'>" + response.weather[0].description+ '</span></li>'+"</ul></marquee>");
      		});

	      	var forecast = 'http://api.openweathermap.org/data/2.5/forecast?callback=?';
	            $.getJSON(forecast, params, function(response) {
	       			console.log(response.list);

	       			var counter = 1;
	       			var $div = null;
	       			var $list = null;
	       			$.each(response.list, function(index, value){
	       					$("#forecast").append($list);

	       				$list = $('<ul class="update"></ul>').attr("id", ''+counter+'');
	       				$list.append('<li>'+'Date: '+value.dt_txt+'</li>').append('<li>'+'Temperature: '+Math.round(value.main.temp - 273.15)+"&deg;C"+'</li>').append('<li>'+'Humidity: '+Math.floor(value.main.humidity)+'</li>').append('<li>'+'Pressure: '+Math.floor(value.main.pressure)+'</li>').append('<li>'+'Wind: '+Math.floor(value.wind.deg)+'</li>').append('<li>'+'Description: '+value.weather[0].description+'</li>');
	       			
	       				counter++;
	       			});
					$("#forecast").children("#1").show();
      		});
	}

}//end of api
$(document).ready(api.init);