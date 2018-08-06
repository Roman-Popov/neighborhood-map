class FlickrAPI {
    static getCommonURL() {
        // Common parameters
        const endpoint = 'https://api.flickr.com/services',
            requestFormat = 'rest',
            APIkey = 'dc1fa29f1d6ba587a26ef719ef5f1107',
            method = 'flickr.photos.search',
            sort = 'relevance',
            responseFormat = 'json',
            limit = 1,
            callback = 'nojsoncallback=1';

        return `${endpoint}/${requestFormat}/?api_key=${APIkey}&method=${method}&sort=${sort}&format=${responseFormat}&per_page=${limit}&${callback}`
    }

    static getOnePic(responseJSONpics) {
        const pic = responseJSONpics.filter(pic => (pic.ispublic) & !(pic.isfamily) & !(pic.isfriend))[0]
        return {
            imgSource: `https://farm${pic.farm}.staticflickr.com/${pic.server}/${pic.id}_${pic.secret}_n.jpg`,
            author: `http://www.flickr.com/photos/${pic.owner}/${pic.id}`
        }
    }

    static searchPic(location) {
        const url = this.getCommonURL();
        return (
            fetch(`${url}&text=${location.title} architecture`)
            .then(response => response.json())
            .then(result => this.getOnePic(result.photos.photo))
        )
    }
}

export default FlickrAPI
