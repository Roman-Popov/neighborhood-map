# Neighborhood Map Project

Let me introduce you Project 8 of the [Front-End Web Developer Nanodegree Program](https://eu.udacity.com/course/front-end-web-developer-nanodegree--nd001)

## Instructions

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

***
**IMPORTANT:** You need a valid Google Maps API key with enabled *Maps JavaScript API* and *Geocoding API*. You can see [here](https://developers.google.com/maps/documentation/javascript/get-api-key) how to get it. Also you need Flick API key. How to get it you can see [here](https://www.flickr.com/services/developer/api/). If you already have ones - well done! Please continue :)
***

_How to install and launch this project:_

1. Put your API keys to script files:
    1. Google Maps API key to line 27 of [`App.js`](src/App.js) `...key=YOUR_API_KEY...`
    2. Flickr API key to line 6 of [`FlickrAPI.js`](src/utils/FlickrAPI.js) `APIkey = 'YOUR_API_KEY'`
2. Go to the root directory of the app;
3. Install all the project dependencies with `npm install`;
4. For start the development server run `npm start`;
5. Else, for run the production version:
    1. Run `npm run build`;
    2. Then install a static server with `npm install -g serve`;
    3. Finally, run `serve -s build`.


***
Another **IMPORTANT:** Service Worker will be registered only in production mode.
***


### Dependencies
1. [`react`](https://www.npmjs.com/package/react)
2. [`react-dom`](https://www.npmjs.com/package/react-dom)
3. [`react-scripts`](https://www.npmjs.com/package/react-scripts)


## Description of Contents

The file [`FlickrAPI.js`](src/utils/FlickrAPI.js) contains static methods that will need to perform necessary with Flickr API.

* [`getCommonURL`](#getCommonURL)
* [`searchPic`](#searchPic)
* [`getOnePic`](#getOnePic)


### `getCommonURL`

Method Signature:

```js
getCommonURL()
```

Returns an initial part of the URL for Flickr request.

Contains following parameters (by default):
```js
endpoint = 'https://api.flickr.com/services',
requestFormat = 'rest',
APIkey = 'YOUR_API_KEY',
method = 'flickr.photos.search',
sort = 'relevance',
responseFormat = 'json',
limit = 1,
callback = 'nojsoncallback=1';
```

They are hardcoded, so if you want to change params - edit [`FlickrAPI.js`](src/utils/FlickrAPI.js).


### `searchPic`

Method Signature:

```js
searchPic(location)
```

Searches pictures on Flickr by title of provided location object. **_Location object should have a `title` property_**. Returns a `fetch` request (a Promise by nature) that returns `searchPic(responsedJSONobject)` if there was found at least one photo or throw an error `'Empty response'` if no images were found.


### `getOnePic`

Method Signature:

```js
getOnePic(responseJSONpics)
```

Returns URL of one picture from provided JSON response of Flickr request.



## Important!
Do not forget to receive the API keys!
