(function ($) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);

    class GameObject {
        x = 0
        y = 0
        boundingBox

        setup() {
        }

        update() {
        }

        render(context) {
        }
    }

    class Table extends GameObject {
        #settings

        constructor(settings) {
            super();
            this.#settings = settings;
        }

        update() {
            // nothing to do here
        }

        render(context) {
            const sceneSize = this.#settings.sceneSize;
            context.fillStyle = this.#settings.colors.tableColor;
            context.fillRect(0, 0, sceneSize.width, sceneSize.height);

            this.#drawDivider(context);
        }

        #drawDivider(context) {
            const sceneSize = this.#settings.sceneSize;
            const dividerWidth = this.#settings.table.dividerWidth;
            context.fillStyle = this.#settings.colors.tableDividerColor;

            const step = sceneSize.height / 15;

            const x = (sceneSize.width - dividerWidth) * 0.5;
            let y = 0;
            while (y < sceneSize.height) {
                context.fillRect(x, y + step * 0.25, dividerWidth, step * 0.5);
                y += step;
            }
        }
    }

    const Direction = {
        LEFT: 'LEFT',
        RIGHT: 'RIGHT',
    };

    class BoundingBox {
        constructor(width, height) {
            this.width = width;
            this.height = height;
        }
    }

    class Racket extends GameObject {
        position
        width
        height

        #settings
        #distanceFromEdge = () => this.width

        constructor(position, settings, racketSettings) {
            super();
            this.position = position;
            this.#settings = settings;
            this.width = racketSettings.width;
            this.height = racketSettings.height;
            this.boundingBox = new BoundingBox(this.width, this.height);
            this.setup();
        }

        setup() {
            const sceneSize = this.#settings.sceneSize;
            if (this.position === Direction.LEFT) {
                this.x = this.#distanceFromEdge();
            } else {
                this.x = sceneSize.width - (this.#distanceFromEdge() + this.width);
            }

            this.y = (sceneSize.height - this.height) / 2;
        }

        render(context) {
            context.fillStyle = this.#settings.colors.racketColor;
            context.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    class Player extends Racket {
        #speed
        #sceneSize
        #controlKeys
        #keyListener

        constructor(position, controlKeys, keyListener, settings, playerSettings) {
            super(position, settings, playerSettings.racket);
            this.#speed = playerSettings.speed;
            this.#sceneSize = settings.sceneSize;
            this.#controlKeys = controlKeys;
            this.#keyListener = keyListener;
        }

        update() {
            if (this.#keyListener.keyState[this.#controlKeys.upKey]) {
                if (this.y >= 0) {
                    this.y -= this.#speed;
                }
            }

            if (this.#keyListener.keyState[this.#controlKeys.downKey]) {
                if (this.y <= this.#sceneSize.height - this.height) {
                    this.y += this.#speed;
                }
            }
        }
    }

    class PlayerControlKeys {
        constructor(upKey, downKey) {
            this.upKey = upKey;
            this.downKey = downKey;
        }
    }

    const LetterKeys = new PlayerControlKeys('KeyW', 'KeyS');
    const ArrowKeys = new PlayerControlKeys('ArrowUp', 'ArrowDown');

    class Ball extends GameObject {
        side
        speed
        velocity = {x: 0, y: 0}
        boundingBox

        #settings

        constructor(settings) {
            super();
            this.#settings = settings;
            this.side = settings.ball.side;
            this.speed = settings.ball.speed;
            this.boundingBox = new BoundingBox(this.side, this.side);
            this.setup();
        }

        startMovement(direction) {
            const dir = direction === Direction.LEFT ? -1 : 1;
            const speed = this.speed - 3;
            this.velocity = {x: speed * dir, y: this.getRandomNumberBetween(-5, 5)};
        }

        setup() {
            const sceneSize = this.#settings.sceneSize;
            this.x = (sceneSize.width - this.side) / 2;
            this.y = (sceneSize.height - this.side) / 2;
            this.velocity = {x: 0, y: 0};
        }

        update() {
            this.x += this.velocity.x;
            this.y += this.velocity.y;
        }

        render(context) {
            context.fillStyle = this.#settings.colors.ballColor;
            context.fillRect(this.x, this.y, this.side, this.side);
        }

        getRandomNumberBetween(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min)
        }
    }

    class BoxCollider {
        static collides(object1, object2) {
            return this.collidesTest(
                object1.x, object1.y, object1.boundingBox.width, object1.boundingBox.height,
                object2.x, object2.y, object2.boundingBox.width, object2.boundingBox.height,
            )
        }

        static collidesTest(ax, ay, aw, ah, bx, by, bw, bh) {
            return ax < bx + bw && ay < by + bh && bx < ax + aw && by < ay + ah
        }
    }

    class BallCollider {
        #ball
        #rackets
        #sceneSize
        #soundsPlayer
        #onOutFromTable

        constructor(ball, sceneSize, soundsPlayer, rackets, onOutFromTable) {
            this.#ball = ball;
            this.#sceneSize = sceneSize;
            this.#soundsPlayer = soundsPlayer;
            this.#rackets = rackets;
            this.#onOutFromTable = onOutFromTable;
        }

        update() {
            this.#checkWallsCollision();
            this.#checkRacketCollision();
            this.#checkTableExit();
        }

        #checkRacketCollision() {
            this.#rackets.forEach((racket) => {
                if (BoxCollider.collides(racket, this.#ball)) {
                    this.#onRacketCollision(racket);
                }
            });
        }

        #onRacketCollision(racket) {
            this.x = racket.position === Direction.LEFT ? racket.x + racket.width : racket.x - this.#ball.side;
            const n = (this.#ball.y + this.#ball.side - racket.y) / (racket.height + this.#ball.side);
            const phi = 0.25 * Math.PI * (2 * n - 1);
            const smash = Math.abs(phi) > 0.2 * Math.PI ? 1.5 : 1;
            const direction = racket.position === Direction.LEFT ? 1 : -1;

            this.#ball.velocity.x = smash * direction * this.#ball.speed * Math.cos(phi);
            this.#ball.velocity.y = smash * this.#ball.speed * Math.sin(phi);
            this.#soundsPlayer.sounds.ball.play();
        }

        #checkTableExit() {
            if (0 > this.#ball.x + this.#ball.side || this.#ball.x > this.#sceneSize.width) {
                if (this.#ball.x + this.#ball.side < 0) {
                    this.#onOutFromTable(Direction.LEFT);
                } else {
                    this.#onOutFromTable(Direction.RIGHT);
                }
            }
        }

        #checkWallsCollision() {
            const ball = this.#ball;
            if (0 > ball.y || ball.y + ball.side > this.#sceneSize.height) {
                const offset = ball.velocity.y < 0 ? 0 - ball.y : this.#sceneSize.height - (ball.y + ball.side);
                this.y += 2 * offset;
                this.#ball.velocity.y *= -1;
                this.#soundsPlayer.sounds.ball.play();
            }
        }
    }

    class Bot extends Racket {
        #sceneSize
        #ball
        #complexity

        constructor(position, ball, settings, playerSettings) {
            super(position, settings, playerSettings.racket);
            this.#ball = ball;
            this.#sceneSize = settings.sceneSize;
            this.#complexity = settings.bot.complexity;
        }

        update() {
            const destination = this.#ball.y - (this.height - this.#ball.side) * 0.5;
            const newDestination = this.y + (destination - this.y) * this.#complexity;
            if (newDestination >= 0 && newDestination <= this.#sceneSize.height - this.height) {
                this.y = newDestination;
            }
        }
    }

    const Mode = {
        SINGLE_PLAYER: 'SINGLE_PLAYER',
        TWO_PLAYERS: 'TWO_PLAYERS',
    };

    class FailureAnimation extends GameObject {
        #alpha = 0
        #increasing = true
        #counts = 4
        #direction = Direction.LEFT

        #settings

        constructor(settings) {
            super();
            this.#settings = settings;
        }

        drawFailure(direction) {
            this.#alpha = 0;
            this.#increasing = true;
            this.#counts = 0;
            this.#direction = direction;
        }

        render(context) {
            const sceneSize = this.#settings.sceneSize;
            const tableColor = this.#settings.colors.tableColor;
            const tableDividerWidth = this.#settings.table.dividerWidth;

            if (this.#counts === 4) return
            this.#alpha += 0.02;
            if (this.#alpha >= 1) {
                this.#alpha = 0;
                this.#counts++;
                this.#increasing = !this.#increasing;
            }
            const x1 = this.#direction === Direction.LEFT ? 0 : sceneSize.width;
            const grd = context.createLinearGradient((sceneSize.width / 2) - tableDividerWidth, 0, x1, 0);
            grd.addColorStop(0, tableColor);
            grd.addColorStop(1, `rgba(255, 0, 0, ${this.#increasing ? this.#alpha : 1 - this.#alpha})`);
            context.fillStyle = grd;

            const x = this.#direction === Direction.LEFT ? 0 : sceneSize.width / 2 + tableDividerWidth;
            context.fillRect(x, 0, (sceneSize.width / 2) - tableDividerWidth, sceneSize.height);
        }
    }

    class Scene {
        #context
        #settings
        #gameObjects = {}
        #colliders = {}
        #soundsPlayer
        #keyListener

        constructor(context, settings, keyListener, soundsPlayer, mode, onBallExit) {
            this.#context = context;
            this.#settings = settings;
            this.#soundsPlayer = soundsPlayer;
            this.#keyListener = keyListener;

            const sceneSize = settings.sceneSize;
            const ball = new Ball(settings);
            this.#gameObjects = {
                table: new Table(settings),
                failure: new FailureAnimation(settings),
                ball: ball,
                leftPlayer: new Player(Direction.LEFT, LetterKeys, keyListener, settings, settings.leftPlayer),
                rightPlayer: this.#createRightPlayer(sceneSize, Direction.RIGHT, ArrowKeys, mode, ball),
            };

            this.#colliders = {
                ballCollider: new BallCollider(
                    this.#gameObjects.ball,
                    settings.sceneSize,
                    soundsPlayer,
                    [this.#gameObjects.leftPlayer, this.#gameObjects.rightPlayer],
                    (direction) => {
                        this.#gameObjects.failure.drawFailure(direction);
                        onBallExit(direction);
                    },
                ),
            };
            this.#gameLife();
        }

        start(direction) {
            this.#gameObjects.ball.startMovement(direction);
        }

        reset() {
            Object.values(this.#gameObjects).forEach((object) => object.setup());
        }

        #createRightPlayer(sceneSize, position, keys, mode, ball) {
            if (mode === Mode.SINGLE_PLAYER) {
                return new Bot(position, ball, this.#settings, this.#settings.bot)
            } else {
                return new Player(position, keys, this.#keyListener, this.#settings, this.#settings.rightPlayer)
            }
        }

        #gameLife() {
            Object.values(this.#gameObjects).forEach((object) => {
                object.update();
                object.render(this.#context);
            });

            Object.values(this.#colliders).forEach((collider) => collider.update());

            window.requestAnimationFrame(() => this.#gameLife());
        }
    }

    class ContextFactory {
        static create(settings) {
            const canvas = document.getElementById(settings.canvasContainerId);
            canvas.width = settings.sceneSize.width;
            canvas.height = settings.sceneSize.height;
            return canvas.getContext('2d')
        }
    }

    class KeyListener {
        keyState = {}
        #onKeyDownListeners = []

        constructor() {
            document.addEventListener('keydown', (event) => {
                this.keyState[event.code] = true;
                this.#onKeyDownListeners.forEach((listener) => listener(event.code));
            });

            document.addEventListener('keyup', (event) => {
                delete this.keyState[event.code];
            });
        }

        addKeyDownListener(listener) {
            this.#onKeyDownListeners.push(listener);
        }

        removeKeyDownListener(listener) {
            this.#onKeyDownListeners.splice(this.#onKeyDownListeners.indexOf(listener), 1);
        }
    }

    class GameMenu {
        #timelineIntroScreen = gsap.timeline({paused: false})
        #settings

        constructor(settings, onMenuItemSelected) {
            this.#settings = settings;
            this.#timelineIntroScreen.staggerFrom(`#main-menu-screen .menu-button`, 1.3, {
                css: {scale: 0},
                autoAlpha: 0,
                ease: Elastic.easeOut,
            }, .1);
            this.#timelineIntroScreen.restart();

            $__default["default"]('div.menu-button').click((event) => {
                event.preventDefault();
                const buttonId = event.currentTarget.id;
                const menuItem = this.#getMenuItem(buttonId);
                if (menuItem === settings.menuButton) {
                    this.#fadeToScreen(
                        menuItem.screenId, () => {
                            this.#timelineIntroScreen.restart();
                            onMenuItemSelected(menuItem);
                        },
                    );
                } else {
                    this.#timelineIntroScreen.reverse();
                    this.#timelineIntroScreen.eventCallback('onReverseComplete', () => {
                        this.#fadeToScreen(menuItem.screenId, () => onMenuItemSelected(menuItem));
                    });
                }
            });
        }

        #fadeToScreen(screenName, onFadeOut) {
            const currentScreen = $__default["default"]('.active-screen');
            const targetScreen = $__default["default"](`#${screenName}`);
            return gsap.to(currentScreen, .3, {
                autoAlpha: 0,
                y: '+=10',
                onComplete: () => {
                    if (onFadeOut) onFadeOut();
                    currentScreen.removeClass('active-screen');
                    gsap.to(targetScreen, .3, {
                        y: '-=10',
                        autoAlpha: 1,
                        onComplete: () => {
                            targetScreen.addClass('active-screen');
                        },
                    });
                },
            })
        }

        #getMenuItem(buttonId) {
            return Object.values(this.#settings).find((menuItem) => menuItem.buttonId === buttonId)
        }
    }

    class ScoreCounter {
        #score = {left: 0, right: 0}
        #leftScoreContainer
        #rightScoreContainer

        constructor(settings) {
            this.#leftScoreContainer = $__default["default"](settings.leftScoreContainerId);
            this.#rightScoreContainer = $__default["default"](settings.rightScoreContainerId);
        }

        updateScore(direction) {
            if (direction === Direction.LEFT) {
                this.#score.right += 1;
                this.#rightScoreContainer.text(`${this.#score.right}`);
            } else {
                this.#score.left += 1;
                this.#leftScoreContainer.text(`${this.#score.left}`);
            }
        }

        reset() {
            this.#score = {left: 0, right: 0};
        }
    }

    class CountDownTimer {
        #timerContainer
        #interval
        #soundPlayer

        #handler

        constructor(settings, soundPlayer) {
            this.#timerContainer = $__default["default"](settings.labelId);
            this.#interval = settings.intervalBetweenRoundsSec;
            this.#soundPlayer = soundPlayer;
        }

        start(onFinish) {
            let count = this.#interval;
            const tick = () => {
                if (count === -1) {
                    onFinish();
                    clearInterval(this.#handler);
                } else {
                    this.#soundPlayer.sounds.tick.play();
                }
                if (count === 0) {
                    this.#timerContainer.text('Start!');
                } else if (count > 0) {
                    this.#timerContainer.text(`${count}`);
                } else {
                    this.#timerContainer.text('');
                }
                count -= 1;
            };
            tick();
            this.#handler = setInterval(() => tick(), 1000);
        }

        stop() {
            clearInterval(this.#handler);
        }
    }

    class Sound {
        #soundObject
        #volume
        #loop

        constructor(sound) {
            this.#soundObject = document.getElementById(sound.id);
            this.#volume = sound.volume === undefined ? '1' : sound.volume;
            this.#loop = sound.loop === undefined ? false : sound.loop;
        }

        play() {
            this.#soundObject.volume = this.#volume;
            this.#soundObject.loop = this.#loop;
            this.#soundObject.play();
        }

        stop() {
            this.#soundObject.pause();
            this.#soundObject.currentTime = 0;
        }
    }

    class SoundsPlayer {
        sounds = {}

        constructor(settings) {
            this.#loadSounds(settings.sounds);
        }

        #loadSounds(sounds) {
            Object.keys(sounds).forEach((soundKey) => {
                this.sounds[soundKey] = new Sound(sounds[soundKey]);
            });
        }

        stopAll() {
            Object.values(this.sounds).forEach((sound) => {
                sound.stop();
            });
        }
    }

    class GameSoundsPlayer extends SoundsPlayer {
        #isMuted = false

        constructor(settings) {
            super(settings);

            const muteButton = $__default["default"](settings.muteButtonId);
            muteButton.click((event) => {
                event.preventDefault();
                this.#isMuted = !this.#isMuted;
                document.querySelectorAll('audio').forEach((elem) => elem.muted = this.#isMuted);
                muteButton.toggleClass('mute');
            });
        }
    }

    class Game {
        #settings
        #context
        #soundsPlayer
        #menu
        #scoreCounter
        #keyListener = new KeyListener()
        #scene
        #countDownTimer

        constructor(settings) {
            this.#settings = settings;
            this.#context = ContextFactory.create(settings);
            this.#soundsPlayer = new GameSoundsPlayer(settings.soundPlayerSettings);
            this.#menu = new GameMenu(settings.menu, (menuItem) => this.onMenuItemSelected(menuItem));
            this.#scoreCounter = new ScoreCounter(settings.scoreCounter);
            this.#countDownTimer = new CountDownTimer(settings.timer, this.#soundsPlayer);
        }

        onMenuItemSelected(menuItem) {
            switch (menuItem) {
            case this.#settings.menu.onePlayerButton:
                this.#startNewGame(Mode.SINGLE_PLAYER);
                break
            case this.#settings.menu.twoPlayersButton:
                this.#startNewGame(Mode.TWO_PLAYERS);
                break
            case this.#settings.menu.menuButton:
                this.#resetGame();
                break
            }
        }

        #startNewGame(mode) {
            this.#scene = new Scene(
                this.#context,
                this.#settings,
                this.#keyListener,
                this.#soundsPlayer,
                mode,
                (direction) => this.#onBallExit(direction),
            );
            this.#soundsPlayer.sounds.background.play();
            this.#keyListener.addKeyDownListener((key) => {
                if (key === 'Space') {
                    this.#scene.start(Direction.LEFT);
                    this.#keyListener.removeKeyDownListener(this);
                }
            });
        }

        #onBallExit(direction) {
            this.#soundsPlayer.sounds.win.play();
            this.#scoreCounter.updateScore(direction);
            this.#scene.reset();
            this.#countDownTimer.start(() => {
                this.#scene.start(direction);
            });
        }

        #resetGame() {
            this.#countDownTimer.stop();
            this.#soundsPlayer.stopAll();
            this.#scoreCounter.reset();
            this.#scene.reset();
        }
    }

    class SceneSize {
        constructor(width, height) {
            this.width = width;
            this.height = height;
        }
    }

    class Cookie {
        set(name, value) {
            const date = new Date();
            date.setTime(date.getTime() + (999 * 24 * 60 * 60 * 1000));
            const expires = 'expires=' + date.toUTCString();
            document.cookie = name + '=' + value + ';' + expires + ';path=/';
        };

        get(name) {
            name = name + '=';
            const decodedCookie = decodeURIComponent(document.cookie);
            const cookieParts = decodedCookie.split(';');
            for (let i = 0; i < cookieParts.length; i++) {
                let cookiePart = cookieParts[i];
                while (cookiePart.charAt(0) === ' ') {
                    cookiePart = cookiePart.substring(1);
                }
                if (cookiePart.indexOf(name) === 0) {
                    return cookiePart.substring(name.length, cookiePart.length)
                }
            }
            return null
        }
    }

    class ThemeController {
        #settings
        #cookie = new Cookie()
        #themeRefreshListeners = []

        constructor(settings) {
            this.#settings = settings;
            this.#refreshTheme();
            const toggle = $__default["default"](settings.themeToggleClass);
            toggle.prop('checked', this.theme === 'light');
            toggle.click((event) => {
                this.#cookie.set('theme', ThemeController.#getThemeOpposite(this.theme));
                this.#refreshTheme();
            });
            toggle.mousedown((event) => event.preventDefault());
        }

        #refreshTheme() {
            this.theme = this.#cookie.get('theme') || this.#settings.defaultTheme;
            document.documentElement.setAttribute('data-theme', this.theme);
            this.#themeRefreshListeners.forEach((listener) => listener(this.theme));
        }


        addThemeRefreshListener(listener) {
            this.#themeRefreshListeners.push(listener);
        }

        removeThemeRefreshListener(listener) {
            this.#themeRefreshListeners.splice(this.#themeRefreshListeners.indexOf(listener), 1);
        }

        static #getThemeOpposite(theme) {
            return theme === 'dark' ? 'light' : 'dark'
        };
    }

    const themeController = new ThemeController({
        themeToggleClass: '.js__dark-mode-toggle',
        defaultTheme: 'dark',
    });

    const colors = {
        light: {
            tableColor: '#fff',
            tableDividerColor: '#434343',
            ballColor: '#66cb8c',
            racketColor: '#434343',
        },
        dark: {
            tableColor: '#434343',
            tableDividerColor: '#fff',
            ballColor: '#66cb8c',
            racketColor: '#fff',
        },
    };

    const settings = {
        canvasContainerId: 'game-canvas',
        sceneSize: new SceneSize(700, 600),
        soundPlayerSettings: {
            sounds: {
                win: {
                    id: 'win-audio',
                    volume: 0.2,
                },
                ball: {id: 'ball-audio'},
                tick: {id: 'tick'},
                background: {
                    id: 'background',
                    volume: 0.3,
                    loop: true,
                },
            },
            muteButtonId: '#mute-button',
        },
        menu: {
            onePlayerButton: {
                buttonId: 'button-one-player',
                screenId: 'game-screen',
            },
            twoPlayersButton: {
                buttonId: 'button-two-players',
                screenId: 'game-screen',
            },
            menuButton: {
                buttonId: 'go-to-main-menu-button',
                screenId: 'main-menu-screen',
            },
        },
        scoreCounter: {
            leftScoreContainerId: '#left-score',
            rightScoreContainerId: '#right-score',
        },
        table: {dividerWidth: 3},
        ball: {side: 20, speed: 5},
        failureAnimation: {},
        leftPlayer: {
            speed: 7,
            racket: {width: 20, height: 100},
        },
        rightPlayer: {
            speed: 7,
            racket: {width: 20, height: 100},
        },
        bot: {
            complexity: 0.05, /** Any real number between 0 and 1 where 0 is super easy and 1 is impossible **/
            racket: {width: 20, height: 100},
        },
        timer: {
            labelId: '#count-down-timer-label',
            intervalBetweenRoundsSec: 3,
        },
        colors: colors[themeController.theme],
    };

    themeController.addThemeRefreshListener((theme) => {
        settings.colors = colors[theme];
    });

    new Game(settings);

})($);
