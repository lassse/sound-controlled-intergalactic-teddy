import Meyda from "meyda";
import KNN from "./KNN";
import Q from "./../main";

class AudioClassifier {
  constructor(config) {
    let defaultConfig = {
      k: 5,
      bufferSize: 512,
      trainPause: 400,
      threshold: 35,
    };

    this.config = Object.assign(defaultConfig, config);
    this.allowBroadcasting = true;
    this.trainingData = [];
    this.training = false;
    this.allowTraining = false;
    this.predicting = false;
    this.currentClass = null;

    this.knn = new KNN(this.config.k);
    this.setupGUI();

    if (
      Reflect.has(window, "webkitAudioContext") &&
      !Reflect.has(window, "AudioContext")
    ) {
      window.AudioContext = window.webkitAudioContext;
    }

    if (
      Reflect.has(navigator, "webkitGetUserMedia") &&
      !Reflect.has(navigator, "getUserMedia")
    ) {
      navigator.getUserMedia = navigator.webkitGetUserMedia;

      if (!Reflect.has(AudioContext, "createScriptProcessor")) {
        AudioContext.prototype.createScriptProcessor =
          AudioContext.prototype.createJavaScriptNode;
      }
    }

    this.context = new AudioContext();

    this.synthesizer = {};
    this.synthesizer.out = this.context.createGain();

    let that = this;
    this.meyda = Meyda.createMeydaAnalyzer({
      audioContext: this.context,
      source: this.synthesizer.out,
      bufferSize: this.config.bufferSize,
      featureExtractors: ["mfcc", "loudness"],
      callback: this.audioCallback.bind(that),
    });
    this.initializeMicrophoneSampling();

    this.renderer = null;
    this.peaked = false;
    window.addEventListener("resize", this.resize.bind(this));
  }

  hideGUI() {
    this.hidden = true;
    this.element.style.display = "none";
    cancelAnimationFrame(this.renderer);
  }

  showGUI() {
    this.hidden = false;
    this.element.style.display = "block";
    this.renderer = requestAnimationFrame(this.render.bind(this));
    this.resize();
  }

  keyDown(event) {
    if (event.keyCode === 9 && event.shiftKey) {
      event.preventDefault();

      if (this.hidden) {
        this.showGUI();
        Q.GAME.pause();
      } else {
        this.hideGUI();
        // Q.GAME.unpause()
        Q.GAME.reset(false);
      }
    }
  }

  resize() {
    this.canvasWidth = this.canvas.width = this.canvas.offsetWidth;
    this.canvasHeight = this.canvas.height = this.canvas.offsetHeight;
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.ctx.fillStyle = this.peaked ? "blue" : "lightblue";

    if (this.visual && this.visual.length > 0) {
      let bandWidth = this.canvasWidth / this.visual.length;
      this.visual.forEach((value, index) => {
        let height = value * (this.canvasHeight * 0.3);
        this.ctx.fillRect(
          index * bandWidth,
          this.canvasHeight - height,
          bandWidth + 1,
          height
        );
      });
    }
    this.renderer = requestAnimationFrame(this.render.bind(this));
  }

  changeK() {
    let string = prompt("Set K (current value: " + this.knn.topK + ")");
    if (string) {
      let value = parseInt(string);
      if (value > 0 && value < 40) {
        this.knn.topK = value;
        document.querySelector("#change-k").textContent =
          "Change K: " + this.knn.topK;
      }
    }
  }

  changeThreshold() {
    let string = prompt(
      "Set Threshold (current value: " + this.config.threshold + ")"
    );
    if (string) {
      let value = parseInt(string);
      if (value > 0 && value < 200) {
        this.config.threshold = value;
        document.querySelector("#change-threshold").textContent =
          "Change Threshold: " + this.config.threshold;
      }
    }
  }

  trainingButtonDown(event) {
    let id = event.currentTarget.parentNode.id;
    window.addEventListener("mouseup", this.trainingButtonUpEvent);
    this.stopPredicting();
    this.startTraining(id);
  }

  trainingButtonUp() {
    window.removeEventListener("mouseup", this.trainingButtonUpEvent);
    this.stopTraining();
    this.startPredicting();
  }

