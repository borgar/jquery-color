/*
 * jQuery Color Animations
 * Copyright 2007 John Resig
 * Released under the MIT and GPL licenses.
 *
 * RGBA support by Mehdi Kabab <http://pioupioum.fr>
 */

(function(jQuery){
    jQuery.extend(jQuery.support, {
        "rgba": supportsRGBA()
    });

    // We override the animation for all of these color styles
    jQuery.each(['backgroundColor', 'borderBottomColor', 'borderLeftColor', 'borderRightColor', 'borderTopColor', 'color', 'outlineColor'], function(i,attr){
        jQuery.fx.step[attr] = function(fx){
            var tuples = [];
            if ( !fx.colorInit ) {
                fx.start = getColor( fx.elem, attr );
                fx.end = getRGB( fx.end );
                fx.alphavalue = {
                    start: 4 === fx.start.length,
                    end:   4 === fx.end.length
                };
                if ( !fx.alphavalue.start ) {
                    fx.start.push( 1 );
                }
                if ( !fx.alphavalue.end ) {
                    fx.end.push( 1 );
                }
                // RGB => RGBA, RGBA => RGBA, RGBA => RGB
                if ( jQuery.support.rgba && ( fx.alphavalue.start || fx.alphavalue.end ) ) {
                    fx.colorModel = 'rgba';
                } else {
                    fx.colorModel = 'rgb';
                }
                fx.colorInit = true;
            }

            tuples.push( Math.max(Math.min( parseInt( (fx.pos * (fx.end[0] - fx.start[0])) + fx.start[0], 10), 255), 0) ); // R
            tuples.push( Math.max(Math.min( parseInt( (fx.pos * (fx.end[1] - fx.start[1])) + fx.start[1], 10), 255), 0) ); // G
            tuples.push( Math.max(Math.min( parseInt( (fx.pos * (fx.end[2] - fx.start[2])) + fx.start[2], 10), 255), 0) ); // B

            if ( fx.colorModel == 'rgba' ) {
                // Alpha
                tuples.push( Math.max(Math.min( parseFloat((fx.pos * (fx.end[3] - fx.start[3])) + fx.start[3]), 1), 0).toFixed(2) );
            }

            fx.elem.style[attr] = fx.colorModel + "(" + tuples.join(",") + ")";
        };
    });

    // Color Conversion functions from highlightFade
    // By Blair Mitchelmore
    // http://jquery.offput.ca/highlightFade/

    // Parse strings looking for color tuples [255,255,255[,1]]
    function getRGB ( color ) {
        var ret, rgb;

        // Check if we're already dealing with an array of colors
        if ( $.isArray( color ) && ( color.length === 4 || color.length === 3 ) ) {
            return color;
        }

        color = color.replace( /\s+/g, '' );

        // Look for #a0b1c2, #fff
        if ( rgb = /^#(?=.{3,6}$)([a-f\d]{1,2})([a-f\d]{1,2})([a-f\d]{1,2})$/i.exec( color ) ) {
            ret = [ parseInt( rgb[1], 16 ), 
                    parseInt( rgb[2], 16 ),
                    parseInt( rgb[3], 16 ) ];
            if ( rgb[0].length === 4 ) {
                ret = $.map(ret, function ( m ) { return m * 17; });
            }
            return ret;
        }

        // Look for rgb[a](num,num,num[,num]) / rgb[a](num%,num%,num%[,num])
        var rgb = /^rgb(a?)\((\d+)(%?),(\d+)(%?),(\d+)(%?)(?:,(1(?:\.00?)?|0?\.\d+))?\)$/.exec( color );
        if ( rgb && ( rgb[3] === rgb[5] && rgb[3] === rgb[7] ) && !(!rgb[1] && rgb[8]) ) {
            var ret = [ parseInt( rgb[2], 10 ),
                        parseInt( rgb[4], 10 ),
                        parseInt( rgb[6], 10 ) ];
            if ( rgb[3] === '%' ) {
                ret = $.map(ret, function ( m ) { return m * 255 / 100; });
            }
            if ( rgb[1] && rgb[8] ) {
                ret.push( parseFloat( rgb[8] ) );
            }
            return ret;
        }

        // Are we dealing with a named color?
        return ( colors[ color ] || colors[ 'transparent' ] ).concat();
    }


    function getColor(elem, attr) {
        var color;

        do {
            color = jQuery.curCSS(elem, attr);

            // Keep going until we find an element that has color, or we hit the body
            if ( color != '' && color != 'transparent' || jQuery.nodeName(elem, "body") )
                break;

            attr = "backgroundColor";
        } while ( elem = elem.parentNode );

        return getRGB(color);
    };

    function supportsRGBA() {
        var $script = jQuery('script:first'),
            color = $script.css('color'),
            result = false;
        if (/^rgba/.test(color)) {
                result = true;
        } else {
            try {
                result = ( color != $script.css('color', 'rgba(0, 0, 0, 0.5)').css('color') );
                $script.css('color', color);
            } catch (e) {};
        }

        return result;
    };

    // Some named colors to work with
    // From Interface by Stefan Petre
    // http://interface.eyecon.ro/

    var colors = {
        aqua:[0,255,255],
        azure:[240,255,255],
        beige:[245,245,220],
        black:[0,0,0],
        blue:[0,0,255],
        brown:[165,42,42],
        cyan:[0,255,255],
        darkblue:[0,0,139],
        darkcyan:[0,139,139],
        darkgrey:[169,169,169],
        darkgreen:[0,100,0],
        darkkhaki:[189,183,107],
        darkmagenta:[139,0,139],
        darkolivegreen:[85,107,47],
        darkorange:[255,140,0],
        darkorchid:[153,50,204],
        darkred:[139,0,0],
        darksalmon:[233,150,122],
        darkviolet:[148,0,211],
        fuchsia:[255,0,255],
        gold:[255,215,0],
        green:[0,128,0],
        indigo:[75,0,130],
        khaki:[240,230,140],
        lightblue:[173,216,230],
        lightcyan:[224,255,255],
        lightgreen:[144,238,144],
        lightgrey:[211,211,211],
        lightpink:[255,182,193],
        lightyellow:[255,255,224],
        lime:[0,255,0],
        magenta:[255,0,255],
        maroon:[128,0,0],
        navy:[0,0,128],
        olive:[128,128,0],
        orange:[255,165,0],
        pink:[255,192,203],
        purple:[128,0,128],
        violet:[128,0,128],
        red:[255,0,0],
        silver:[192,192,192],
        white:[255,255,255],
        yellow:[255,255,0],
        transparent: ( jQuery.support.rgba ) ? [0,0,0,0] : [255,255,255]
    };

})(jQuery);
