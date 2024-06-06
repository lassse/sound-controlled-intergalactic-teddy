import Q from "./../main";
import Player from "./Player";
import Moon from "./Moon";
import Backdrop from "./Backdrop";
import Mountain from "./Mountain";
import Section from "./Section";
import Icon from "./Icon";
import Title from "./Title";
import BigNumber from "./BigNumber";
import ScoreBoard from "./ScoreBoard";
import SoundClassifier from "./../ai/AudioClassifier";

class Game {
  constructor() {
    this.paused = true;
    Q.speed = this.speed = 0;
    Q.debug = false;
    Q.clapSound = document.querySelector("#clap-sound");
    Q.ohSound = document.querySelector("#oh-sound");

    this.speedCounter = 0;
    this.resetCounter = 0;
    this.counter = 0;
    this.scoreBoard = new ScoreBoard();
    Q.score = 0;
    Q.canvas = this.canvas = document.querySelector("#canvas");
    this.canvas.width = Q.width;
    this.canvas.height = Q.height;
    this.context = this.canvas.getContext("2d");

    Q.classes = {};
    Q.allowTraining = false;

    window.addEventListener("click", this.clickStart.bind(this));
    // Q.soundClassifier = new SoundClassifier({
    // 	k: 5,
    // 	threshold: 30
    // })
    // window.addEventListener('prediction', this.predictionCallback.bind(this));

    // Q.allowMicrophone = false
    // Q.player = this.player = new Player()

    // Q.duckIcon = new Icon('clap')
    // Q.jumpIcon = new Icon('say')
    // Q.title = new Title('main')
    // Q.jumpTitle = new Title('jump')
    // Q.duckTitle = new Title('duck')
    // Q.retryTitle = new Title('retry')
    // Q.countdownTitle = new BigNumber(3)
    // Q.countdownTitle.x = (720 - 80) / 2
    // Q.countdownTitle.y = (570 - 200) / 2

    // Q.showRetry = false
    // window.addEventListener('keydown', this.keydown.bind(this))
    // window.addEventListener('hit', this.hit.bind(this))

    // Q.timeoutTimer = null
    // this.reset(false)

    // this.playing = false
    // this.isFirst = 0
  }

  clickStart(event) {
    window.removeEventListener("click", this.clickStart.bind(this));
    Q.soundClassifier = new SoundClassifier({
      k: 5,
      threshold: 30,
    });
    window.addEventListener("prediction", this.predictionCallback.bind(this));

    Q.allowMicrophone = false;
    Q.player = this.player = new Player();

    Q.duckIcon = new Icon("clap");
    Q.jumpIcon = new Icon("say");
    Q.title = new Title("main");
    Q.jumpTitle = new Title("jump");
    Q.duckTitle = new Title("duck");
    Q.retryTitle = new Title("retry");
    Q.countdownTitle = new BigNumber(3);
    Q.countdownTitle.x = (720 - 80) / 2;
    Q.countdownTitle.y = (570 - 200) / 2;

    Q.showRetry = false;
    window.addEventListener("keydown", this.keydown.bind(this));
    window.addEventListener("hit", this.hit.bind(this));

    Q.timeoutTimer = null;
    this.reset(false);

    this.playing = false;
    this.isFirst = 0;
  }

  reset(isIntro) {
    if (Q.tutorialTimeline) {
      Q.tutorialTimeline.kill();
    }

    Q.showRetry = false;
    Q.showTitle = false;
    Q.showDuck = false;
    Q.showJump = false;
    Q.score = 0;
    this.resetCounter = 0;
    this.scoreBoard.set(Q.score);
    this.dead = false;

    this.backdrops = [];
    this.backdrops.push(new Backdrop(0));

    this.mountainsBack = [];
    this.mountainsBack.push(new Mountain(0));

    this.mountainsMiddle = [];
    this.mountainsMiddle.push(new Mountain(1));

    this.mountainsFront = [];
    this.mountainsFront.push(new Mountain(2));

    this.sections = [];
    this.sections.push(new Section(0, true));

    Q.player.reset();
    Q.score = 0;
    if (isIntro === true) {
      this.intro();
    } else {
      Q.isIntro = false;

      if (Q.tutorialTimeline) {
        Q.tutorialTimeline.pause();
      }
      Q.player.run();
      this.startGame();
    }
  }

