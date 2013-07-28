
;(function( global, factory ){

    // CommonJS
    if ( typeof module === "object" && typeof module.exports === "object" ) {
        var jQuery = require('jQuery');
        module.exports = factory( jQuery );
    }
    // AMD
    else if ( typeof define === "function" && define.amd ) {
        define(['jQuery'], function (jQuery) {
            return factory( jQuery );
        });
    }
    // <script> Global var
    else {
        global.fishfork = global.fishfork || factory( global.jQuery );
    }

})(
    this,
    function( $ ){

        // Define
        var fishfork = function( targetURL, selectors, callback ){

            var dfd = $.Deferred()
              , selectorType = $.type( selectors );

            // Handle fishfork('http://ooxx.com').done(), fishfork('http://ooxx.com', callback), return ( html[String] );
            // - demo case 1: fishfork("http://www.aliexpress.com/").done(function( html ){ console.log(html); })
            // - demo case 2: fishfork("http://www.aliexpress.com/", function( html ){ console.log(html); })
            if ( arguments.length == 1 || selectorType == 'function' ) {
                return dfd.resolve( targetURL ).pipe( fetch ).done( selectors ).promise();
            }

            // HTML >> sizzleEl, return ( sizzleEl [el|elArray|elMap], htmlContent, targetURL, selectors )
            // - demo case 1: fishfork("http://www.aliexpress.com/", "a:eq(0)").done(function( ){ console.log(arguments); })
            // - demo case 2: fishfork("http://www.aliexpress.com/", "a:eq(0)", function( ){ console.log(arguments); })
            // - demo case 3: fishfork("http://www.aliexpress.com/", ["a:eq(0)", "span:eq(0)"]).done(function( ){ console.log(arguments); })
            // - demo case 4: fishfork("http://www.aliexpress.com/", ["a:eq(0)", "span:eq(0)"], function( ){ console.log(arguments); })
            // - demo case 5: fishfork("http://www.aliexpress.com/", { a:"a:eq(0)", span:"span:eq(0)" }).done(function( ){ console.log(arguments); })
            // - demo case 6: fishfork("http://www.aliexpress.com/", { a:"a:eq(0)", span:"span:eq(0)" }, function( ){ console.log(arguments); })
            fetch( targetURL ).done(function( html ){
                dfd.resolve(
                    {
                        'string' : queryNode,
                        'array'  : queryNodesArray,
                        'object' : queryNodesMap
                    } [ selectorType ] ( parseDOM( html ), selectors ),

                    html, targetURL, selectors
                );
            });
            return dfd.done( callback ).promise();
        };

        // Config
        fishfork.fetcherURL = 'module/fishfork.php';

        // Fetch the content of this URL
        function fetch( url ) {
            return $.get(
                fishfork.fetcherURL + 
                '?t=' + new Date().getTime() + 
                '&url=' + encodeURIComponent( url ) + 
                '&ua=' + encodeURIComponent( navigator.userAgent )
            );
        }

        // Trans HTML content string to DOM element
        function parseDOM( html ) {
            return $('<div>').append(
                html
                // Remove <scripts> to prevent it's execution.
                .replace(/<script(\s|>)[\S\s]+?<\/script>/gi,'')
                // Replace "src" attribute of <img> with "fishfork-src", in order to prevent image loading.
                .replace(/(<img[\s\r\n>]?[\s\S]*?[\s\r\n])(src="[^"]*?"(?:[\s\r\n>]|[\s\S]*?>))/gi,'\1fishfork-\2')
            );
        }

        // Query single selector
        function queryNode( el, selector ) {
            return el.find( selector );
        }

        // Query an Array of selectors
        function queryNodesArray( el, selectorsArr ) {
            var resArray = new Array( selectorsArr.length );
            $.each( selectorsArr, function( i, selector ){
                resArray[ i ] = el.find( selector );
            });
            return resArray;
        }

        // Query a Map of selectors
        function queryNodesMap( el, selectorsMap ) {
            var resMap = {};
            $.each( selectorsMap, function( k, selector ){
                resMap[ k ] = el.find( selector );
            });
            return resMap;
        }

        return fishfork;
    }
);
