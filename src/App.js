import React, { Component } from 'react';
import './App.css';

import Header from './components/Header';

import FlickrAPI from './utils/FlickrAPI';

import MapStyles from './data/mapStyles';
import GeoData from './data/locations';

import logo from './icons/loading.png';

class App extends Component {

    state = {
        mapStyles: MapStyles,
        locations: GeoData.locations,
        markers: []
    }

    componentDidMount() {
        // initMap() to the global window context
        window.initMap = this.initMap;
        // Asynchronously load the Google Maps script, passing in the callback reference
        loadJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyA_JmqWP_TjdTqHxIAHUKAC_LbxuiZHhpI&callback=initMap')
    }

    initMap = () => {

        const { mapStyles, locations } = this.state;

        const GM = window.google.maps;

        const map = new GM.Map(document.getElementById('map'), {
            zoom: 13,
            center: { lat: 55.75, lng: 37.616667 },
            styles: mapStyles,
            mapTypeControl: false
        });

        const bounds = new GM.LatLngBounds(),
            geocoder = new GM.Geocoder(),
            infowindow = new GM.InfoWindow({
                maxWidth: 250
            });

        locations.map(location => {
            const id = location.id,
                position = location.geo,
                title = location.title;

            // Create a marker
            const marker = new GM.Marker({
                map: map,
                position: position,
                title: title,
                animation: GM.Animation.DROP,
                id: id
            });

            marker.addListener('click', () => {
                populateInfoWindow(marker, infowindow);
            });

            // Render is not necessary at this moment,
            // so push markers to state without setState()
            this.state.markers.push(marker);

            bounds.extend(position);

            return false;
        });

        map.fitBounds(bounds);

        map.addListener('click', () => GM.event.trigger(infowindow, 'closeclick'));

        infowindow.addListener('closeclick', function () {
            infowindow.close();
            // The marker property is cleared if the infowindow is closed.
            infowindow.marker && infowindow.marker.setAnimation(null);
            infowindow.marker = null;
        });

        function populateInfoWindow(marker, infowindow) {
            // The infowindow is not already opened on this marker.
            if (infowindow.marker !== marker) {
                infowindow.marker = marker;
                infowindow.setContent(
                                    `<p class="header-iw">${marker.title}</p>
                                    <img class="img-iw loading" src=${logo} alt="${marker.title}" />
                                    <address class="location-iw"> </address>`
                                );
                infowindow.open(map, marker);

                // Apply custom infoWindow styles
                const iw = document.querySelector('.gm-style-iw'),
                    iwImg = document.querySelector('.img-iw');

                iw.parentNode.classList.add('custom-iw-parent');
                iw.classList.add('custom-iw');
                iwImg.parentNode.classList.add('img-iw-parent');

                FlickrAPI.searchPic(marker).then(res => {
                    iwImg.onload = () => iwImg.classList.remove('loading');
                    iwImg.src = res;
                })

                geocoder.geocode({'location': marker.position}, function(results, status) {
                    if (status === 'OK') {
                      if (results[0]) {
                        //  Get nearest address with house number
                        const addrWithStreetNumber = results.filter(
                            res => res.address_components[0].types.indexOf('street_number') !== -1
                        )[0];
                        document.querySelector('.location-iw').innerHTML = addrWithStreetNumber.formatted_address;
                      } else {
                        window.alert('No results found');
                      }
                    } else {
                      window.alert('Geocoder failed due to: ' + status);
                    }
                });
            }
        }
    }

    render() {
        return (
            <div className="App">
                <Header
                    markerList={this.state.markers}
                />

                <div id="map" role="application" aria-label="Map of Moscow"></div>
            </div>
        );
    }
}

function loadJS(src) {
    const ref = window.document.getElementsByTagName("script")[0];
    const script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    ref.parentNode.insertBefore(script, ref);
}

export default App;