  confirmClear(event) {
    let id = event.currentTarget.parentNode.id;
    let test = confirm('Are you sure you want to clear "' + id + '"');
    if (test) {
      this.clearClass(id);
    }
  }

  confirmClearAll(event) {
    let test = confirm("Are you sure you want to clear all classes");
    if (test) {
      this.clearAll();
    }
  }

  setDataSet(json) {
    this.clearAll();
    this.trainingData = {};
    let data = {};

    for (let key in json) {
      data[key] = JSON.parse(json[key]);
      this.trainingData[key] = [];

      let length = data[key].length;
      for (let index = 0; index < length; index += 1) {
        this.knn.learn(data[key][index], key);
        this.trainingData[key].push(data[key][index]);
      }
    }
    this.updateSamples();
    this.stopTraining();
    this.startPredicting();
  }

  saveDataSet() {
    let object = {};
    for (let key in this.trainingData) {
      object[key] = JSON.stringify(this.trainingData[key]);
    }
    let string = JSON.stringify(object);
    let blob = new Blob([string], { type: "application/json" });
    let url = URL.createObjectURL(blob);

    let link = document.createElement("a");
    link.href = url;
    link.download = "dataset.json";
    link.click();
  }

  setFileName(name) {
    document.querySelector("#data-title").textContent = name;
  }

  loadDefaultDataSet() {
    let request = new XMLHttpRequest();
    let filename = "datasets/default.json?t=" + new Date().getTime();
    request.onreadystatechange = () => {
      if (request.readyState === 4 && request.status === 200) {
        let data = JSON.parse(request.responseText);
        this.setDataSet(data);
        this.setFileName("default.json");
      }
    };
    request.open("get", filename, true);
    request.send();
  }

  loadDataSet() {
    let input = document.createElement("input");
    input.type = "file";
    input.addEventListener("change", (event) => {
      if (input.files.length > 0) {
        let file = input.files[0];
        let name = file.name;
        let fileReader = new FileReader();
        fileReader.onload = (event) => {
          let lines = event.target.result;
          let data = JSON.parse(lines);
          this.setDataSet(data);
          this.setFileName(name);
        };
        fileReader.readAsText(file);
      }
    });
    input.click();
  }

  // toggle() {
  // this.allowPredicting = !this.allowPredicting
  // this.predicting = this.allowPredicting
  // if (this.allowPredicting) {
  //     document.querySelector('#toggle').textContent = 'Disable prediction'
  // }else {
  //     document.querySelector('#toggle').textContent = 'Enable prediction'
  // }
  // }

  enable() {
    this.allowBroadcasting = true;
    document.querySelector("#disable").style.opacity = 1;
    document.querySelector("#enable").style.opacity = 0.5;
    document.querySelector("#enable").textContent = "Enabled";
    document.querySelector("#disable").textContent = "Disable";
  }

  disable() {
    this.allowBroadcasting = false;
    document.querySelector("#disable").style.opacity = 0.5;
    document.querySelector("#disable").textContent = "Disabled";
    document.querySelector("#enable").textContent = "Enable";
    document.querySelector("#enable").style.opacity = 1;
  }

  setupGUI() {
    this.element = document.querySelector("#settings");
    this.canvas = document.querySelector("#vizualizer");
    this.ctx = this.canvas.getContext("2d");
    this.hideGUI();

    let closeButton = document.querySelector(".close-button");
    closeButton.addEventListener("click", this.hideGUI.bind(this));

    document
      .querySelector("#disable")
      .addEventListener("click", this.disable.bind(this));
    document
      .querySelector("#enable")
      .addEventListener("click", this.enable.bind(this));
    this.enable();
    // document.querySelector('#toggle').addEventListener('click', this.toggle.bind(this));
    document
      .querySelector("#save")
      .addEventListener("click", this.saveDataSet.bind(this));
    document
      .querySelector("#load")
      .addEventListener("click", this.loadDataSet.bind(this));
    document.querySelector("#change-k").textContent =
      "Change K: " + this.knn.topK;
    document
      .querySelector("#change-k")
      .addEventListener("click", this.changeK.bind(this));

    document.querySelector("#change-threshold").textContent =
      "Change Threshold: " + this.config.threshold;
    document
      .querySelector("#change-threshold")
      .addEventListener("click", this.changeThreshold.bind(this));
    document
      .querySelector("#clear")
      .addEventListener("click", this.confirmClearAll.bind(this));
    this.trainingButtonUpEvent = this.trainingButtonUp.bind(this);
    this.trainingButtons = document.querySelectorAll(".sound-classes a.train");
    this.trainingButtons.forEach((button) => {
      button.addEventListener("mousedown", this.trainingButtonDown.bind(this));
    });

    this.clearButtons = document.querySelectorAll(".sound-classes a.clear");
    this.clearButtons.forEach((button) => {
      button.addEventListener("click", this.confirmClear.bind(this));
    });

    this.loadDefaultDataSet();

    window.addEventListener("keydown", this.keyDown.bind(this));
  }

