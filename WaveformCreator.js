var WaveformCreator = {
	init: function(options){
		this.buffers = options.buffers;
        this.wrapper = options.container;		
		var thisElm = this;
        this.appendElements(options);

        var postFilter = function(buffer, fill, i){
            var peaks = thisElm.getPeaks(buffer);
            thisElm.drawWave(peaks, fill);   
            if(options.image && i+1 === thisElm.buffers.length){
                thisElm.toImage();

                thisElm.fireEvent('afterDraw');
            }
        }

		this.buffers.forEach(function(bufferObj, i){
            if(!bufferObj.filter){
                postFilter(bufferObj.buffer, bufferObj.fill, i);
            }  else{
                thisElm.filterBuffer(bufferObj.buffer, bufferObj.filter, function(filteredBuffer){
                    postFilter(filteredBuffer, bufferObj.fill, i);
                });
            }
		});
	},

    appendElements: function(options){
        this.canvas = document.createElement('canvas');
        this.canvas.width = options.width * window.devicePixelRatio;
        this.canvas.height = options.height * window.devicePixelRatio;
        this.canvas.style.width = options.width + 'px';
        this.canvas.style.height = options.height + 'px';
        this.wrapper.appendChild(this.canvas);

        if(options.image){
            this.image = document.createElement('img');
            this.image.width = options.width;
            this.image.height = options.height;
            this.wrapper.appendChild(this.image);
            this.canvas.style.display = 'none';                        
            //this.clearCanvas();
        }
    },

    clearCanvas: function(){
        this.canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
    },

    toImage: function(){
        var source = this.canvas.toDataURL();
        this.image.src = source;
    },

	getPeaks: function(bufferObject){
		
		var buffer = bufferObject;
		var length = this.canvas.width * window.devicePixelRatio;

        var sampleSize = buffer.length / length;
        var sampleStep = ~~(sampleSize / 10) || 1;
        var channels = 2;
        var splitPeaks = [];
        var mergedPeaks = [];

        for (var c = 0; c < channels; c++) {
            var peaks = splitPeaks[c] = [];
            var chan = buffer.getChannelData(c);

            for (var i = 0; i < length; i++) {
                var start = ~~(i * sampleSize);
                var end = ~~(start + sampleSize);
                var min = chan[0];
                var max = chan[0];

                for (var j = start; j < end; j += sampleStep) {
                    var value = chan[j];

                    if (value > max) {
                        max = value;
                    }

                    if (value < min) {
                        min = value;
                    }
                }

                peaks[2 * i] = max;
                peaks[2 * i + 1] = min;

                if (c == 0 || max > mergedPeaks[2 * i]) {
                    mergedPeaks[2 * i] = max;
                }

                if (c == 0 || min < mergedPeaks[2 * i + 1]) {
                    mergedPeaks[2 * i + 1] = min;
                }
            }
        }

        return mergedPeaks;
	},


	drawWave: function(peaks, fill){

		var canvas = this.canvas;

        var $ = 0.5 / window.devicePixelRatio;
        // A ma$rgin between split waveforms
        //var height = this.params.height * this.params.pixelRatio;
        var height = canvas.height;

        //var offsetY = height * channelIndex || 0;
        var offsetY = 0;
        var halfH = height / 2;
        var length = ~~(peaks.length / 2);
        var scale = 1 / window.devicePixelRatio;
        var absmax = 1;
 		this.waveCc = canvas.getContext('2d');

        this.waveCc.fillStyle = fill;
        if (this.progressCc) {
            this.progressCc.fillStyle = this.params.progressColor;
        }

        [ this.waveCc, this.progressCc ].forEach(function (cc) {
            if (!cc) { return; }

            cc.beginPath();
            cc.moveTo($, halfH + offsetY);

            for (var i = 0; i < length; i++) {
                var h = Math.round(peaks[2 * i] / absmax * halfH);
                cc.lineTo(i * scale + $, halfH - h + offsetY);
            }

            // Draw the bottom edge going backwards, to make a single
            // closed hull to fill.
            for (var i = length - 1; i >= 0; i--) {
                var h = Math.round(peaks[2 * i + 1] / absmax * halfH);
                cc.lineTo(i * scale + $, halfH - h + offsetY);
            }

            cc.closePath();
            cc.fill();

            // Always draw a median line
            cc.fillRect(0, halfH + offsetY - $, this.width, $);
        }, this);
	},


    filterBuffer: function(buffer, filter, callback){
          var type = filter.type;
          var fq = filter.freq;
          var q = filter.q;
          // Create offline context
          var offlineContext = new OfflineAudioContext(2, buffer.length, buffer.sampleRate);

          // Create buffer source
          var source = offlineContext.createBufferSource();
          source.buffer = buffer;

          // Create filter
          var filter = offlineContext.createBiquadFilter();
          filter.type = type;
          filter.frequency.value = fq;
          filter.Q.value = q;

          // Pipe the song into the filter, and the filter into the offline context
          source.connect(filter);
          filter.connect(offlineContext.destination);

          // Schedule the song to start playing at time:0
          source.start(0);

          // Render the song
          offlineContext.startRendering();

          // Act on the result
          offlineContext.oncomplete = function(e) {
                var filteredBuffer = e.renderedBuffer;              
                callback(filteredBuffer);
               
          }
    },



    fireEvent: function (event) {
        if (!this.handlers) { return; }
        var handlers = this.handlers[event];
        var args = Array.prototype.slice.call(arguments, 1);
        handlers && handlers.forEach(function (fn) {
            fn.apply(null, args);
        });
    },

    on: function (event, fn) {
        if (!this.handlers) { this.handlers = {}; }

        var handlers = this.handlers[event];
        if (!handlers) {
            handlers = this.handlers[event] = [];
        }
        handlers.push(fn);

        // Return an event descriptor
        return {
            name: event,
            callback: fn,
            un: this.un.bind(this, event, fn)
        };
    },


     /**
     * Remove an event handler.
     */
    un: function (event, fn) {
        if (!this.handlers) { return; }

        var handlers = this.handlers[event];
        if (handlers) {
            if (fn) {
                for (var i = handlers.length - 1; i >= 0; i--) {
                    if (handlers[i] == fn) {
                        handlers.splice(i, 1);
                    }
                }
            } else {
                handlers.length = 0;
            }
        }
    },

    /**
     * Remove all event handlers.
     */
    unAll: function () {
        this.handlers = null;
    },



}; 

var context = new AudioContext();





