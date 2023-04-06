(function(f) {
    if (typeof exports === "object" && typeof module !== "undefined") { module.exports = f() } else if (typeof define === "function" && define.amd) { define([], f) } else {
        var g;
        if (typeof window !== "undefined") { g = window } else if (typeof global !== "undefined") { g = global } else if (typeof self !== "undefined") { g = self } else { g = this }
        g.DualScaleControl = f()
    }
})(function() {
    var define, module, exports;
    return (function() {
        function r(e, n, t) {
            function o(i, f) {
                if (!n[i]) {
                    if (!e[i]) { var c = "function" == typeof require && require; if (!f && c) return c(i, !0); if (u) return u(i, !0); var a = new Error("Cannot find module '" + i + "'"); throw a.code = "MODULE_NOT_FOUND", a }
                    var p = n[i] = { exports: {} };
                    e[i][0].call(p.exports, function(r) { var n = e[i][1][r]; return o(n || r) }, p, p.exports, r, e, n, t)
                }
                return n[i].exports
            }
            for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) o(t[i]);
            return o
        }
        return r
    })()({
        1: [function(require, module, exports) {
            /*
             * Copyright (C) 2008 Apple Inc. All Rights Reserved.
             *
             * Redistribution and use in source and binary forms, with or without
             * modification, are permitted provided that the following conditions
             * are met:
             * 1. Redistributions of source code must retain the above copyright
             *    notice, this list of conditions and the following disclaimer.
             * 2. Redistributions in binary form must reproduce the above copyright
             *    notice, this list of conditions and the following disclaimer in the
             *    documentation and/or other materials provided with the distribution.
             *
             * THIS SOFTWARE IS PROVIDED BY APPLE INC. ``AS IS'' AND ANY
             * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
             * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
             * PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL APPLE INC. OR
             * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
             * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
             * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
             * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
             * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
             * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
             * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
             *
             * Ported from Webkit
             * http://svn.webkit.org/repository/webkit/trunk/Source/WebCore/platform/graphics/UnitBezier.h
             */

            module.exports = UnitBezier;

            function UnitBezier(p1x, p1y, p2x, p2y) {
                // Calculate the polynomial coefficients, implicit first and last control points are (0,0) and (1,1).
                this.cx = 3.0 * p1x;
                this.bx = 3.0 * (p2x - p1x) - this.cx;
                this.ax = 1.0 - this.cx - this.bx;

                this.cy = 3.0 * p1y;
                this.by = 3.0 * (p2y - p1y) - this.cy;
                this.ay = 1.0 - this.cy - this.by;

                this.p1x = p1x;
                this.p1y = p2y;
                this.p2x = p2x;
                this.p2y = p2y;
            }

            UnitBezier.prototype.sampleCurveX = function(t) {
                // `ax t^3 + bx t^2 + cx t' expanded using Horner's rule.
                return ((this.ax * t + this.bx) * t + this.cx) * t;
            };

            UnitBezier.prototype.sampleCurveY = function(t) {
                return ((this.ay * t + this.by) * t + this.cy) * t;
            };

            UnitBezier.prototype.sampleCurveDerivativeX = function(t) {
                return (3.0 * this.ax * t + 2.0 * this.bx) * t + this.cx;
            };

            UnitBezier.prototype.solveCurveX = function(x, epsilon) {
                if (typeof epsilon === 'undefined') epsilon = 1e-6;

                var t0, t1, t2, x2, i;

                // First try a few iterations of Newton's method -- normally very fast.
                for (t2 = x, i = 0; i < 8; i++) {

                    x2 = this.sampleCurveX(t2) - x;
                    if (Math.abs(x2) < epsilon) return t2;

                    var d2 = this.sampleCurveDerivativeX(t2);
                    if (Math.abs(d2) < 1e-6) break;

                    t2 = t2 - x2 / d2;
                }

                // Fall back to the bisection method for reliability.
                t0 = 0.0;
                t1 = 1.0;
                t2 = x;

                if (t2 < t0) return t0;
                if (t2 > t1) return t1;

                while (t0 < t1) {

                    x2 = this.sampleCurveX(t2);
                    if (Math.abs(x2 - x) < epsilon) return t2;

                    if (x > x2) {
                        t0 = t2;
                    } else {
                        t1 = t2;
                    }

                    t2 = (t1 - t0) * 0.5 + t0;
                }

                // Failure.
                return t2;
            };

            UnitBezier.prototype.solve = function(x, epsilon) {
                return this.sampleCurveY(this.solveCurveX(x, epsilon));
            };

        }, {}],
        2: [function(require, module, exports) {
            'use strict';
            //      

            /**
             * A coordinate is a column, row, zoom combination, often used
             * as the data component of a tile.
             *
             * @param {number} column
             * @param {number} row
             * @param {number} zoom
             * @private
             */
            var Coordinate = function Coordinate(column, row, zoom) {
                this.column = column;
                this.row = row;
                this.zoom = zoom;
            };

            /**
             * Create a clone of this coordinate that can be mutated without
             * changing the original coordinate
             *
             * @returns {Coordinate} clone
             * @private
             * var coord = new Coordinate(0, 0, 0);
             * var c2 = coord.clone();
             * // since coord is cloned, modifying a property of c2 does
             * // not modify it.
             * c2.zoom = 2;
             */
            Coordinate.prototype.clone = function clone() {
                return new Coordinate(this.column, this.row, this.zoom);
            };

            /**
             * Zoom this coordinate to a given zoom level. This returns a new
             * coordinate object, not mutating the old one.
             *
             * @param {number} zoom
             * @returns {Coordinate} zoomed coordinate
             * @private
             * @example
             * var coord = new Coordinate(0, 0, 0);
             * var c2 = coord.zoomTo(1);
             * c2 // equals new Coordinate(0, 0, 1);
             */
            Coordinate.prototype.zoomTo = function zoomTo(zoom) { return this.clone()._zoomTo(zoom); };

            /**
             * Subtract the column and row values of this coordinate from those
             * of another coordinate. The other coordinat will be zoomed to the
             * same level as `this` before the subtraction occurs
             *
             * @param {Coordinate} c other coordinate
             * @returns {Coordinate} result
             * @private
             */
            Coordinate.prototype.sub = function sub(c) { return this.clone()._sub(c); };

            Coordinate.prototype._zoomTo = function _zoomTo(zoom) {
                var scale = Math.pow(2, zoom - this.zoom);
                this.column *= scale;
                this.row *= scale;
                this.zoom = zoom;
                return this;
            };

            Coordinate.prototype._sub = function _sub(c) {
                c = c.zoomTo(this.zoom);
                this.column -= c.column;
                this.row -= c.row;
                return this;
            };

            module.exports = Coordinate;

        }, {}],
        3: [function(require, module, exports) {
            'use strict';

            /* eslint-env browser */
            module.exports = self;

        }, {}],
        4: [function(require, module, exports) {
            'use strict';

            var Point = require('point-geometry');
            var window = require('./window');

            exports.create = function(tagName, className, container) {
                var el = window.document.createElement(tagName);
                if (className) { el.className = className; }
                if (container) { container.appendChild(el); }
                return el;
            };

            var docStyle = window.document.documentElement.style;

            function testProp(props) {
                for (var i = 0; i < props.length; i++) {
                    if (props[i] in docStyle) {
                        return props[i];
                    }
                }
                return props[0];
            }

            var selectProp = testProp(['userSelect', 'MozUserSelect', 'WebkitUserSelect', 'msUserSelect']);
            var userSelect;
            exports.disableDrag = function() {
                if (selectProp) {
                    userSelect = docStyle[selectProp];
                    docStyle[selectProp] = 'none';
                }
            };
            exports.enableDrag = function() {
                if (selectProp) {
                    docStyle[selectProp] = userSelect;
                }
            };

            var transformProp = testProp(['transform', 'WebkitTransform']);
            exports.setTransform = function(el, value) {
                el.style[transformProp] = value;
            };

            // Suppress the next click, but only if it's immediate.
            function suppressClick(e) {
                e.preventDefault();
                e.stopPropagation();
                window.removeEventListener('click', suppressClick, true);
            }
            exports.suppressClick = function() {
                window.addEventListener('click', suppressClick, true);
                window.setTimeout(function() {
                    window.removeEventListener('click', suppressClick, true);
                }, 0);
            };

            exports.mousePos = function(el, e) {
                var rect = el.getBoundingClientRect();
                e = e.touches ? e.touches[0] : e;
                return new Point(
                    e.clientX - rect.left - el.clientLeft,
                    e.clientY - rect.top - el.clientTop
                );
            };

            exports.touchPos = function(el, e) {
                var rect = el.getBoundingClientRect(),
                    points = [];
                var touches = (e.type === 'touchend') ? e.changedTouches : e.touches;
                for (var i = 0; i < touches.length; i++) {
                    points.push(new Point(
                        touches[i].clientX - rect.left - el.clientLeft,
                        touches[i].clientY - rect.top - el.clientTop
                    ));
                }
                return points;
            };

            exports.remove = function(node) {
                if (node.parentNode) {
                    node.parentNode.removeChild(node);
                }
            };

        }, { "./window": 3, "point-geometry": 6 }],
        5: [function(require, module, exports) {
            'use strict';
            //      

            var UnitBezier = require('@mapbox/unitbezier');
            var Coordinate = require('../geo/coordinate');
            var Point = require('point-geometry');

            /**
             * Given a value `t` that varies between 0 and 1, return
             * an interpolation function that eases between 0 and 1 in a pleasing
             * cubic in-out fashion.
             *
             * @private
             */
            exports.easeCubicInOut = function(t) {
                if (t <= 0) { return 0; }
                if (t >= 1) { return 1; }
                var t2 = t * t,
                    t3 = t2 * t;
                return 4 * (t < 0.5 ? t3 : 3 * (t - t2) + t3 - 0.75);
            };

            /**
             * Given given (x, y), (x1, y1) control points for a bezier curve,
             * return a function that interpolates along that curve.
             *
             * @param p1x control point 1 x coordinate
             * @param p1y control point 1 y coordinate
             * @param p2x control point 2 x coordinate
             * @param p2y control point 2 y coordinate
             * @private
             */
            exports.bezier = function(p1x, p1y, p2x, p2y) {
                var bezier = new UnitBezier(p1x, p1y, p2x, p2y);
                return function(t) {
                    return bezier.solve(t);
                };
            };

            /**
             * A default bezier-curve powered easing function with
             * control points (0.25, 0.1) and (0.25, 1)
             *
             * @private
             */
            exports.ease = exports.bezier(0.25, 0.1, 0.25, 1);

            /**
             * constrain n to the given range via min + max
             *
             * @param n value
             * @param min the minimum value to be returned
             * @param max the maximum value to be returned
             * @returns the clamped value
             * @private
             */
            exports.clamp = function(n, min, max) {
                return Math.min(max, Math.max(min, n));
            };

            /**
             * constrain n to the given range, excluding the minimum, via modular arithmetic
             *
             * @param n value
             * @param min the minimum value to be returned, exclusive
             * @param max the maximum value to be returned, inclusive
             * @returns constrained number
             * @private
             */
            exports.wrap = function(n, min, max) {
                var d = max - min;
                var w = ((n - min) % d + d) % d + min;
                return (w === min) ? max : w;
            };

            /*
             * Call an asynchronous function on an array of arguments,
             * calling `callback` with the completed results of all calls.
             *
             * @param array input to each call of the async function.
             * @param fn an async function with signature (data, callback)
             * @param callback a callback run after all async work is done.
             * called with an array, containing the results of each async call.
             * @private
             */
            exports.asyncAll = function(array, fn, callback) {
                if (!array.length) { return callback(null, []); }
                var remaining = array.length;
                var results = new Array(array.length);
                var error = null;
                array.forEach(function(item, i) {
                    fn(item, function(err, result) {
                        if (err) { error = err; }
                        results[i] = result;
                        if (--remaining === 0) { callback(error, results); }
                    });
                });
            };

            /*
             * Polyfill for Object.values. Not fully spec compliant, but we don't
             * need it to be.
             *
             * @private
             */
            exports.values = function(obj) {
                var result = [];
                for (var k in obj) {
                    result.push(obj[k]);
                }
                return result;
            };

            /*
             * Compute the difference between the keys in one object and the keys
             * in another object.
             *
             * @returns keys difference
             * @private
             */
            exports.keysDifference = function(obj, other) {
                var difference = [];
                for (var i in obj) {
                    if (!(i in other)) {
                        difference.push(i);
                    }
                }
                return difference;
            };

            /**
             * Given a destination object and optionally many source objects,
             * copy all properties from the source objects into the destination.
             * The last source object given overrides properties from previous
             * source objects.
             *
             * @param dest destination object
             * @param {...Object} sources sources from which properties are pulled
             * @private
             */
            // eslint-disable-next-line no-unused-vars
            exports.extend = function(dest, source0, source1, source2) {
                var arguments$1 = arguments;

                for (var i = 1; i < arguments.length; i++) {
                    var src = arguments$1[i];
                    for (var k in src) {
                        dest[k] = src[k];
                    }
                }
                return dest;
            };

            /**
             * Given an object and a number of properties as strings, return version
             * of that object with only those properties.
             *
             * @param src the object
             * @param properties an array of property names chosen
             * to appear on the resulting object.
             * @returns object with limited properties.
             * @example
             * var foo = { name: 'Charlie', age: 10 };
             * var justName = pick(foo, ['name']);
             * // justName = { name: 'Charlie' }
             * @private
             */
            exports.pick = function(src, properties) {
                var result = {};
                for (var i = 0; i < properties.length; i++) {
                    var k = properties[i];
                    if (k in src) {
                        result[k] = src[k];
                    }
                }
                return result;
            };

            var id = 1;

            /**
             * Return a unique numeric id, starting at 1 and incrementing with
             * each call.
             *
             * @returns unique numeric id.
             * @private
             */
            exports.uniqueId = function() {
                return id++;
            };

            /**
             * Given an array of member function names as strings, replace all of them
             * with bound versions that will always refer to `context` as `this`. This
             * is useful for classes where otherwise event bindings would reassign
             * `this` to the evented object or some other value: this lets you ensure
             * the `this` value always.
             *
             * @param fns list of member function names
             * @param context the context value
             * @example
             * function MyClass() {
             *   bindAll(['ontimer'], this);
             *   this.name = 'Tom';
             * }
             * MyClass.prototype.ontimer = function() {
             *   alert(this.name);
             * };
             * var myClass = new MyClass();
             * setTimeout(myClass.ontimer, 100);
             * @private
             */
            exports.bindAll = function(fns, context) {
                fns.forEach(function(fn) {
                    if (!context[fn]) { return; }
                    context[fn] = context[fn].bind(context);
                });
            };

            /**
             * Given a list of coordinates, get their center as a coordinate.
             *
             * @returns centerpoint
             * @private
             */
            exports.getCoordinatesCenter = function(coords) {
                var minX = Infinity;
                var minY = Infinity;
                var maxX = -Infinity;
                var maxY = -Infinity;

                for (var i = 0; i < coords.length; i++) {
                    minX = Math.min(minX, coords[i].column);
                    minY = Math.min(minY, coords[i].row);
                    maxX = Math.max(maxX, coords[i].column);
                    maxY = Math.max(maxY, coords[i].row);
                }

                var dx = maxX - minX;
                var dy = maxY - minY;
                var dMax = Math.max(dx, dy);
                var zoom = Math.max(0, Math.floor(-Math.log(dMax) / Math.LN2));
                return new Coordinate((minX + maxX) / 2, (minY + maxY) / 2, 0)
                    .zoomTo(zoom);
            };

            /**
             * Determine if a string ends with a particular substring
             *
             * @private
             */
            exports.endsWith = function(string, suffix) {
                return string.indexOf(suffix, string.length - suffix.length) !== -1;
            };

            /**
             * Create an object by mapping all the values of an existing object while
             * preserving their keys.
             *
             * @private
             */
            exports.mapObject = function(input, iterator, context) {
                var this$1 = this;

                var output = {};
                for (var key in input) {
                    output[key] = iterator.call(context || this$1, input[key], key, input);
                }
                return output;
            };

            /**
             * Create an object by filtering out values of an existing object.
             *
             * @private
             */
            exports.filterObject = function(input, iterator, context) {
                var this$1 = this;

                var output = {};
                for (var key in input) {
                    if (iterator.call(context || this$1, input[key], key, input)) {
                        output[key] = input[key];
                    }
                }
                return output;
            };

            /**
             * Deeply compares two object literals.
             *
             * @private
             */
            exports.deepEqual = function(a, b) {
                if (Array.isArray(a)) {
                    if (!Array.isArray(b) || a.length !== b.length) { return false; }
                    for (var i = 0; i < a.length; i++) {
                        if (!exports.deepEqual(a[i], b[i])) { return false; }
                    }
                    return true;
                }
                if (typeof a === 'object' && a !== null && b !== null) {
                    if (!(typeof b === 'object')) { return false; }
                    var keys = Object.keys(a);
                    if (keys.length !== Object.keys(b).length) { return false; }
                    for (var key in a) {
                        if (!exports.deepEqual(a[key], b[key])) { return false; }
                    }
                    return true;
                }
                return a === b;
            };

            /**
             * Deeply clones two objects.
             *
             * @private
             */
            exports.clone = function(input) {
                if (Array.isArray(input)) {
                    return input.map(exports.clone);
                } else if (typeof input === 'object' && input) {
                    return ((exports.mapObject(input, exports.clone)));
                } else {
                    return input;
                }
            };

            /**
             * Check if two arrays have at least one common element.
             *
             * @private
             */
            exports.arraysIntersect = function(a, b) {
                for (var l = 0; l < a.length; l++) {
                    if (b.indexOf(a[l]) >= 0) { return true; }
                }
                return false;
            };

            /**
             * Print a warning message to the console and ensure duplicate warning messages
             * are not printed.
             *
             * @private
             */
            var warnOnceHistory = {};
            exports.warnOnce = function(message) {
                if (!warnOnceHistory[message]) {
                    // console isn't defined in some WebWorkers, see #2558
                    if (typeof console !== "undefined") { console.warn(message); }
                    warnOnceHistory[message] = true;
                }
            };

            /**
             * Indicates if the provided Points are in a counter clockwise (true) or clockwise (false) order
             *
             * @returns true for a counter clockwise set of points
             */
            // http://bryceboe.com/2006/10/23/line-segment-intersection-algorithm/
            exports.isCounterClockwise = function(a, b, c) {
                return (c.y - a.y) * (b.x - a.x) > (b.y - a.y) * (c.x - a.x);
            };

            /**
             * Returns the signed area for the polygon ring.  Postive areas are exterior rings and
             * have a clockwise winding.  Negative areas are interior rings and have a counter clockwise
             * ordering.
             *
             * @param ring Exterior or interior ring
             */
            exports.calculateSignedArea = function(ring) {
                var sum = 0;
                for (var i = 0, len = ring.length, j = len - 1, p1 = (void 0), p2 = (void 0); i < len; j = i++) {
                    p1 = ring[i];
                    p2 = ring[j];
                    sum += (p2.x - p1.x) * (p1.y + p2.y);
                }
                return sum;
            };

            /**
             * Detects closed polygons, first + last point are equal
             *
             * @param points array of points
             * @return true if the points are a closed polygon
             */
            exports.isClosedPolygon = function(points) {
                // If it is 2 points that are the same then it is a point
                // If it is 3 points with start and end the same then it is a line
                if (points.length < 4) { return false; }

                var p1 = points[0];
                var p2 = points[points.length - 1];

                if (Math.abs(p1.x - p2.x) > 0 ||
                    Math.abs(p1.y - p2.y) > 0) {
                    return false;
                }

                // polygon simplification can produce polygons with zero area and more than 3 points
                return (Math.abs(exports.calculateSignedArea(points)) > 0.01);
            };

            /**
             * Converts spherical coordinates to cartesian coordinates.
             *
             * @param spherical Spherical coordinates, in [radial, azimuthal, polar]
             * @return cartesian coordinates in [x, y, z]
             */

            exports.sphericalToCartesian = function(spherical) {
                var r = spherical[0];
                var azimuthal = spherical[1],
                    polar = spherical[2];
                // We abstract "north"/"up" (compass-wise) to be 0° when really this is 90° (π/2):
                // correct for that here
                azimuthal += 90;

                // Convert azimuthal and polar angles to radians
                azimuthal *= Math.PI / 180;
                polar *= Math.PI / 180;

                // spherical to cartesian (x, y, z)
                return [
                    r * Math.cos(azimuthal) * Math.sin(polar),
                    r * Math.sin(azimuthal) * Math.sin(polar),
                    r * Math.cos(polar)
                ];
            };

            /**
             * Parses data from 'Cache-Control' headers.
             *
             * @param cacheControl Value of 'Cache-Control' header
             * @return object containing parsed header info.
             */

            exports.parseCacheControl = function(cacheControl) {
                // Taken from [Wreck](https://github.com/hapijs/wreck)
                var re = /(?:^|(?:\s*\,\s*))([^\x00-\x20\(\)<>@\,;\:\\"\/\[\]\?\=\{\}\x7F]+)(?:\=(?:([^\x00-\x20\(\)<>@\,;\:\\"\/\[\]\?\=\{\}\x7F]+)|(?:\"((?:[^"\\]|\\.)*)\")))?/g;

                var header = {};
                cacheControl.replace(re, function($0, $1, $2, $3) {
                    var value = $2 || $3;
                    header[$1] = value ? value.toLowerCase() : true;
                    return '';
                });

                if (header['max-age']) {
                    var maxAge = parseInt(header['max-age'], 10);
                    if (isNaN(maxAge)) { delete header['max-age']; } else { header['max-age'] = maxAge; }
                }

                return header;
            };

        }, { "../geo/coordinate": 2, "@mapbox/unitbezier": 1, "point-geometry": 6 }],
        6: [function(require, module, exports) {
            'use strict';

            module.exports = Point;

            function Point(x, y) {
                this.x = x;
                this.y = y;
            }

            Point.prototype = {
                clone: function() { return new Point(this.x, this.y); },

                add: function(p) { return this.clone()._add(p); },
                sub: function(p) { return this.clone()._sub(p); },
                mult: function(k) { return this.clone()._mult(k); },
                div: function(k) { return this.clone()._div(k); },
                rotate: function(a) { return this.clone()._rotate(a); },
                matMult: function(m) { return this.clone()._matMult(m); },
                unit: function() { return this.clone()._unit(); },
                perp: function() { return this.clone()._perp(); },
                round: function() { return this.clone()._round(); },

                mag: function() {
                    return Math.sqrt(this.x * this.x + this.y * this.y);
                },

                equals: function(p) {
                    return this.x === p.x &&
                        this.y === p.y;
                },

                dist: function(p) {
                    return Math.sqrt(this.distSqr(p));
                },

                distSqr: function(p) {
                    var dx = p.x - this.x,
                        dy = p.y - this.y;
                    return dx * dx + dy * dy;
                },

                angle: function() {
                    return Math.atan2(this.y, this.x);
                },

                angleTo: function(b) {
                    return Math.atan2(this.y - b.y, this.x - b.x);
                },

                angleWith: function(b) {
                    return this.angleWithSep(b.x, b.y);
                },

                // Find the angle of the two vectors, solving the formula for the cross product a x b = |a||b|sin(θ) for θ.
                angleWithSep: function(x, y) {
                    return Math.atan2(
                        this.x * y - this.y * x,
                        this.x * x + this.y * y);
                },

                _matMult: function(m) {
                    var x = m[0] * this.x + m[1] * this.y,
                        y = m[2] * this.x + m[3] * this.y;
                    this.x = x;
                    this.y = y;
                    return this;
                },

                _add: function(p) {
                    this.x += p.x;
                    this.y += p.y;
                    return this;
                },

                _sub: function(p) {
                    this.x -= p.x;
                    this.y -= p.y;
                    return this;
                },

                _mult: function(k) {
                    this.x *= k;
                    this.y *= k;
                    return this;
                },

                _div: function(k) {
                    this.x /= k;
                    this.y /= k;
                    return this;
                },

                _unit: function() {
                    this._div(this.mag());
                    return this;
                },

                _perp: function() {
                    var y = this.y;
                    this.y = this.x;
                    this.x = -y;
                    return this;
                },

                _rotate: function(angle) {
                    var cos = Math.cos(angle),
                        sin = Math.sin(angle),
                        x = cos * this.x - sin * this.y,
                        y = sin * this.x + cos * this.y;
                    this.x = x;
                    this.y = y;
                    return this;
                },

                _round: function() {
                    this.x = Math.round(this.x);
                    this.y = Math.round(this.y);
                    return this;
                }
            };

            // constructs Point from an array if necessary
            Point.convert = function(a) {
                if (a instanceof Point) {
                    return a;
                }
                if (Array.isArray(a)) {
                    return new Point(a[0], a[1]);
                }
                return a;
            };

        }, {}],
        7: [function(require, module, exports) {
            //adapted from https://github.com/mapbox/mapbox-gl-js/blob/061fdb514a33cf9b2b542a1c7bd433c166da917e/src/ui/control/scale_control.js#L19-L52

            'use strict';

            var DOM = require('mapbox-gl/src/util/dom');
            var util = require('mapbox-gl/src/util/util');

            /**
             * A `ScaleControl` control displays the ratio of a distance on the map to the corresponding distance on the ground.
             *
             * @implements {IControl}
             * @param {Object} [options]
             * @param {number} [options.maxWidth='150'] The maximum length of the scale control in pixels.
             * @example
             * map.addControl(new ScaleControl({
             *     maxWidth: 80
             * }));
             */
            var DualScaleControl = function DualScaleControl(options) {
                this.options = options;

                util.bindAll([
                    '_onMove', '_onMouseMove'
                ], this);
            };

            DualScaleControl.prototype.getDefaultPosition = function getDefaultPosition() {
                return 'bottom-left';
            };

            DualScaleControl.prototype._onMove = function _onMove() {
                updateScale(this._map, this._metricContainer, this._imperialContainer, this.options);
            };

            DualScaleControl.prototype._onMouseMove = function _onMouseMove(e) {
                // console.log(e.lngLat)
                updatePosition(this._map, this._positionContainer, e.lngLat);
            };

            DualScaleControl.prototype.onAdd = function onAdd(map) {
                this._map = map;
                this._container = DOM.create('div', 'mapboxgl-ctrl mapboxgl-ctrl-scale maphubs-ctrl-scale', map.getContainer());
                this._positionContainer = DOM.create('div', 'map-position', this._container);
                this._metricContainer = DOM.create('div', 'metric-scale', this._container);
                this._imperialContainer = DOM.create('div', 'imperial-scale', this._container);

                this._map.on('move', this._onMove);
                this._onMove();

                this._map.on('mousemove', this._onMouseMove);
                //this._onMouseMove(this._map.getCenter()); //start at center

                return this._container;
            };

            DualScaleControl.prototype.onRemove = function onRemove() {
                this._container.parentNode.removeChild(this._container);
                this._map.off('move', this._onMove);
                this._map.off('mousemove', this._onMouseMove);
                this._map = undefined;
            };

            module.exports = DualScaleControl;


            function updatePosition(map, container, lngLat) {
                var lat = lngLat.lat.toFixed(3);
                var lng = lngLat.lng.toFixed(3);
                container.innerHTML = '<span>Latitude</span>' + lat + '<span style="margin-left:10px" >Longitude</span>' + lng;
            }

            function updateScale(map, metricContainer, imperialContainer, options) {
                // A horizontal scale is imagined to be present at center of the map
                // container with maximum length (Default) as 100px.
                // Using spherical law of cosines approximation, the real distance is
                // found between the two coordinates.
                var maxWidth = options && options.maxWidth || 100;

                var y = map._container.clientHeight / 2;
                var maxMeters = getDistance(map.unproject([0, y]), map.unproject([maxWidth, y]));
                // The real distance corresponding to 100px scale length is rounded off to
                // near pretty number and the scale length for the same is found out.
                // Default unit of the scale is based on User's locale.
                var maxFeet = 3.2808 * maxMeters;
                if (maxFeet > 5280) {
                    var maxMiles = maxFeet / 5280;
                    setScale(imperialContainer, maxWidth, maxMiles, 'miles');
                } else {
                    setScale(imperialContainer, maxWidth, maxFeet, 'ft');
                }
                setScale(metricContainer, maxWidth, maxMeters, 'm');

            }

            function setScale(container, maxWidth, maxDistance, unit) {
                var distance = getRoundNum(maxDistance);
                var ratio = distance / maxDistance;

                if (unit === 'm' && distance >= 1000) {
                    distance = distance / 1000;
                    unit = 'kilometers';
                }

                container.style.width = (maxWidth * ratio) + "px";
                container.innerHTML = distance + ' ' + unit;
            }

            function getDistance(latlng1, latlng2) {
                // Uses spherical law of cosines approximation.
                var R = 6371000;

                var rad = Math.PI / 180,
                    lat1 = latlng1.lat * rad,
                    lat2 = latlng2.lat * rad,
                    a = Math.sin(lat1) * Math.sin(lat2) +
                    Math.cos(lat1) * Math.cos(lat2) * Math.cos((latlng2.lng - latlng1.lng) * rad);

                var maxMeters = R * Math.acos(Math.min(a, 1));
                return maxMeters;

            }

            function getRoundNum(num) {
                var pow10 = Math.pow(10, (("" + (Math.floor(num)))).length - 1);
                var d = num / pow10;

                d = d >= 10 ? 10 :
                    d >= 5 ? 5 :
                    d >= 3 ? 3 :
                    d >= 2 ? 2 : 1;

                return pow10 * d;
            }

        }, { "mapbox-gl/src/util/dom": 4, "mapbox-gl/src/util/util": 5 }]
    }, {}, [7])(7)
});