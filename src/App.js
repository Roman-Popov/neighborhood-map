import React, { Component } from 'react';
import './App.css';

import Header from './components/Header';

import FlickrAPI from './utils/FlickrAPI';

import MapStyles from './data/mapStyles';
import GeoData from './data/locations';

import loadingLogo from './icons/loading.png';
import noImageLogo from './icons/no-results.png';
import noConnectionLogo from './icons/no-connection.png';

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

        const populateInfoWindow = (marker, infowindow) => {
            // The infowindow is not already opened on this marker.
            if (infowindow.marker !== marker) {
                infowindow.marker = marker;
                infowindow.setContent(
                                    `<p class="header-iw">
                                        <button class="refresh-btn" aria-label="Refresh image" title="Refresh image">
                                            ⟳
                                        </button>
                                        ${marker.title}
                                    </p>
                                    <figure class="figure-iw">
                                        <img class="img-iw" src=${loadingLogo} alt="${marker.title}" />
                                        <figcaption class="credit">
                                            Provided by <a href="" target="_blank" title="Image source">Flickr</a>
                                        <figcaption>
                                    </figure>
                                    <address class="location-iw">Searching address...</address>`
                                );
                infowindow.open(map, marker);

                // Apply custom infoWindow styles
                const iw = document.querySelector('.gm-style-iw'),
                    iwFig = document.querySelector('.figure-iw'),
                    iwImg = document.querySelector('.img-iw'),
                    iwImgSource = document.querySelector('.credit a'),
                    iwImgRefresh = document.querySelector('.refresh-btn'),
                    locationElem = document.querySelector('.location-iw');

                iw.parentNode.classList.add('custom-iw-parent');
                iw.classList.add('custom-iw');
                iwFig.parentNode.classList.add('figure-iw-parent');
                iwFig.parentNode.parentNode.classList.add('figure-iw-grandparent');

                // Get data about image from local storage
                const localImgInfo = this.manageLocalStorage(marker);

                // To detect if image was cahced (if it loads less than 1s)
                let isImgCached = null;
                const timerIsCached = setTimeout(() => {
                    iwImg.onload = null;
                    if (!isImgCached) iwImg.src = noConnectionLogo;
                    this.manageLocalStorage(marker, { imgSource: null, author: null });
                }, 1000);

                if (localImgInfo) {
                    iwImg.onload = () => {
                        clearTimeout(timerIsCached);
                        isImgCached = true;
                        iwImgSource.href = localImgInfo.author;
                        document.querySelector('.credit').classList.add('visible');
                        iwImg.onload = null;
                    }

                    iwImg.src = localImgInfo.imgSource;
                } else {
                    clearTimeout(timerIsCached);
                    iwImg.classList.add('loading');
                }

                FlickrAPI.searchPic(marker).then(res => {
                    // Image update available
                    if (!localImgInfo || (res.imgSource !== localImgInfo.imgSource)) {
                        iwImg.onload = () => {
                            this.manageLocalStorage(marker, res);
                            iwImg.classList.remove('loading');
                            iwImgSource.href = res.author;
                            document.querySelector('.credit').classList.add('visible');
                            iwImg.onload = null;
                        }

                        // If there is no local info about image at all - download it immediately
                        // Else - make indication and load on click
                        if (!localImgInfo || !localImgInfo.imgSource) {
                            iwImg.src = res.imgSource;
                        } else {
                            iwImgRefresh.classList.add('visible');
                            iwImgRefresh.onclick = () => {
                                iwImg.src = res.imgSource;
                                iwImgRefresh.classList.remove('visible');
                            }
                        }
                    }
                }).catch((e) => {
                    iwImg.classList.remove('loading');

                    if(e.message === 'Empty response') {
                        iwImg.src = noImageLogo;
                    } else {
                        // There is no information at all. Show noConnectionLogo
                        if (!localImgInfo || !localImgInfo.imgSource) iwImg.src = noConnectionLogo;
                    }
                })

                this.getNearestAddress(marker.position, geocoder)
                    .then(result => locationElem.innerHTML = result)
            }
        }
    }

    //  Get nearest address with house number
    getNearestAddress = (markerPosition, geocoder) => {
        return new Promise( (resolve) => {
            geocoder.geocode({ 'location': markerPosition }, (results, status) => {
                let response;
                if (status === 'OK') {
                    if (results[0]) {
                        const addrWithStreetNumber = results.filter(
                            res => res.address_components[0].types.indexOf('street_number') !== -1
                        )[0];
                        response = addrWithStreetNumber.formatted_address;
                    } else {
                        response = 'No address found';
                    }
                } else {
                    console.log('Geocoder failed due to: ' + status);
                    response = 'Geocoder failed, check your connection. See console for more info.';
                }
                resolve(response)
            });
        })
    }

    // To store data about images on local machine
    // It helps to show cached images instantly fithout waiting fetch
    manageLocalStorage = (location, imageInfo) => {
        const storedLocationsJSON = localStorage.getItem('storedLocationsJSON') !== null ?
            localStorage.getItem('storedLocationsJSON') : '[]';

        const storedLocations = JSON.parse(storedLocationsJSON);

        let requiredLocation = storedLocations.find(stLoc => location.id === stLoc.id);

        if (!requiredLocation) {
            requiredLocation = { id: location.id, title: location.title }
            storedLocations.push(requiredLocation)
        }

        // In case if there is another location with this id now - rewrite
        if (requiredLocation.title !== location.title) {
            requiredLocation.title = location.title;
        }

        if (imageInfo) requiredLocation.imageInfo = imageInfo;

        localStorage.setItem('storedLocationsJSON', JSON.stringify(storedLocations))

        return requiredLocation.imageInfo
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
