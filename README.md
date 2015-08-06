# WaveformCreator
Utility to generate graphical waveforms from audio files using HTML5 canvas 

## Usage

### Simple Waveform

### Gradient Waveform

### Split Frequency Waveform

 
## Events

## Options

### WaveformCreator Options
| option | type | description |
| --- | --- | --- |
| `container` | Node | HTML element that the wave will be appended to |
| `canvas` | Node | HTML element that the wave will be appended to |
| `width` | Int | width in px of rendered waveform |
| `height` | Int | height in px of rendered waveform |
| `image` | Boolean | whether to create an image tag of the element and append it to the container |
| `buffers` | Array | array of buffer objects used to generate the waveform from in order |

### Buffer Object
| option | type | description |
| --- | --- | --- |
| `buffer` | ArrayBuffer | buffered audio file |
| `fill` | String | color/fill to render the waveform with |
| `filter` | Object | object specifying the parameters in which to filter the audio file before generating the waveform, used to isolate specific frequencies |

### Filter Object
This object will pass parameters to a BiquadFilterNode to filter the audio file pre-render. Refer to [MDN](https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode) for more details

| option | type | description |
| --- | --- | --- |
| `type` | String | Type of filter to initialise accepts values `lowpass`, `bandpss`, `highpass`, `highshelf`, `lowshelf`, `peaking`, `notch` & `allpass`. Refer to [MDN](https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode) to see how subsequent properties are applied.  |
| `freq` | Int | frequency at which to apply the filter measured in Hzm range of 10 to half of the sample-rate |
| `q` | Int | Q factor or quality factor of the filter, range of 0.0001 to 1000 |


## Credits

Built from the original repo [wavesurfer](https://github.com/katspaugh/wavesurfer.js) by [katspaugh](https://github.com/katspaugh). 