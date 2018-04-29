'use strict';

function initMap () {

    var uluru = { lat: -25.363, lng: 131.044 };
    var map = new google.maps.Map(document.getElementById("mapa"), {
        zoom: 16,
        center: uluru
    });

    let pos;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            const map = new google.maps.Map(document.getElementById("mapa"), {
                zoom: 15,
                center: pos
            });
            
            var image = 'https://wiki.waze.com/wiki/images/f/f1/LOL-female%402x.png';
            var marker = new google.maps.Marker({
                position: pos,
                map: map,
                icon: image
            });

            if(state.pagina == 2 ){
                var markers = state.locations.family.map(function (location) {
                    var contentString = '<div id = "content"><p>'+location.kin+'</p><p> Esta '+location.status+'</p></div>';
                    var infowindow = new google.maps.InfoWindow({
                        content: contentString
                    });
                    
                    if( (location.latitud && location.longitud) == null){
                        return console.log(' No se encontro la ubicación de ' + location.kin)
                    }
                    const newMarker = new google.maps.Marker({
                        position: {lat: location.latitud, lng: location.longitud},
                        map:map,
                        icon: location.url
                    })
                    newMarker.addListener("click", function(){
                        infowindow.open(map, newMarker);

                    });

                    return newMarker;
                });
            }  else {
                marker.setMap(null);
                calculateAndDisplayRoute(pos, map);

            }

        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, map, map.getCenter());
    }


}

function handleLocationError(browserHasGeolocation, map, pos) {
    map.setPosition(pos);
    map.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}

function calculateAndDisplayRoute(pos, map) {
    const directionsDisplay = new google.maps.DirectionsRenderer;
    const directionsService = new google.maps.DirectionsService;
    directionsDisplay.setMap(map);
    directionsService.route({
        origin: pos,
        destination: { lat: state.selectedLocation.latitud, lng: state.selectedLocation.longitud },
        travelMode: 'DRIVING'
    }, function (response, status) {
        if (status == 'OK') {
            directionsDisplay.setDirections(response);
            const distancia = ((response.routes[0].legs[0].distance.text));
            // $('#km').text(distancia);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}