  tutorialCompleted() {
    if (Q.tutorialTimeline) {
      Q.tutorialTimeline.kill();
    }
    Q.showTitle = false;
    Q.showDuck = false;
    Q.showJump = false;
    Q.showRetry = false;

    Q.showScore = true;
    Q.isIntro = false;
    Q.soundClassifier.enable();
  }

  startTutorial() {
    Q.soundClassifier.disable();
    Q.showRetry = false;

    Q.tutorialTimeline = new TimelineMax({
      onComplete: this.tutorialCompleted.bind(this),
    });

    Q.showTitle = false;

    Q.tutorialTimeline.to(Q.duckIcon, 4.6, {
      delay: 0.5,
      onStart: () => {
        Q.showDuck = true;
      },
      onComplete: () => {
        Q.showDuck = false;
      },
    });

    Q.tutorialTimeline.to(Q.jumpIcon, 5.2, {
      delay: 0.5,
      onStart: () => {
        Q.showJump = true;
      },
      onComplete: () => {
        Q.showJump = false;
      },
    });

    let counter = 3;

    Q.tutorialTimeline.to(Q.countdownTitle, 1, {
      delay: 0.2,
      repeat: 3,
      onRepeat: () => {
        counter -= 1;
        if (counter < 1) {
          Q.countdownTitle.clear();
        } else {
          Q.countdownTitle.set(counter);
        }
      },
      onStart: () => {
        Q.countdownTitle.set(counter);
        Q.showCountdown = true;
      },
      onComplete: () => {
        Q.showCountdown = false;
      },
    });
  }

  intro() {
    this.reset();
    Q.speed = 4;
    Q.showScore = false;
    Q.player.run();
    Q.score = 0;
    Q.isIntro = true;
    Q.showPlayer = true;
    Q.showRetry = false;

    Q.showTitle = true;

    Q.soundClassifier.enable();
    if (this.timer) {
      cancelAnimationFrame(this.timer);
    }
    this.timer = requestAnimationFrame(this.render.bind(this));
  }

  keydown(event) {
    if (event.keyCode === 13) {
      this.paused = !this.paused;
      if (this.paused) {
        this.stopGame();
      } else {
        this.startGame();
      }
    } else if (event.keyCode === 32) {
      this.reset(false);
    } else if (event.keyCode === 38) {
      event.preventDefault();
      this.player.jump();
    } else if (event.keyCode === 40) {
      event.preventDefault();
      this.player.duck();
    }
  }

  resetTimeout() {
    if (Q.timeoutTimer) {
      clearTimeout(Q.timeoutTimer);
    }
    // Q.timeoutTimer = setTimeout(this.intro.bind(this), 30000)
  }

  predictionCallback(event) {
    let prediction = event.detail.prediction.prediction;

    this.resetTimeout();

    if (Q.isIntro) {
      this.startTutorial();
    } else {
      if (prediction === "jump") {
        this.player.jump();
      }

      if (prediction === "duck") {
        this.player.duck();
        if (this.dead) {
          if (this.resetCounter < 1) {
            this.resetCounter += 1;
          } else {
            this.reset(false);
          }
        }
      }
    }
  }

  pause() {
    if (!this.paused) {
      this.paused = true;
      this.stopGame();
    }
  }

  unpause() {
    if (this.paused) {
      this.paused = false;
      this.startGame();
    }
  }

  startGame() {
    Q.isIntro = false;
    Q.showPlayer = true;
    Q.showScore = true;
    Q.showDuck = false;
    Q.showJump = false;
    Q.speed = 4;
    Q.player.run();
    Q.score = 0;
    Q.soundClassifier.disable();

    Q.soundTimer = setTimeout(() => {
      Q.soundClassifier.enable();
    }, 600);

    this.stopGame();
    this.timer = requestAnimationFrame(this.render.bind(this));
    this.player.resume();
    this.resetTimeout();
  }

  stopGame() {
    if (this.timer) {
      cancelAnimationFrame(this.timer);
    }

    this.player.pause();
  }

  hit(event) {
    Q.speed = 0;
    Q.player.dead();
    this.dead = true;
    Q.showRetry = true;
  }

