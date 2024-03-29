const map = {
    // Creates a 12x12 map
    columns: 12,
    rows: 12,
    // With tiles 64px x 64px in size
    tile_size: 64,
    // sets up the tile designations for each spot on the board in the first array
    // Adds the layer tiles in the second array
    layers: [[
        3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
        3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3,
        3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3,
        3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3,
        3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3,
        3, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 3,
        3, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 3,
        3, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 3,
        3, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 3,
        3, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 3,
        3, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 3,
        3, 3, 3, 1, 1, 2, 3, 3, 3, 3, 3, 3
    ], [
        4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4,
        4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
        4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
        4, 0, 0, 5, 0, 0, 0, 0, 0, 5, 0, 4,
        4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
        4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
        4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
        4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
        4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
        4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
        4, 4, 4, 0, 5, 4, 4, 4, 4, 4, 4, 4,
        4, 4, 4, 0, 0, 3, 3, 3, 3, 3, 3, 3
    ]],

    // Fetches the appropriate tile for a specific spot, plus any layering
    getTile: function (layer, column, row) {
        return this.layers[layer][row * map.columns + column];
    },

    // Checks if a tile is solid (an obstacle)
    // Tiles 3 and 5 are solid. The rest can be walked on
    // Function looks through all layers at the coord and returns TRUE if one is solid
    isSolidTileAtXY: function (x, y) {
        const col = Math.floor(x / this.tile_size);
        const row = Math.floor(y / this.tile_size);

        return this.layers.reduce(function (res, layer, index) {
            const tile = this.getTile(index, col, row);
            const isSolid = tile === 3 || tile === 5;

            // If True, will return true; else default of false
            return res || isSolid;
        }.bind(this), false); // Passes in false as default res value
    },

    getColumn: function (x) {
        return Math.floor(x / this.tile_size);
    },
    getRow: function (y) {
        return Math.floor(y / this.tile_size);
    },
    getX: function (column) {
        return column * this.tile_size;
    },
    getY: function (row) {
        return row * this.tile_size;
    }
};

// Creates Camera view
function Camera(map, width, height) {
    this.x = 0;
    this.y = 0;
    this.width = width;
    this.height = height;
    this.maxX = map.columns * map.tile_size - width;
    this.maxY = map.rows * map.tile_size - height;
}

Camera.prototype.follow = function (sprite) {
    this.following = sprite;
    sprite.screenX = 0;
    sprite.screenY = 0;
};

Camera.prototype.update = function () {
    // Sets camera to center the Sprite to the view
    this.following.screenX = this.width / 2;
    this.following.screenY = this.height / 2;

    // Sets the camera to follow the Sprite with this view
    this.x = this.following.x - this.width / 2;
    this.y = this.following.y - this.height / 2;
    
    // Sets constraints on x and y to the larger of 0 or the smaller of x/y or maxx/y
    this.x = Math.max(0, Math.min(this.x, this.maxX));
    this.y = Math.max(0, Math.min(this.y, this.maxY));

    // Handles the edge case of Sprite going to the corners of the map, where the camera cannot center the Sprite (nothing to render beyond map borders)
    // Updates left/right screen coords
    if (this.following.x < this.width / 2 ||
        this.following.x > this.maxX + this.width / 2) {
        this.following.screenX = this.following.x - this.x;
    }

    // Updates top/bottom screen coords
    if (this.following.y < this.height / 2 ||
        this.following.y > this.maxY + this.height / 2) {
        this.following.screenY = this.following.y - this.y;
    }
};


// Creates Sprite

function sprite(map, x, y) {
    this.map = map;
    this.x = x;
    this.y = y;
    this.width = map.tile_size;
    this.height = map.tile_size;

    this.image = Loader.getImage('sprite')
    this.mirrorImage = Loader.getImage('mirrorSprite');
}

sprite.SPEED = 256; // Pixels per second movement

sprite.prototype.move = function (delta, directionX, directionY) {
    // Moves Sprite around
    this.x += directionX * sprite.SPEED * delta;
    this.y += directionY * sprite.SPEED * delta;

    // Verify whether or not the sprite walks into an obstacle
    this._collide(directionX, directionY);

    // Sets constraints on x and y to the larger of 0 or the smaller of x/y or maxx/y
    const maxX = this.map.columns * this.map.tile_size;
    const maxY = this.map.rows * this.map.tile_size;
    this.x = Math.max(0, Math.min(this.x, maxX));
    this.y = Math.max(0, Math.min(this.y, maxY));
};

