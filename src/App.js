import React, { Component } from 'react';
import './App.css';

import Header from './components/Header';

import MapStyles from './data/mapStyles';

class App extends Component {

    componentDidMount() {
        // initMap() to the global window context
        window.initMap = this.initMap;
        // Asynchronously load the Google Maps script, passing in the callback reference
        loadJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyA_JmqWP_TjdTqHxIAHUKAC_LbxuiZHhpI&callback=initMap')
    }

    initMap = () => {
        const map = new window.google.maps.Map(document.getElementById('map'), {
            zoom: 13,
            center: { lat: 55.75, lng: 37.616667 },
            styles: MapStyles
        });

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
