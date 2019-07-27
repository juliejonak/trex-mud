// Load image assets

let Loader = {
    images: {}
};

Loader.loadImage = (key, src) => {
    let img = new Image();

    // Checks if image had loaded or if error loading it
    const checkIfLoaded = new Promise((res, reject) => {
        img.onload = () => {
            img = this.images[key];
            res(img);
        }

        img.onerror = () => {
            reject("Could not load image: " + src);
        }
    })

    src = img.src;
    return checkIfLoaded;
};


// Iterates through images. If image, returns reference, else null
Loader.getImage = (key) => {
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

Keyboard.listenForEvents = (keys) => {
    // Listens for user pressing keys down or lifting up
    window.addEventListener('keydown', this._onKeyDown());
    window.addEventListener('keyup', this._onKeyUp());

    // Sets each user pressed key as a key equal to false
    keys.forEach((key) => {
        this._keys[key] = false;
    })
}

// If a key pressed down is a value in Keyboard, it sets it to true in Keyboard._keys
Keyboard._onKeyDown = (event) => {
    const keyCode = event.keyCode;
    if (keyCode in this._keys){
        event.preventDefault();
        this._key[keyCode] = true;
    }
}

// If a key lifted up is a value in Keyboard, it sets it to false in Keyboard._keys
Keyboard._onKeyUp = (event) => {
    const keyCode = event.keyCode;
    if (keyCode in this._keys){
        event.preventDefault();
        this._key[keyCode] = false;
    }
}

// Throws error if user keys are not being picked up by the event listener
Keyboard.isDown = (keyCode) => {
    if (!keyCode in this._keys){
        throw new Error("Keycode " + keyCode + " is not being listened to.");
    }
    return this._keys[keyCode];
}