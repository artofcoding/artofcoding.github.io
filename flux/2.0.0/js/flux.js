/*
 * Flux.
 * Copyright (C) 2011 art of coding, http://www.art-of-coding.eu.
 */
FLUX = {
    
    // URL for APIs
    API_URL_PREFIX: "http://api.art-of-coding.eu",
        
    // Version of this library.
    VERSION: {
        FLUX: "2.0.0",
        JQUERY: "1.4.4",
        ADMINTASIA: "2.1",
    },
        
    /*
     * Create and return a XMLHttpRequest object.
     */
    makeHttpRequest: function() {
        if (window.XMLHttpRequest) {
            return new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            return new ActiveXObject("MsXml2.XmlHttp");
        }
    },
    
    /*
     * Get a page with asynchronous HTTP request. Uses this.includeJavaScript().
     * @param url URL to fetch.
     */
    ajaxPage: function(url) {
        var xmlHttp = this.getHttpRequest();
        xmlHttp.onReadyStateChange = function() {
            if (xmlHttp.readyState == 4) {
                if (xmlHttp.status == 200 || xmlHttp.status == 304) {
                    this.includeJavaScript(xmlHttp.responseText);
                } else {
                    alert('XML request error with ' + url + ': ' + xmlHttp.statusText + ' (' + xmlHttp.status + ')');
                }
            }
        }
        xmlHttp.open('GET', url, true);
        xmlHttp.send(null);
    },
    
    /*
     * Include a JavaScript as source code in the page.
     * @param url The URL the source was fetched from.
     * @param source Source code to include in a script tag.
     */
    includeJavaScript: function(source) {
        if (source != null) {
            var script = document.createElement("script");
            script.language = "JavaScript";
            script.type = "text/javascript";
            //script.defer = true;
            script.text = source;
            var head = document.getElementsByTagName('head').item(0);
            head.appendChild(script);
        }
    },
    
    /*
     * Load a script.
     * @param url URL to load script from.
     */
    loadScript: function(url, callback) {
        var script = document.createElement('script');
        script.language = 'JavaScript';
        script.type = 'text/javascript';
        script.src = url;
        if (callback) {
            // IE
            script.onReadyStateChange = function() {
                if (this.readyState == 'loaded' || this.readyState == 'complete') callback();
            }
            // All other
            script.onload = function() {
                if (callback) callback();
            }
        }
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(script);
    },
    
    /*
     * Load all needed JavaScripts, starting at 'idx' and call 'callback' when finished.
     */
    loadScripts: function(scripts, idx, callback) {
        if (!idx) idx = 0;
        // Load next script
        if (idx < scripts.length) {
            //DEBUG console.log("FLUX.loadScripts: idx="+idx);
            FLUX.loadScript(scripts[idx], function() { FLUX.loadScripts(scripts, ++idx, callback) });
        } else {
            // We loaded all scripts, execute callback
            if (callback) callback();
        }
    },
    
    /*
     * Load JavaScripts needed to initialize Flux.
     * @param callback Callback to call when initialization has finished.
     */
    init: function(callback) {
        // Initialize UI after initialization completed
        var myCallback = function() {
            if (callback) callback();
            // Show page
            jQuery("#page_wrapper").show(); 
        };
        // Load jQuery
        this.loadScript(this.META.JQUERY_URL);
        // Load Flux scripts
        this.loadScript(this.META.FLUX_URL + "/flux.log.js");
        this.loadScript(this.META.FLUX_URL + "/flux.tools.js");
        this.loadScript(this.META.FLUX_URL + "/flux.fastms.js");
        this.loadScript(this.META.FLUX_URL + "/flux.ui.js", function() { FLUX.UI.init(myCallback); });
    },
    
}

/*
 * Flux Metadata.
 */
FLUX.META = {
    
    // URL prefix
    URL_PREFIX: FLUX.API_URL_PREFIX + "/flux",
    
    // URL to Flux libraries
    FLUX_URL: FLUX.API_URL_PREFIX + "/flux/" + FLUX.VERSION.FLUX + "/js",
    
    // Dependencies to other libraries
    JQUERY_URL: FLUX.API_URL_PREFIX + "/jquery/" + FLUX.VERSION.JQUERY + "/jquery.min.js",
    ADMINTASIA_URL: FLUX.API_URL_PREFIX + "/admintasia/" + FLUX.VERSION.ADMINTASIA + "/js",
    
}

FLUX.KEYCODE = {
    
    PASTE: 224
    
}
