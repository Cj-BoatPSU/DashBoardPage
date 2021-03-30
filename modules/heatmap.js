/*
 * heatmap.js v2.0.5 | JavaScript Heatmap Library
 *
 * Copyright 2008-2016 Patrick Wied <heatmapjs@patrick-wied.at> - All rights reserved.
 * Dual licensed under MIT and Beerware license 
 *
 * :: 2016-09-05 01:16
 */
;
(function(name, context, factory) {

    // Supports UMD. AMD, CommonJS/Node.js and browser context
    if (typeof module !== "undefined" && module.exports) {
        module.exports = factory();
    } else if (typeof define === "function" && define.amd) {
        define(factory);
    } else {
        context[name] = factory();
    }

})("h337", this, function() {

    // Heatmap Config stores default values and will be merged with instance config
    var HeatmapConfig = {
        defaultRadius: 40,
        defaultRenderer: 'canvas2d',
        defaultGradient: {
            // 0.067: "rgb(0,31,180)", //Dark-Indigo
            // 0.134: "rgb(0,68,204)", //Imperial-blue
            // 0.201: "rgb(0,116,231)", // Dark-blue
            // 0.268: "rgb(0,171,254)", //Medium-blue
            // 0.335: "rgb(0,212,255)", //Light-blue
            // 0.402: "rgb(0,255,255)", //Aqua
            // 0.67: "rgb(1,230,191)", //Dark-green
            // 0.69: "rgb(118,241,199)", //Meduim-green
            // 0.72: "rgb(179,255,216)", //Light-green
            // 0.75: "rgb(255,255,100)", //Yellow
            // 0.78: "rgb(255,221,51)", //Light-orange
            // 0.81: "rgb(255,191,1)", //medium-orange
            // 0.84: "rgb(255,150,1)", //Dark-orange
            // 0.87: "rgb(255,107,0)", //Orange
            // 0.90: "rgb(255,1,0)", //red
            // 0: "rgb(0,0,255)", //
            // 0.1: "rgb(64,85,178)", //20-22 
            // 0.2: "rgb(88,124,247)", //23-24
            // 0.3: "rgb(29,170,241)", //25-26
            // 0.4: "rgb(32,188,210)", //27-28
            // 0.5: "rgb(21,149,24136)", //29-30
            // 0.6: "rgb(45,154,45)", //31-32
            // 0.7: "rgb(140,192,81)", //33-34
            // 0.8: "rgb(253,193,47)", //35-36
            // 0.9: "rgb(253,151,40)", //37-38
            // 1: "rgb(255,0,0)", //39-40
            // 0.5: "rgb(64,85,178)", //20-22 
            // 0.575: "rgb(88,124,247)", //23-24
            // 0.625: "rgb(29,170,241)", //25-26
            // 0.675: "rgb(32,188,210)", //27-28
            // 0.725: "rgb(21,149,241)", //29-30
            // 0.775: "rgb(45,154,45)", //31-32
            // 0.825: "rgb(140,192,81)", //33-34
            // 0.875: "rgb(253,193,47)", //35-36
            // 0.925: "rgb(253,151,40)", //37-38
            // 1: "rgb(255,0,0)", //39-40
            0.5: "rgb(88,124,247)", //20-22 
            0.575: "rgb(1,126,254)", //23-24
            0.625: "rgb(29,170,241)", //25-26 //blue
            0.675: "rgb(58,181,74)", //27-28 //green
            0.725: "rgb(255,255,73)", //29-30
            0.775: "rgb(255,255,0)", //31-32
            0.825: "rgb(250,188,2)", //33-34
            0.875: "rgb(255,158,7)", //35-36
            0.925: "rgb(244,101,35)", //37-38
            1: "rgb(255,0,0)", //39-40
        },
        defaultMaxOpacity: 1,
        defaultMinOpacity: 0,
        defaultBlur: .85,
        defaultXField: 'x',
        defaultYField: 'y',
        defaultValueField: 'value',
        plugins: {}
    };
    var Store = (function StoreClosure() {

        var Store = function Store(config) {
            this._coordinator = {};
            this._data = [];
            this._radi = [];
            this._min = 10;
            this._max = 1;
            this._xField = config['xField'] || config.defaultXField;
            this._yField = config['yField'] || config.defaultYField;
            this._valueField = config['valueField'] || config.defaultValueField;

            if (config["radius"]) {
                this._cfgRadius = config["radius"];
            }
        };

        var defaultRadius = HeatmapConfig.defaultRadius;

        Store.prototype = {
            // when forceRender = false -> called from setData, omits renderall event
            _organiseData: function(dataPoint, forceRender) {
                var x = dataPoint[this._xField];
                var y = dataPoint[this._yField];
                var radi = this._radi;
                var store = this._data;
                var max = this._max;
                var min = this._min;
                var value = dataPoint[this._valueField] || 1;
                var radius = dataPoint.radius || this._cfgRadius || defaultRadius;

                if (!store[x]) {
                    store[x] = [];
                    radi[x] = [];
                }

                if (!store[x][y]) {
                    store[x][y] = value;
                    radi[x][y] = radius;
                } else {
                    store[x][y] += value;
                }
                var storedVal = store[x][y];

                if (storedVal > max) {
                    if (!forceRender) {
                        this._max = storedVal;
                    } else {
                        this.setDataMax(storedVal);
                    }
                    return false;
                } else if (storedVal < min) {
                    if (!forceRender) {
                        this._min = storedVal;
                    } else {
                        this.setDataMin(storedVal);
                    }
                    return false;
                } else {
                    return {
                        x: x,
                        y: y,
                        value: value,
                        radius: radius,
                        min: min,
                        max: max
                    };
                }
            },
            _unOrganizeData: function() {
                var unorganizedData = [];
                var data = this._data;
                var radi = this._radi;

                for (var x in data) {
                    for (var y in data[x]) {

                        unorganizedData.push({
                            x: x,
                            y: y,
                            radius: radi[x][y],
                            value: data[x][y]
                        });

                    }
                }
                return {
                    min: this._min,
                    max: this._max,
                    data: unorganizedData
                };
            },
            _onExtremaChange: function() {
                this._coordinator.emit('extremachange', {
                    min: this._min,
                    max: this._max
                });
            },
            addData: function() {
                if (arguments[0].length > 0) {
                    var dataArr = arguments[0];
                    var dataLen = dataArr.length;
                    while (dataLen--) {
                        this.addData.call(this, dataArr[dataLen]);
                    }
                } else {
                    // add to store  
                    var organisedEntry = this._organiseData(arguments[0], true);
                    if (organisedEntry) {
                        // if it's the first datapoint initialize the extremas with it
                        if (this._data.length === 0) {
                            this._min = this._max = organisedEntry.value;
                        }
                        this._coordinator.emit('renderpartial', {
                            min: this._min,
                            max: this._max,
                            data: [organisedEntry]
                        });
                    }
                }
                return this;
            },
            setData: function(data) {
                var dataPoints = data.data;
                var pointsLen = dataPoints.length;
                // console.log("===========access to setData===========");

                // reset data arrays
                this._data = [];
                this._radi = [];

                for (var i = 0; i < pointsLen; i++) {
                    this._organiseData(dataPoints[i], false);
                }
                this._max = data.max;
                this._min = data.min || 0;

                this._onExtremaChange();
                this._coordinator.emit('renderall', this._getInternalData());
                return this;
            },
            removeData: function() {
                // TODO: implement
            },
            setDataMax: function(max) {
                this._max = max;
                this._onExtremaChange();
                this._coordinator.emit('renderall', this._getInternalData());
                return this;
            },
            setDataMin: function(min) {
                this._min = min;
                this._onExtremaChange();
                this._coordinator.emit('renderall', this._getInternalData());
                return this;
            },
            setCoordinator: function(coordinator) {
                this._coordinator = coordinator;
            },
            _getInternalData: function() {
                return {
                    max: this._max,
                    min: this._min,
                    data: this._data,
                    radi: this._radi
                };
            },
            getData: function() {
                    return this._unOrganizeData();
                }
                /*,

                      TODO: rethink.

                    getValueAt: function(point) {
                      var value;
                      var radius = 100;
                      var x = point.x;
                      var y = point.y;
                      var data = this._data;

                      if (data[x] && data[x][y]) {
                        return data[x][y];
                      } else {
                        var values = [];
                        // radial search for datapoints based on default radius
                        for(var distance = 1; distance < radius; distance++) {
                          var neighbors = distance * 2 +1;
                          var startX = x - distance;
                          var startY = y - distance;

                          for(var i = 0; i < neighbors; i++) {
                            for (var o = 0; o < neighbors; o++) {
                              if ((i == 0 || i == neighbors-1) || (o == 0 || o == neighbors-1)) {
                                if (data[startY+i] && data[startY+i][startX+o]) {
                                  values.push(data[startY+i][startX+o]);
                                }
                              } else {
                                continue;
                              } 
                            }
                          }
                        }
                        if (values.length > 0) {
                          return Math.max.apply(Math, values);
                        }
                      }
                      return false;
                    }*/
        };


        return Store;
    })();

    var Canvas2dRenderer = (function Canvas2dRendererClosure() {

        var _getColorPalette = function(config) { //(1)
            // console.log("============access to _getColorPalette============");
            var gradientConfig = config.gradient || config.defaultGradient;
            var paletteCanvas = document.createElement('canvas');
            var paletteCtx = paletteCanvas.getContext('2d');
            // console.log(gradientConfig);
            paletteCanvas.width = 256;
            paletteCanvas.height = 1; //1
            var gradient = paletteCtx.createLinearGradient(0, 0, 256, 1);
            for (var key in gradientConfig) {
                // console.log(key);
                // console.log(gradientConfig[key]);
                gradient.addColorStop(key, gradientConfig[key]);
            }
            paletteCtx.fillStyle = gradient;
            paletteCtx.fillRect(0, 0, 256, 1);
            return paletteCtx.getImageData(0, 0, 256, 1).data;
        };

        var _getPointTemplate = function(radius, blurFactor) {
            var tplCanvas = document.createElement('canvas');
            var tplCtx = tplCanvas.getContext('2d');
            var x = radius;
            var y = radius;
            tplCanvas.width = tplCanvas.height = radius * 2;

            if (blurFactor == 1) {
                // console.log("access to if to arc()");
                tplCtx.beginPath();
                tplCtx.arc(x, y, radius, 0, 2 * Math.PI, true);
                tplCtx.fillStyle = 'rgba(0,0,0,1)';
                tplCtx.fill();
            } else { //now access else only
                // console.log("access to else to createRadialGradient()");
                var gradient = tplCtx.createRadialGradient(x, y, radius * blurFactor, x, y, radius);
                gradient.addColorStop(0, 'rgba(0,0,0,1)');
                gradient.addColorStop(1, 'rgba(0,0,0,0)');
                tplCtx.fillStyle = gradient;
                tplCtx.fillRect(0, 0, 2 * radius, 2 * radius);
            }



            return tplCanvas;
        };

        var _prepareData = function(data) {
            var renderData = [];
            var min = data.min;
            var max = data.max;
            var radi = data.radi;
            var data = data.data;

            var xValues = Object.keys(data);
            var xValuesLen = xValues.length;

            while (xValuesLen--) {
                var xValue = xValues[xValuesLen];
                var yValues = Object.keys(data[xValue]);
                var yValuesLen = yValues.length;
                while (yValuesLen--) {
                    var yValue = yValues[yValuesLen];
                    var value = data[xValue][yValue];
                    var radius = radi[xValue][yValue];
                    renderData.push({
                        x: xValue,
                        y: yValue,
                        value: value,
                        radius: radius
                    });
                }
            }

            return {
                min: min,
                max: max,
                data: renderData
            };
        };


        function Canvas2dRenderer(config) {
            var container = config.container;
            var shadowCanvas = this.shadowCanvas = document.createElement('canvas');
            var canvas = this.canvas = config.canvas || document.createElement('canvas');
            var renderBoundaries = this._renderBoundaries = [10000, 10000, 0, 0];

            var computed = getComputedStyle(config.container) || {};

            canvas.className = 'heatmap-canvas';

            this._width = canvas.width = shadowCanvas.width = config.width || +(computed.width.replace(/px/, ''));
            this._height = canvas.height = shadowCanvas.height = config.height || +(computed.height.replace(/px/, ''));

            this.shadowCtx = shadowCanvas.getContext('2d');
            this.ctx = canvas.getContext('2d');

            // @TODO:
            // conditional wrapper

            canvas.style.cssText = shadowCanvas.style.cssText = 'position:absolute;left:0;top:0;';

            container.style.position = 'relative';
            container.appendChild(canvas);

            this._palette = _getColorPalette(config);
            this._templates = {};
            this._setStyles(config);
        };

        Canvas2dRenderer.prototype = {
            renderPartial: function(data) {
                // console.log("============access to renderPartial============");
                if (data.data.length > 0) {
                    this._drawAlpha(data);
                    this._colorize();
                }
            },
            renderAll: function(data) { //(2)
                // reset render boundaries
                // console.log("============access to renderAll============");
                this._clear();
                if (data.data.length > 0) {
                    this._drawAlpha(_prepareData(data));
                    this._colorize(_prepareData(data));
                }
            },
            _updateGradient: function(config) {
                // console.log("============access to _updateGradient============");
                this._palette = _getColorPalette(config);
            },
            updateConfig: function(config) {
                // console.log("============access to updateConfig============");
                if (config['gradient']) {
                    this._updateGradient(config);
                }
                this._setStyles(config);
            },
            setDimensions: function(width, height) {
                this._width = width;
                this._height = height;
                this.canvas.width = this.shadowCanvas.width = width;
                this.canvas.height = this.shadowCanvas.height = height;
            },
            _clear: function() {
                this.shadowCtx.clearRect(0, 0, this._width, this._height);
                this.ctx.clearRect(0, 0, this._width, this._height);
            },
            _setStyles: function(config) {
                this._blur = (config.blur == 0) ? 0 : (config.blur || config.defaultBlur);

                if (config.backgroundColor) {
                    this.canvas.style.backgroundColor = config.backgroundColor;
                }

                this._width = this.canvas.width = this.shadowCanvas.width = config.width || this._width;
                this._height = this.canvas.height = this.shadowCanvas.height = config.height || this._height;


                this._opacity = (config.opacity || 0) * 255;
                this._maxOpacity = (config.maxOpacity || config.defaultMaxOpacity) * 255;
                this._minOpacity = (config.minOpacity || config.defaultMinOpacity) * 255;
                this._useGradientOpacity = !!config.useGradientOpacity;
            },
            _drawAlpha: function(data) {
                // console.log("============access to _drawAlpha============");
                var min = this._min = data.min; //0
                var max = this._max = data.max;
                var data = data.data || [];
                var dataLen = data.length;
                // on a point basis?
                var blur = 1 - this._blur;
                while (dataLen--) {
                    var point = data[dataLen];
                    var x = point.x;
                    var y = point.y;
                    var radius = point.radius;
                    // if value is bigger than max
                    // use max as value
                    var value = Math.min(point.value, max);
                    var rectX = x - radius;
                    var rectY = y - radius;
                    var shadowCtx = this.shadowCtx;
                    var tpl;
                    if (!this._templates[radius]) {
                        this._templates[radius] = tpl = _getPointTemplate(radius, blur);
                    } else {
                        tpl = this._templates[radius];
                    }
                    // value from minimum / value range
                    // => [0, 1]
                    // console.log("value : " + value);
                    var templateAlpha = (value - min) / (max - min);
                    // this fixes #176: small values are not visible because globalAlpha < .01 cannot be read from imageData
                    shadowCtx.globalAlpha = templateAlpha < .01 ? .01 : templateAlpha; //.01 ? .01: templateAlpha
                    // console.log(tpl); //all canvas
                    // console.log("templateAlpha: " + templateAlpha);
                    shadowCtx.drawImage(tpl, rectX, rectY);
                    // console.log("========this._renderBoundaries=================");
                    // console.log(this._renderBoundaries);
                    // console.log("rectX: " + rectX);
                    // console.log("rectY: " + rectY);
                    // update renderBoundaries  //ขอบเขตการแสดงผล
                    if (rectX < this._renderBoundaries[0]) {
                        // console.log("access to if_1");
                        this._renderBoundaries[0] = rectX;
                        // this._renderBoundaries[0] = 0; //test
                    }
                    if (rectY < this._renderBoundaries[1]) {
                        // console.log("access to if_2");
                        this._renderBoundaries[1] = rectY;
                        // this._renderBoundaries[1] = 0; //test
                    }
                    if (rectX + 2 * radius > this._renderBoundaries[2]) {
                        // console.log("access to if_3");
                        // this._renderBoundaries[2] = rectX + 2 * radius;
                        this._renderBoundaries[2] = rectX + 2 * radius; //test
                    }
                    if (rectY + 2 * radius > this._renderBoundaries[3]) {
                        // console.log("access to if_4");
                        // this._renderBoundaries[3] = rectY + 2 * radius;
                        this._renderBoundaries[3] = rectY + 2 * radius; //test
                    }

                }
                // console.log("========this._renderBoundaries (New)========");
                // console.log(this._renderBoundaries);
            },
            _colorize: function(data) { //(3)
                // console.log("===========access to _colorize===========");
                var x = this._renderBoundaries[0];
                var y = this._renderBoundaries[1];
                var width = this._renderBoundaries[2] - x;
                var height = this._renderBoundaries[3] - y;
                var maxWidth = this._width;
                var maxHeight = this._height;
                var opacity = this._opacity;
                var maxOpacity = this._maxOpacity;
                var minOpacity = this._minOpacity;
                var useGradientOpacity = this._useGradientOpacity;
                var data = data.data || [];
                var dataLen = data.length;
                // console.log("dataLen : " + dataLen);
                // console.log(data);
                // console.log(data[dataLen - 1]);
                // console.log(data[dataLen - 1].value);
                var tmp_temp_front = [];
                var tmp_temp_behind = [];
                for (let i = 0; i < dataLen; i++) {
                    if (data[i].value <= 29) {
                        tmp_temp_front.push(data[i]);
                    }

                }
                var tmp_temp_front_maximum = tmp_temp_front[0];
                for (let i = 0; i < tmp_temp_front.length; i++) {
                    if (tmp_temp_front[i].value > tmp_temp_front_maximum.value) {
                        tmp_temp_front_maximum = tmp_temp_front[i];
                    }

                }
                for (let i = 0; i < dataLen; i++) {
                    if (data[i].value > 29) {
                        tmp_temp_behind.push(data[i]);
                    }

                }
                // tmp_temp_front_maximum.value -= 2;
                // console.log("=======tmp_temp_front=========");
                // console.log(tmp_temp_front);
                // console.log("=======tmp_temp_behind=========");
                // console.log(tmp_temp_behind);
                // console.log("=======tmp_temp_front_maximum=========");
                // console.log(tmp_temp_front_maximum);
                if (x < 0) {
                    // console.log("access to if _colorize() x < 0");
                    x = 0;
                }
                if (y < 0) {
                    // console.log("access to if _colorize() y < 0");
                    y = 0;
                }
                if (x + width > maxWidth) {
                    // console.log("access to if _colorize() x + width > maxWidth");
                    width = maxWidth - x;
                }
                if (y + height > maxHeight) {
                    // console.log("access to if _colorize() y + height > maxHeight");
                    height = maxHeight - y;
                }
                // console.log("x : " + x);
                // console.log("y : " + y);
                // console.log("width : " + width);
                // console.log("height : " + height);
                var img = this.shadowCtx.getImageData(x, y, width, height);
                var imgData = img.data;
                var len = imgData.length;
                var palette = this._palette;

                // console.log("===========img===========");
                // console.log(img);
                // console.log("===========imgData===========");
                // console.log(imgData);
                // console.log("len : " + len);
                // console.log("opacity : " + opacity);
                let count = 0;
                let tmp_offset = 0;
                for (var i = 3; i < (len); i += 4) { //(4)
                    var alpha = imgData[i];
                    var offset = alpha * 4;
                    // console.log("alpha : " + alpha);
                    // console.log("offset : " + offset);
                    if (tmp_temp_front_maximum.value <= 22) { //temperature lower than 22°C
                        if (offset > 510 && i < ((len / 2) + (80000 * 2))) { //&& i < (len / 2) //offset < 744 //&& offset < 840
                            count++;
                            offset = tmp_offset;
                        }
                        if (offset > 500 && offset < 510) {
                            tmp_offset = offset;
                        }
                    } else if (tmp_temp_front_maximum.value >= 23 && tmp_temp_front_maximum.value <= 24) { //temperature range 23°C - 24°C
                        // console.log("temperature range 23°C - 24°C");
                        if (offset > 590 && i < ((len / 2) + (80000 * 2))) {
                            count++;
                            offset = tmp_offset;
                        }
                        if (offset > 580 && offset < 590) {
                            tmp_offset = offset;
                        }
                    } else if (tmp_temp_front_maximum.value >= 25 && tmp_temp_front_maximum.value <= 26) { //temperature range 25°C - 26°C
                        // console.log("temperature range 25°C - 26°C");
                        if (offset > 640 && i < ((len / 2) + (80000 * 2))) {
                            count++;
                            offset = tmp_offset;
                        }
                        if (offset > 630 && offset < 640) { //offset > 630 &&
                            tmp_offset = offset;
                        }
                    } else if (tmp_temp_front_maximum.valuee >= 27 && tmp_temp_front_maximum.value <= 28) { //temperature range 27°C - 28°C
                        if (offset > 690 && i < ((len / 2) + (80000 * 2))) {
                            count++;
                            offset = tmp_offset;
                        }
                        if (offset < 690) {
                            tmp_offset = offset;
                        }
                    } else if (tmp_temp_front_maximum.value && tmp_temp_front_maximum.value <= 30) { //temperature range 29°C - 30°C
                        if (offset > 740 && i < ((len / 2) + (80000 * 2))) {
                            count++;
                            offset = tmp_offset;
                        }
                        if (offset > 730 && offset < 740) {
                            tmp_offset = offset;
                        }
                    } else if (tmp_temp_front_maximum.value >= 31 && tmp_temp_front_maximum.value <= 32) { //temperature range 31°C - 32°C
                        if (offset > 790 && i < ((len / 2) + (80000 * 2))) {
                            count++;
                            offset = tmp_offset;
                        }
                        if (offset > 780 && offset < 790) {
                            tmp_offset = offset;
                        }
                    } else if (tmp_temp_front_maximum.value >= 33 && tmp_temp_front_maximum.valuee <= 34) { //temperature range 33°C - 34°C
                        if (offset > 840 && i < (len / 2)) {
                            count++;
                            offset = tmp_offset;
                        }
                        if (offset > 830 && offset < 840) {
                            tmp_offset = offset;
                        }
                    } else if (tmp_temp_front_maximum.value >= 33 && tmp_temp_front_maximum.value <= 34) { //temperature range 33°C - 34°C
                        if (offset > 890 && i < ((len / 2) + (80000 * 2))) {
                            count++;
                            offset = tmp_offset;
                        }
                        if (offset > 880 && offset < 890) {
                            tmp_offset = offset;
                        }
                    } else if (tmp_temp_front_maximum.value >= 35 && tmp_temp_front_maximum.value <= 36) { //temperature range 35°C - 36°C
                        if (offset > 940 && i < ((len / 2) + (80000 * 2))) {
                            count++;
                            offset = tmp_offset;
                        }
                        if (offset > 930 && offset < 940) {
                            tmp_offset = offset;
                        }
                    } else if (tmp_temp_front_maximum.value >= 37 && tmp_temp_front_maximum.value <= 38) { //temperature range 37°C - 38°C
                        if (offset > 990 && i < ((len / 2) + (80000 * 2))) {
                            count++;
                            offset = tmp_offset;
                        }
                        if (offset > 980 && offset < 990) {
                            tmp_offset = offset;
                        }
                    }

                    if (!offset) {
                        continue;
                    }

                    var finalAlpha;
                    if (opacity > 0) {
                        // console.log("access to if _colorize()");
                        finalAlpha = opacity;
                    } else {
                        // console.log("access to else _colorize()");
                        if (alpha < maxOpacity) {
                            // console.log("access to else || if _colorize()");
                            if (alpha < minOpacity) {
                                // console.log("access to else || if || if _colorize()");
                                finalAlpha = minOpacity;
                            } else { //only access here
                                // console.log("access to else || if || else _colorize()");
                                finalAlpha = alpha;
                            }
                        } else { //access to this condition if when intersect
                            // console.log("access to else || else _colorize()");
                            finalAlpha = maxOpacity;
                            // finalAlpha = alpha;
                        }
                        // console.log("finalAlpha : " + finalAlpha);
                    }
                    // console.log("useGradientOpacity : " + useGradientOpacity);
                    // console.log("finalAlpha : " + finalAlpha);
                    imgData[i - 3] = palette[offset];
                    // console.log(imgData[i - 3]);
                    imgData[i - 2] = palette[offset + 1]; //palette[offset + 1];
                    // console.log(imgData[i - 2]);
                    imgData[i - 1] = palette[offset + 2]; //palette[offset + 2];
                    // console.log(imgData[i - 1]);
                    imgData[i] = useGradientOpacity ? palette[offset + 3] : finalAlpha; //palette[offset + 3];
                    // console.log(imgData[i]);

                }
                // console.log("count : " + count);
                let tmp = 684;
                // console.log(palette[tmp]);
                // console.log(palette[tmp + 1]);
                // console.log(palette[tmp + 2]);
                // console.log("===========after update imgData===========");
                // console.log(imgData);
                img.data = imgData;
                this.ctx.putImageData(img, x, y);
                this._renderBoundaries = [1000, 1000, 0, 0];
                // console.log("===========palette===========");
                // console.log(palette);
            },
            getValueAt: function(point) {
                var value;
                var shadowCtx = this.shadowCtx;
                var img = shadowCtx.getImageData(point.x, point.y, 1, 1);
                var data = img.data[3];
                var max = this._max;
                var min = this._min;

                value = (Math.abs(max - min) * (data / 255)) >> 0;

                return value;
            },
            getDataURL: function() {
                return this.canvas.toDataURL();
            }
        };


        return Canvas2dRenderer;
    })();


    var Renderer = (function RendererClosure() {

        var rendererFn = false;

        if (HeatmapConfig['defaultRenderer'] === 'canvas2d') {
            rendererFn = Canvas2dRenderer;
        }

        return rendererFn;
    })();


    var Util = {
        merge: function() {
            var merged = {};
            var argsLen = arguments.length;
            for (var i = 0; i < argsLen; i++) {
                var obj = arguments[i]
                for (var key in obj) {
                    merged[key] = obj[key];
                }
            }
            return merged;
        }
    };
    // Heatmap Constructor
    var Heatmap = (function HeatmapClosure() {

        var Coordinator = (function CoordinatorClosure() {

            function Coordinator() {
                this.cStore = {};
            };

            Coordinator.prototype = {
                on: function(evtName, callback, scope) {
                    var cStore = this.cStore;

                    if (!cStore[evtName]) {
                        cStore[evtName] = [];
                    }
                    cStore[evtName].push((function(data) {
                        return callback.call(scope, data);
                    }));
                },
                emit: function(evtName, data) {
                    var cStore = this.cStore;
                    if (cStore[evtName]) {
                        var len = cStore[evtName].length;
                        for (var i = 0; i < len; i++) {
                            var callback = cStore[evtName][i];
                            callback(data);
                        }
                    }
                }
            };

            return Coordinator;
        })();


        var _connect = function(scope) {
            var renderer = scope._renderer;
            var coordinator = scope._coordinator;
            var store = scope._store;

            coordinator.on('renderpartial', renderer.renderPartial, renderer);
            coordinator.on('renderall', renderer.renderAll, renderer);
            coordinator.on('extremachange', function(data) {
                scope._config.onExtremaChange &&
                    scope._config.onExtremaChange({
                        min: data.min,
                        max: data.max,
                        gradient: scope._config['gradient'] || scope._config['defaultGradient']
                    });
            });
            store.setCoordinator(coordinator);
        };


        function Heatmap() {
            var config = this._config = Util.merge(HeatmapConfig, arguments[0] || {});
            this._coordinator = new Coordinator();
            if (config['plugin']) {
                var pluginToLoad = config['plugin'];
                if (!HeatmapConfig.plugins[pluginToLoad]) {
                    throw new Error('Plugin \'' + pluginToLoad + '\' not found. Maybe it was not registered.');
                } else {
                    var plugin = HeatmapConfig.plugins[pluginToLoad];
                    // set plugin renderer and store
                    this._renderer = new plugin.renderer(config);
                    this._store = new plugin.store(config);
                }
            } else {
                this._renderer = new Renderer(config);
                this._store = new Store(config);
            }
            _connect(this);
        };

        // @TODO:
        // add API documentation
        Heatmap.prototype = {
            addData: function() {
                this._store.addData.apply(this._store, arguments);
                return this;
            },
            removeData: function() {
                this._store.removeData && this._store.removeData.apply(this._store, arguments);
                return this;
            },
            setData: function() {
                this._store.setData.apply(this._store, arguments);
                return this;
            },
            setDataMax: function() {
                this._store.setDataMax.apply(this._store, arguments);
                return this;
            },
            setDataMin: function() {
                this._store.setDataMin.apply(this._store, arguments);
                return this;
            },
            configure: function(config) {
                this._config = Util.merge(this._config, config);
                this._renderer.updateConfig(this._config);
                this._coordinator.emit('renderall', this._store._getInternalData());
                return this;
            },
            repaint: function() {
                this._coordinator.emit('renderall', this._store._getInternalData());
                return this;
            },
            getData: function() {
                return this._store.getData();
            },
            getDataURL: function() {
                return this._renderer.getDataURL();
            },
            getValueAt: function(point) {

                if (this._store.getValueAt) {
                    return this._store.getValueAt(point);
                } else if (this._renderer.getValueAt) {
                    return this._renderer.getValueAt(point);
                } else {
                    return null;
                }
            }
        };

        return Heatmap;

    })();


    // core
    var heatmapFactory = {
        create: function(config) {
            return new Heatmap(config);
        },
        register: function(pluginKey, plugin) {
            HeatmapConfig.plugins[pluginKey] = plugin;
        }
    };

    return heatmapFactory;


});