  render() {
    this.context.clearRect(0, 0, Q.width, Q.height);

    let removeBackdrop = false;
    this.backdrops.forEach((backdrop) => {
      backdrop.x -= Q.speed * 0;
      backdrop.render(this.context);

      if (backdrop.x + backdrop.width < Q.width && this.backdrops.length < 2) {
        this.backdrops.push(new Backdrop(backdrop.x + backdrop.width - 0.5));
      } else if (backdrop.x + backdrop.width < 0) {
        removeBackdrop = true;
      }
    });

    if (removeBackdrop) {
      this.backdrops.shift();
    }

    this.mountainsBack.forEach((mountain) => {
      mountain.x -= Q.speed * 0.05;
      mountain.render(this.context);
    });

    if (
      this.mountainsBack.length === 1 &&
      this.mountainsBack[0].x + this.mountainsBack[0].width < Q.width
    ) {
      let mountain = new Mountain(0);
      mountain.x = this.mountainsBack[0].x + this.mountainsBack[0].width - 0.5;
      this.mountainsBack.push(mountain);
    }

    if (this.mountainsBack[0].x + this.mountainsBack[0].width < 0) {
      this.mountainsBack.shift();
    }

    this.mountainsMiddle.forEach((mountain) => {
      mountain.x -= Q.speed * 0.1;
      mountain.render(this.context);
    });

    if (
      this.mountainsMiddle.length === 1 &&
      this.mountainsMiddle[0].x + this.mountainsMiddle[0].width < Q.width
    ) {
      let mountain = new Mountain(1);
      mountain.x =
        this.mountainsMiddle[0].x + this.mountainsMiddle[0].width - 0.5;
      this.mountainsMiddle.push(mountain);
    }

    if (this.mountainsMiddle[0].x + this.mountainsMiddle[0].width < 0) {
      this.mountainsMiddle.shift();
    }

    this.mountainsFront.forEach((mountain) => {
      mountain.x -= Q.speed * 0.3;
      mountain.render(this.context);
    });

    if (
      this.mountainsFront.length === 1 &&
      this.mountainsFront[0].x + this.mountainsFront[0].width < Q.width
    ) {
      let mountain = new Mountain(2);
      mountain.x =
        this.mountainsFront[0].x + this.mountainsFront[0].width - 0.5;
      this.mountainsFront.push(mountain);
    }

    if (this.mountainsFront[0].x + this.mountainsFront[0].width < 0) {
      this.mountainsFront.shift();
    }

    let removeSection = false;
    this.sections.forEach((section) => {
      section.x -= Q.speed;
      section.render(this.context);

      if (section.x + section.width < Q.width && this.sections.length < 2) {
        this.sections.push(
          new Section(section.x + section.width - Q.speed, Q.isIntro)
        );
      } else if (section.x + section.width < 0) {
        removeSection = true;
      }
    });

    if (removeSection) {
      this.sections.shift();
    }

    if (Q.showPlayer) {
      this.player.render(this.context);
    }

    if (!this.dead && this.counter % 10 === 0 && !Q.isIntro) {
      Q.score += 1;
      this.scoreBoard.set(Q.score);
      this.counter = 0;
    }

    this.counter += 1;

    if (Q.showScore) {
      this.scoreBoard.render(this.context);
    }

    if (!this.dead && !Q.isIntro) {
      if (this.speedCounter % 120 === 0) {
        Q.speed += 0.1;
        this.speedCounter = 0;
      }
      this.speedCounter += 1;
    }

    if (Q.showDuck) {
      Q.duckIcon.render(this.context);
      Q.duckTitle.render(this.context);
    }

    if (Q.showJump) {
      Q.jumpIcon.render(this.context);
      Q.jumpTitle.render(this.context);
    }

    if (Q.showTitle) {
      Q.title.render(this.context);
    }

    if (Q.showCountdown) {
      Q.countdownTitle.render(this.context);
    }

    if (Q.showRetry) {
      Q.retryTitle.render(this.context);
    }

    // Debug
    if (Q.debug) {
      this.context.fillStyle = "red";
      this.context.fillRect(0, 0, 40, 40);
      this.context.fillStyle = "green";
      this.context.fillRect(Q.width - 40, 0, 40, 40);
      this.context.fillStyle = "blue";
      this.context.fillRect(Q.width - 40, Q.height - 40, 40, 40);
    }

    if (!this.renderOnce) {
      this.timer = requestAnimationFrame(this.render.bind(this));
    } else {
      this.renderOnce = false;
    }
  }
}

export default Game;
