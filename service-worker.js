
var dataCacheName = 'orderDisorder-v1';

var cacheName = 'orderDisorderPWA-final-1';
var filesToCache = [
    '/',
    '/index.html', /*Be sure to include all permutations of file names, for example our app is served 
    from index.html, but it may also be requested as / since the server sends index.html when a root 
    folder is requested. You could deal with this in the fetch method, but it would require special 
    casing which may become complex. */
    '/scripts/main.js',
    '/styles/main.css',
    '/manifest.json'
  ];

self.addEventListener('install', function(e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function(cache){
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(filesToCache);
        })
    );
});


/* This code ensures that your service worker updates its cache whenever any of the app shell files change. 
In order for this to work, you'd need to increment the cacheName variable at the top of your service worker 
file.
*/
self.addEventListener('activate', function(e){
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key){
                if(key !== cacheName && key !== dataCacheName)  {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});
/* The last statement fixes a corner-case which you can read about: When the app is complete,
 self.clients.claim() fixes a corner case in which the app wasn't returning the latest data.
  You can reproduce the corner case by commenting out the line below and then doing the following 
  steps: 1) load app for first time so that the initial New York City data is shown 
  2) press the refresh button on the app 3) go offline 4) reload the app. 
  You expect to see the newer NYC data, but you actually see the initial data. This happens because the 
  service worker is not yet activated. self.clients.claim() essentially lets you activate the service worker 
  faster.
  */

// Let's now serve the app shell from the cache. 
  self.addEventListener('fetch', function(e){
    console.log('[ServiceWorker] Fetch', e.request.url);
    var dataUrl = 'https://query.yahooapis.com/v1/public/yql';
    if(e.request.url.indexOf(dataUrl) > -1) {
     /*
     * When the request URL contains dataUrl, the app is asking for fresh
     * weather data. In this case, the service worker always goes to the
     * network and then caches the response. This is called the "Cache then
     * network" strategy:
     * https://jakearchibald.com/2014/offline-cookbook/#cache-then-network
     */
        e.respondWith(
            caches.open(dataCacheName).then(function(cache){
                return fetch(e.request).then(function(response){
                    cache.put(e.request.url, response.clone());
                    return response;
                });
            })
        );
    } else {
        /*
        * The app is asking for app shell files. In this scenario the app uses the
        * "Cache, falling back to the network" offline strategy:
        * https://jakearchibald.com/2014/offline-cookbook/#cache-falling-back-to-network
        */
        e.respondWith(
            caches.match(e.request).then(function(response){
                // checks to see if it's available in the cache.
                return response || fetch(e.request);
                // either responds with the cached version, or uses fetch
            })
        );
    }
  });
/* Stepping from inside, out, caches.match() evaluates the web request that triggered the fetch event, and 
checks to see if it's available in the cache. It then either responds with the cached version, or uses fetch
 to get a copy from the network. The response is passed back to the web page with e.respondWith()...
 If you're not seeing the [ServiceWorker] logging in the console, be sure you've changed the cacheName variable
  and that you're inspecting the right service worker by opening the Service Worker pane in the 
  Applications panel and clicking inspect on the running service worker. If that doesn't work, see the section 
  on Tips for testing live service workers.
  */
// the app at this point is now OFFline capable.  (:


/* 
Beware of the edge cases As previously mentioned, this code must not be used 
in production because of the many unhandled edge cases.

Beware of cache-first strategies in production

Our app uses a cache-first strategy, which results in a copy of any cached content being 
returned without consulting the network. While a cache-first strategy is easy to implement, 
it can cause challenges in the future. Once the copy of the host page and service worker registration
is cached, it can be extremely difficult to change the configuration of the service worker 
(since the configuration depends on where it was defined), and you could find yourself deploying
sites that are extremely difficult to update!

How do I avoid these edge cases?

So how do we avoid these edge cases? Use a library like sw-precache, which provides fine con
over what gets expired, ensures requests go directly to the network and handles all of the hard
 work for you. 

 Tips for testing live service workers

Debugging service workers can be a challenge, and when it involves caching, things can become even 
more of a nightmare if the cache isn't updated when you expect it. Between the typical service worker 
life cycle and bug in your code, you may become quickly frustrated. But don't. There are some tools you 
can use to make your life easier.

Start Fresh

In some cases, you may find yourself loading cached data or that things aren't updated as you expect. 
To clear all saved data (localStoarge, indexedDB data, cached files) and remove any service workers, 
use the Clear storage pane in the Application tab.

Some other tips:

Once a service worker has been unregistered, it may remain listed until its containing browser window is closed.
If multiple windows to your app are open, the new service worker will not take effect until they've all
 been reloaded and updated to the latest service worker.  
Unregistering a service worker does not clear the cache, so it may be possible you'll still get old 
 data if the cache name hasn't changed.
If a service worker exists and a new service worker is registered, the new service worker won't take 
 control until the page is reloaded, unless you take immediate control.

*/




