// Split the tile set into pieces
// In the matrix, each spot reference either an empty tile (0) or a tile in the set (1, 2, 3, etc.)
// Layering requires us to use 0 sometimes
// If tiles were a 2D matrix, then the returned value would just be tiles[column][row]. 

// However, it's usually more common to represent the grid with a 1-dimensional array. In this case, we need to map the column and row to an array index, so for now, we'll use: var index = row * map.cols + column;


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
    ]]
}

// Fetches the appropriate tile for a specific spot, plus any layering
map.getTile = (layer, column, row) => {
    return this.layers[layer][row * map.columns + column]
};

// Checks if a tile is solid (an obstacle)
// Tiles 3 and 5 are solid. The rest can be walked on
// Function looks through all layers at the coord and returns TRUE if one is solid
map.isSolidTileAtXY = (x,y) => {
    const column = Math.floor(x / this.tile_size);
    const row = Math.floor(y / this.tile_size);

    return this.layers.reduce((res, layer, index) => {
        const tile = this.getTile(index, column, row);
        const isSolid = tile === 3 || tile === 5;

        // If True, will return true; else default of false
        return res || isSolid
    }, false) // Passes in false as default res value
}

// SCROLL-VIEW RENDERING

// Iterates over the columns and rows to render the map:
// context: a 2D canvas context
// titleAtlas: an image object that contains the tile map
// map: the tile map object

Game._drawLayer = (layer) => {
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
    for (let i=startColumn; i <= endColumn; i++){
        for (let j=startRow; j <= endRow; j++){
            const tile = map.getTile(layer, i, j);
            const X = (i - startColumn) * map.tile_size + offsetX;
            const Y = (i - startRow) * map.tile_size + offsetY;
            // If NOT an empty tile (0)
            if (tile !== 0){
                this.context.drawImage( 
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
                    Math.round(X),
                    // y-axis coord to place top left of new image
                    Math.round(Y),
                    // the width to draw in the canvas (64px)
                    map.tile_size,
                    // the height to draw in the canvas (64px)
                    map.tile_size
                )
            }
        }
    };
}


Game.render = () => {
    // Draw the background map layer
    this._drawLayer(0);
    // Draw the top layer
    this._drawLayer(1)
    // Could add more as needed
}