  save() {
    let object = {};
    for (let key in this.trainingData) {
      object[key] = JSON.stringify(this.trainingData[key]);
    }
    let string = JSON.stringify(object);
  }

  clearClass(name) {
    this.knn.deleteClassData(name);
    this.trainingData[name] = [];
    this.updateSamples();
  }

  clearAll() {
    this.setFileName("");
    for (let key in this.trainingData) {
      this.clearClass(key);
    }
    this.trainingData = {};
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
    }

    try {
      navigator.getUserMedia =
        navigator.webkitGetUserMedia || navigator.getUserMedia;

      let constraints = {
        video: false,
        audio: true,
      };

      try {
        navigator.getUserMedia(constraints, successCallback, errorCallback);
      } catch (data) {
        let getUserMedia = navigator.mediaDevices.getUserMedia(constraints);
        getUserMedia.then(successCallback);
        getUserMedia.catch(errorCallback);
      }
    } catch (data) {
      console.log(data);
      errorCallback();
    }
  }

  startTraining(name) {
    this.currentClass = name;
    if (!this.trainingData[this.currentClass]) {
      this.trainingData[this.currentClass] = [];
    }
    this.training = true;
    this.allowTraining = true;
  }

  stopTraining() {
    this.allowTraining = false;
    this.training = false;
  }

  startPredicting() {
    this.allowPredicting = true;
    this.predicting = true;
  }

  stopPredicting() {
    this.allowPredicting = false;
    this.predicting = false;
  }

  updateSamples() {
    let numSamples = {};

    for (let key in this.trainingData) {
      numSamples[key] = this.trainingData[key].length;
    }

    this.trainingButtons.forEach((button) => {
      let id = button.parentNode.id;
      let counter = button.parentNode.children[1].children[0];
      counter.textContent = numSamples[id];
    });

    let event = new CustomEvent("sample-update", {
      detail: {
        numSamples: numSamples,
      },
    });
    window.dispatchEvent(event);
  }

  audioCallback(data) {
    this.visual = data.loudness.specific;

    let peaked = false;
    for (let index = 0; index < data.mfcc.length; index += 1) {
      if (Math.abs(data.mfcc[index]) >= this.config.threshold) {
        peaked = true;
      }
    }
    this.peaked = peaked;

    if (this.training || this.predicting) {
      if (peaked) {
        if (this.training && this.allowTraining) {
          this.knn.learn(data.mfcc, this.currentClass);

          if (!this.trainingData[this.currentClass]) {
            this.trainingData[this.currentClass] = [];
          }
          this.trainingData[this.currentClass].push(data.mfcc);

          this.updateSamples();

          if (this.timer) {
            clearTimeout(this.timer);
          }
          this.allowTraining = false;
          this.timer = setTimeout(() => {
            this.allowTraining = true;
          }, this.config.trainPause);
        } else if (this.predicting && this.allowPredicting) {
          let prediction = this.knn.predict(data.mfcc);
          document.querySelector("#prediction").textContent =
            prediction.prediction;
          if (this.allowBroadcasting) {
            let event = new CustomEvent("prediction", {
              detail: { prediction: prediction },
            });
            window.dispatchEvent(event);
          }

          if (this.timer) {
            clearTimeout(this.timer);
          }
          this.allowPredicting = false;
          this.timer = setTimeout(() => {
            document.querySelector("#prediction").textContent = "";
            this.allowPredicting = true;
          }, this.config.trainPause);
        }
      }
    }
  }
}

export default AudioClassifier;
