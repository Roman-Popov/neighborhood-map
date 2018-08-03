import React, { Component } from 'react';
import './App.css';

import Header from './components/Header';

import MapStyles from './data/mapStyles';
import GeoData from './data/locations';

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

        const map = new window.google.maps.Map(document.getElementById('map'), {
            zoom: 13,
            center: { lat: 55.75, lng: 37.616667 },
            styles: mapStyles,
            mapTypeControl: false
        });

        const markerList = [];
        const bounds = new window.google.maps.LatLngBounds();
        const infowindow = new window.google.maps.InfoWindow();

        locations.map(location => {
            const id = location.id,
                position = location.geo,
                title = location.title;

            // Create a marker
            const marker = new window.google.maps.Marker({
                map: map,
                position: position,
                title: title,
                animation: window.google.maps.Animation.DROP,
                id: id
            });

            marker.addListener('click', () => {
                populateInfoWindow(marker, infowindow);
            });

            markerList.push(marker)
            bounds.extend(position);

            return false;
        });

        map.fitBounds(bounds);

        this.setState({
            markers: markerList,
        })

        function populateInfoWindow(marker, infowindow) {
            // The infowindow is not already opened on this marker.
            if (infowindow.marker !== marker) {
                infowindow.marker = marker;
                infowindow.setContent(`<div> This is ${marker.title} </div>`);
                infowindow.open(map, marker);
                // The marker property is cleared if the infowindow is closed.
                infowindow.addListener('closeclick', function () {
                    infowindow.setMarker = null;
                });
            }
        }
    }



    render() {
        return (
            <div className="App">
                <Header />

                <div id="map" role="application"></div>
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
