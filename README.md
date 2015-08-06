# WaveformCreator
Utility to generate graphical waveforms from audio files using HTML5 canvas 

## Usage
Create an instance: 

```javascript
var wave = Object.create(WaveformCreator);
```
### Simple Waveform
Initialize with a container element and at least on buffer:

```javascript
wave.init({
	container: document.getElementById('wave-wrapper'),
	width: 1000,
	height: 100,
	buffers: [{
		buffer: bufferedAudio,
		fill: 'blue'
	}]
});
```

![Waveform](/images/waveform.png)

### Split Frequency Waveform
To draw isolated frequencies pass a filter to the buffer object 

```javascript
 wave.init({
    container: document.getElementById('waveWrap'), 
    width: 1000,
    height: 100,
    buffers: [
            { buffer: buffer, fill: 'blue' },
            { buffer: buffer, fill: 'rgb(0,150,180)',
                filter:{
                    type: 'lowpass',
                    freq: 50,
                    q: 2
                }
            },
            { buffer: buffer, fill: 'rgb(0,200,200)',
                filter:{
                    type: 'highpass',
                    freq: 10000,
                    q: 2
                }
            }
    ]
});
```

![Split Waveform](/images/splitWaveform.png)

## Events
| event | description |
| --- | --- | --- |
| `beforeInit` | fired before any initialization logic takes place |
| `beforeDraw` | fired before the canvas is drawn to |
| `afterDraw` | fired directly after the canvas has been drawn to |

### Event Usage
```javascript
wave.on('beforeInit', function(){
	//pre init logic
});

wave.on('beforeDraw', function(){
	//before draw logic
});

wave.on('afterDraw', function(){
	//after draw logic
});

wave.init({
	container: document.getElementById('wave-wrapper'),
	width: 1000,
	height: 100,
	buffers: [{
		buffer: bufferedAudio,
		fill: 'blue'
	}]
});

```

## Options

### WaveformCreator Options
| option | type | description |
| --- | --- | --- |
| `container` | Node | HTML element that the wave will be appended to |
| `width` | Int | width in px of rendered waveform |
| `height` | Int | height in px of rendered waveform |
| `image` | Boolean | whether to create an image tag of the element and append it to the container |
| `buffers` | Array | array of buffer objects used to generate the waveform from in order, see [Buffer Object](#buffer-object) |

### Buffer Object
| option | type | description |
| --- | --- | --- |
| `buffer` | ArrayBuffer | buffered audio file |
| `fill` | String | color/fill to render the waveform with |
| `filter` | Object | object specifying the parameters in which to filter the audio file before generating the waveform, used to isolate specific frequencies, see [Filter Object](#filter-object) |

### Filter Object
This object will pass parameters to a BiquadFilterNode to filter the audio file pre-render. Refer to [MDN](https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode) for more details

| option | type | description |
| --- | --- | --- |
| `type` | String | Type of filter to initialise accepts values `lowpass`, `bandpass`, `highpass`, `highshelf`, `lowshelf`, `peaking`, `notch` & `allpass`. Refer to [MDN](https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode) to see how subsequent properties are applied.  |
| `freq` | Int | frequency at which to apply the filter measured in Hz range of `10` to `half of the sample-rate` |
| `q` | Int | Q factor or quality factor of the filter, range of `0.0001` to `1000` |


## Credits

Built from the original repo [wavesurfer](https://github.com/katspaugh/wavesurfer.js) by [katspaugh](https://github.com/katspaugh). 