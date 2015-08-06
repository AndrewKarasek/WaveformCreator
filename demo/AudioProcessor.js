/*****/
//utility class to buffer and filter audio files
/*****/


var AudioProcessor = {
	bufferFile: function(url, callback){
		  var request = new XMLHttpRequest();
		  request.open('GET', url, true);
		  request.responseType = 'arraybuffer';

		  request.onload = function() {
		    context.decodeAudioData(request.response, function(buffer) {

		     	callback(buffer);

		    }, onError);
		  }

		  var onError = function(){
		  }

		  request.send();
	},


	bufferFilter: function(url, filter, callback){
		var thisElm = this;
		this.bufferFile(url, function(buffer){
			
			thisElm.offlineFilter(buffer, filter, callback);
		});
	},

	offlineFilter: function(buffer, filter, callback){
		  var type = filter.type;
		  var fq = filter.frequency;
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


	offlineFilters: function(buffer, filters, callback){
		var count = 0;
		var limit = filters.length;
		var thisElm = this;
		
		var filtered = [];

		var postFilters = function(buffer, filter, callback){
			var index = filters.indexOf(filter);
			filtered[index] = buffer;
			count++;

			if(count === limit){
				callback(filtered);
			}
		};

		filters.forEach(function(filter){
			if(filter === 'none'){
				postFilters(buffer, filter, callback);
			} else{
				thisElm.offlineFilter(buffer, filter, function(filteredBuffer){
					postFilters(filteredBuffer, filter, callback);
				});
			}
		});
	}
};	