sprite.prototype._collide = function (directionX, directionY) {
    let row, column;
    // Sets parameters to check. Current coords - (width/2) 
    // On the right and bottom, it's Current coords - (width/ 2-1) becuase we're checking up to 63px in width (not borders)
    const left = this.x - this.width / 2;
    const right = this.x + this.width / 2 - 1;
    const top = this.y - this.height / 2;
    const bottom = this.y + this.height / 2 - 1;

    // Check for obstacles with any of the Sprite's side coords
    const collision =
        this.map.isSolidTileAtXY(left, top) ||
        this.map.isSolidTileAtXY(right, top) ||
        this.map.isSolidTileAtXY(right, bottom) ||
        this.map.isSolidTileAtXY(left, bottom);
    
    // If no collision, Sprite can keep moving
    if (!collision) { return; }

    // If collision, update x/y coords on Sprite where halted by obstacle
    if (directionY > 0) {
        row = this.map.getRow(bottom);
        this.y = -this.height / 2 + this.map.getY(row);
    }
    else if (directionY < 0) {
        row = this.map.getRow(top);
        this.y = this.height / 2 + this.map.getY(row + 1);
    }
    else if (directionX > 0) {
        column = this.map.getColumn(right);
        this.x = -this.width / 2 + this.map.getX(column);
    }
    else if (directionX < 0) {
        column = this.map.getColumn(left);
        this.x = this.width / 2 + this.map.getX(column + 1);
    }
};


// Initializes common.js Game helper functions

Game.load = function () {
    return [
        Loader.loadImage('tiles', 'tiles.png'),
        Loader.loadImage('sprite', 'trex.png'),
        Loader.loadImage('mirrorSprite', 'trex_mirror.png')
    ];
};

Game.init = function () {
    Keyboard.listenForEvents(
        [Keyboard.LEFT, Keyboard.RIGHT, Keyboard.UP, Keyboard.DOWN]);
    this.tileAtlas = Loader.getImage('tiles');

    this.sprite = new sprite(map, 160, 160);
    this.camera = new Camera(map, 512, 512);
    this.camera.follow(this.sprite);
};

Game.update = function (delta) {
    // Handle the Sprite's movements with arrow keys
    let directionX = 0;
    let directionY = 0;
    if (Keyboard.isDown(Keyboard.LEFT)) { directionX = -1; this.sprite.image = Loader.getImage('mirrorSprite') }
    else if (Keyboard.isDown(Keyboard.RIGHT)) { directionX = 1; this.sprite.image = Loader.getImage('sprite')}
    else if (Keyboard.isDown(Keyboard.UP)) { directionY = -1; }
    else if (Keyboard.isDown(Keyboard.DOWN)) { directionY = 1; }

    this.sprite.move(delta, directionX, directionY);
    this.camera.update();
};


// SCROLL-VIEW RENDERING

// Iterates over the columns and rows to render the map:
// context: a 2D canvas context
// titleAtlas: an image object that contains the tile map
// map: the tile map object

Game._drawLayer = function (layer) {
    // To scroll view, we need to partially render some tiles
    // This requires tracking our starting points

    const startColumn = Math.floor(this.camera.x / map.tile_size);
    const endColumn = startColumn + (this.camera.width / map.tile_size);
    const startRow = Math.floor(this.camera.y / map.tile_size);
    const endRow = startRow + (this.camera.height / map.tile_size);

    // We'll calculate how much to offset the tiles from the typical starting (0,0) point based on keeping the sprite centered in the camera view
    const offsetX = -this.camera.x + startColumn * map.tile_size;
    const offsetY = -this.camera.y + startRow * map.tile_size;

    // The loop is similar except adds the offset values to x and y coords
    // Plus we have to round those values to avoid floating points
    for (let i = startColumn; i <= endColumn; i++) {
        for (let j = startRow; j <= endRow; j++) {
            const tile = map.getTile(layer, i, j);
            const x = (i - startColumn) * map.tile_size + offsetX;
            const y = (j - startRow) * map.tile_size + offsetY;
            // If NOT an empty tile (0)
            if (tile !== 0) {
                this.ctx.drawImage(
                    // the tileset image
                    this.tileAtlas,
                    // top left x-axis coord of source
                    (tile - 1) * map.tile_size, 
                    // top left y-axis coord of source
                    0,
                    // width to draw from source (64px)
                    map.tile_size,
                    // height to draw from source (64px)
                    map.tile_size,
                    // x-axis coord to place top left of new image
                    Math.round(x),
                    // y-axis coord to place top left of new image
                    Math.round(y),
                    // the width to draw in the canvas (64px)
                    map.tile_size,
                    // the height to draw in the canvas (64px)
                    map.tile_size
                );
            }
        }
    }
};

Game.render = function () {
    // Draw the background map layer
    this._drawLayer(0);

    // Draw the Sprite
    this.ctx.drawImage(
        this.sprite.image,
        this.sprite.screenX - this.sprite.width / 2,
        this.sprite.screenY - this.sprite.height / 2
    );

    // Draw the top layer
    this._drawLayer(1)

    // Could add more as needed
};