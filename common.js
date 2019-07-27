// Load image assets

let Loader = {
    images: {}
};

Loader.loadImage = function (key, src) {
    let img = new Image();

    // Checks if image had loaded or if error loading it
    const checkIfLoaded = new Promise(function (resolve, reject) {
        img.onload = function () {
            this.images[key] = img;
            resolve(img);
        }.bind(this);

        img.onerror = function () {
            reject('Could not load image: ' + src);
        };
    }.bind(this));

    img.src = src;
    return checkIfLoaded;
};


// Iterates through images. If image, returns reference, else null
Loader.getImage = function (key) {
    return (key in this.images) ? this.images[key] : null;
};


// Handle arrow key input

// Sets key codes to arrow keys for moving throughout the game
const Keyboard = {
    LEFT: 37,
    RIGHT: 39,
    UP: 38,
    DOWN: 40,
    _keys: {}
};

Keyboard.listenForEvents = function (keys) {
    // Listens for user pressing keys down or lifting up
    window.addEventListener('keydown', this._onKeyDown.bind(this));
    window.addEventListener('keyup', this._onKeyUp.bind(this));

    // Sets each user pressed key as a key equal to false
    keys.forEach(function (key) {
        this._keys[key] = false;
    }.bind(this));
}

// If a key pressed down is a value in Keyboard, it sets it to true in Keyboard._keys
Keyboard._onKeyDown = function (event) {
    const keyCode = event.keyCode;
    if (keyCode in this._keys) {
        event.preventDefault();
        this._keys[keyCode] = true;
    }
};

// If a key lifted up is a value in Keyboard, it sets it to false in Keyboard._keys
Keyboard._onKeyUp = function (event) {
    const keyCode = event.keyCode;
    if (keyCode in this._keys) {
        event.preventDefault();
        this._keys[keyCode] = false;
    }
};

// Throws error if user keys are not being picked up by the event listener
Keyboard.isDown = function (keyCode) {
    if (!keyCode in this._keys) {
        throw new Error('Keycode ' + keyCode + ' is not being listened to');
    }
    return this._keys[keyCode];
};


// Game Build

// Each iteration of an event loop is called a tick

let Game = {};

Game.run = function (context) {
    // ctx means the canvas context
    this.ctx = context;
    this._previousElapsed = 0;

    // Loads data from the server and places the returned HTML into the matched elements.
    const content = this.load();
    Promise.all(content).then(function (loaded_data) {
        this.init();
        window.requestAnimationFrame(this.tick);
    }.bind(this));
};

Game.tick = function (elapsed) {
    window.requestAnimationFrame(this.tick);

    // Clears the previous frame with the parameters of the pixels of the frame
    this.ctx.clearRect(0, 0, 512, 512);

    // Computes the delta time in seconds and adds a cap
    let delta = (elapsed - this._previousElapsed) / 1000.0;
    delta = Math.min(delta, 0.25); // Returns the smaller of the two values to cap the delta at 250ms
    this._previousElapsed = elapsed;

    this.update(delta);
    this.render();
}.bind(Game);


// We'll override these methods to create the demo according to our own parameters (non-scroll, add obstacles, etc.)
Game.init = function () {};
Game.update = function (delta) {};
Game.render = function () {};

// Start the game on window load

window.onload = function () {
    const context = document.getElementById('demo').getContext('2d');
    Game.run(context);
};