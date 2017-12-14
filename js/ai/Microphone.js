import Meyda from 'meyda'

class Microphone {
    constructor(bufferSize, callback) {
        if (Reflect.has(window, 'webkitAudioContext') && !Reflect.has(window, 'AudioContext')) {
            window.AudioContext = window.webkitAudioContext;
        }

        if (Reflect.has(navigator, 'webkitGetUserMedia') && !Reflect.has(navigator, 'getUserMedia')) {
            navigator.getUserMedia = navigator.webkitGetUserMedia;
            if (!Reflect.has(AudioContext, 'createScriptProcessor')) {
                AudioContext.prototype.createScriptProcessor = AudioContext.prototype.createJavaScriptNode;
            }
        }

        this.context = new AudioContext();

        this.synthesizer = {};
        this.synthesizer.out = this.context.createGain();

        this.meyda = Meyda.createMeydaAnalyzer({
            audioContext: this.context,
            source: this.synthesizer.out,
            bufferSize: bufferSize,
            featureExtractors: [
            'mfcc',
            'loudness'
            ],
            callback: callback
        });
        this.initializeMicrophoneSampling();
    }

    initializeMicrophoneSampling() {
        let that = this;

        function errorCallback(err) {
            throw err;
        }

        function successCallback(mediaStream) {
            window.mediaStream = mediaStream;
            that.source = that.context.createMediaStreamSource(window.mediaStream);
            that.meyda.setSource(that.source);
            that.meyda.start();

            console.groupEnd();
        }

        try {
            navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.getUserMedia;
            
            let constraints = {
                video: false,
                audio: true
            };

            try {
                navigator.getUserMedia(constraints, successCallback, errorCallback);
            }catch (data) {
                let getUserMedia = navigator.mediaDevices.getUserMedia(constraints);
                getUserMedia.then(successCallback);
                getUserMedia.catch(errorCallback);
            }
        }catch (data) {
            errorCallback();
        }
    }
}


export default Microphone