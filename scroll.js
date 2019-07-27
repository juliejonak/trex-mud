// Split the tile set into pieces
// In the matrix, each spot reference either an empty tile (0) or a tile in the set (1, 2, 3, etc.)
// Layering requires us to use 0 sometimes
// If tiles were a 2D matrix, then the returned value would just be tiles[column][row]. 

// However, it's usually more common to represent the grid with a 1-dimensional array. In this case, we need to map the column and row to an array index, so for now, we'll use: var index = row * map.cols + column;


const map = {
    // Creates an 8x8 map
    columns: 8,
    rows: 8,
    // With tiles 64px x 64px in size
    tile_size: 64,
    // sets up the tile designations for each spot on the board
    tiles: [
        1, 3, 3, 3, 1, 1, 3, 1,
        1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 2, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 2, 1, 1, 1, 1,
        1, 1, 1, 1, 2, 1, 1, 1,
        1, 1, 1, 1, 2, 1, 1, 1,
        1, 1, 1, 0, 0, 1, 1, 1
    ]
}

// Fetches the appropriate tile for a specific spot
map.getTile = (column, row) => {
    return this.tiles[row * map.columns + column]
};

// Iterates over the columns and rows to render the map:
// context: a 2D canvas context
// titleAtlas: an image object that contains the tile map
// map: the tile map object

for (let i=0; i < map.columns; i++){
    for (let x=0; x < map.rows; x++){
        const tile = map.getTile(i,x);
        // If NOT an empty tile (0)
        if (tile !== 0){
            context.drawImage( 
                // the tileset image
                tileAtlas,
                // top left x-axis coord of source
                (tile - 1) * map.tile_size, 
                // top left y-axis coord of source
                0,
                // width to draw from source (64px)
                map.tile_size,
                // height to draw from source (64px)
                map.tile_size,
                // x-axis coord to place top left of new image
                i * map.tile_size,
                // y-axis coord to place top left of new image
                x * map.tile_size,
                // the width to draw in the canvas (64px)
                map.tile_size,
                // the height to draw in the canvas (64px)
                map.tile_size
            )
        }
    }
}