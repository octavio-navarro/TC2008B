/*
 * Functions for creating shapes
 *
 * Miranda Urban Solano A01752391
 * noviembre 2025
 * 
*/

// Create the data for drawing all the elements of the cat
function emojiCat() {
    let yellow = [1.0, 0.8, 0.2, 1.0]; // Yellow
    let black = [0, 0, 0, 1.0]; // Black

    // Initialize variables for each figure needed
    let drawings = {
        carita: { // Backgroung circle
            sides: 30,
            color: yellow,
            pos_x: 0,
            pos_y:0,
            size_x : 3,
            size_y : 2,
        },
        ojo1: { // Left eye
            sides: 30,
            color: black,
            pos_x: -0.1,
            pos_y: 0.15,
            size_x : 20,
            size_y : 10,
        },
        ojo2: { // Right eye
            sides: 30,
            color: black,
            pos_x: 0.1,
            pos_y: 0.15,
            size_x : 20,
            size_y : 10,
        },
        nariz:{ // Nose
            sides: 30,
            color: [0.4, 0.2, 0.0, 1.0], // Café para nariz de gato
            pos_x: 0,
            pos_y: -0.12,
            size_x : 25,
            size_y : 20,
        },
    };

    // The arrays are initially empty
    let arrays =
    {
        // Two components for each position in 2D
        a_position: { numComponents: 2, data: [] },
        // Four components for a color (RGBA)
        a_color:    { numComponents: 4, data: [] },
        // Three components for each triangle, the 3 vertices
        indices:  { numComponents: 3, data: [] }
    };

    let vertexOffset = 0; // Counter for vertices

    // Draw the objects previously defined
    for (let dr in drawings) {
        // Initialize variables for each figure
        let drawing = drawings[dr];
        let color = drawing.color;
        let sides = drawing.sides;
        let pos_x = drawing.pos_x;
        let pos_y = drawing.pos_y;
        let size_x = drawing.size_x;
        let size_y = drawing.size_y;
        let centerIndex = vertexOffset; // For defining the center

        // Initialize the center vertex, at the origin and with yellow color
        arrays.a_position.data.push(pos_x);
        arrays.a_position.data.push(pos_y);
        arrays.a_color.data.push(...color);
        vertexOffset++;

        let angleStep = 2 * Math.PI / sides;

        // Loop over the sides to create the rest of the vertices
        for (let s=0; s<sides; s++) {
            let angle = angleStep * s;
            // Generate the coordinates of the vertex
            let x = pos_x + Math.cos(angle) / size_x;
            let y = pos_y + Math.sin(angle) / size_y;
            arrays.a_position.data.push(x);
            arrays.a_position.data.push(y);
            // Generate a yellow color for the vertex
            arrays.a_color.data.push(...color);

            vertexOffset++; 
        }

        // Define the triangles, in counter clockwise order
        for (let s = 0; s < sides; s++) {
            let centerIdx = centerIndex;
            let currentIdx = centerIndex + s + 1;
            let nextIdx = centerIndex + ((s + 1) % sides) + 1;
            
            arrays.indices.data.push(centerIdx);
            arrays.indices.data.push(currentIdx);
            arrays.indices.data.push(nextIdx);
        }
        
        console.log(arrays);
    }

    // Add other figures to complete the emoji

    // Orejita 1 (izquierda)
    arrays.a_position.data.push(-0.17, 0.7);    // Vertex 1
    arrays.a_position.data.push(-0.25, 0.3);    // Vertex 2  
    arrays.a_position.data.push(0.1, 0.3);      // Vertex 3

    arrays.a_color.data.push(0.9, 0.7, 0.15, 1.0);
    arrays.a_color.data.push(1.0, 0.8, 0.2, 1.0);
    arrays.a_color.data.push(1.0, 0.8, 0.2, 1.0);
    
    arrays.indices.data.push(
        vertexOffset, 
        vertexOffset + 1, 
        vertexOffset + 2
    );
    vertexOffset += 3;

    // Orejita 1 (izquierda adentro)
    arrays.a_position.data.push(-0.15, 0.6);    // Vertex 1
    arrays.a_position.data.push(-0.20, 0.4);    // Vertex 2  
    arrays.a_position.data.push(-0.05, 0.45);   // Vertex 3

    arrays.a_color.data.push(1.0, 0.7, 0.8, 1.0);
    arrays.a_color.data.push(1.0, 0.6, 0.8, 1.0);
    arrays.a_color.data.push(1.0, 0.6, 0.8, 1.0);
    
    arrays.indices.data.push(
        vertexOffset, 
        vertexOffset + 1, 
        vertexOffset + 2
    );
    vertexOffset += 3;

    // Orejita 2 (derecha)
    arrays.a_position.data.push(0.17, 0.7);     // Vertex 1
    arrays.a_position.data.push(0.25, 0.3);     // Vertex 2  
    arrays.a_position.data.push(-0.1, 0.3);     // Vertex 3

    arrays.a_color.data.push(0.9, 0.7, 0.15, 1.0);
    arrays.a_color.data.push(1.0, 0.8, 0.2, 1.0);
    arrays.a_color.data.push(1.0, 0.8, 0.2, 1.0);

    arrays.indices.data.push(
        vertexOffset, 
        vertexOffset + 1, 
        vertexOffset + 2
    );
    vertexOffset += 3;

    // Orejita 2 (derecha adentro)
    arrays.a_position.data.push(0.15, 0.6);     // Vertex 1
    arrays.a_position.data.push(0.20, 0.4);     // Vertex 2  
    arrays.a_position.data.push(0.05, 0.45);    // Vertex 3

    arrays.a_color.data.push(1.0, 0.7, 0.8, 1.0);
    arrays.a_color.data.push(1.0, 0.6, 0.8, 1.0);
    arrays.a_color.data.push(1.0, 0.6, 0.8, 1.0);
    
    arrays.indices.data.push(
        vertexOffset, 
        vertexOffset + 1, 
        vertexOffset + 2
    );
    vertexOffset += 3;

    // Boquita
    arrays.a_position.data.push(-0.2, -0.25);   // Vertex 1
    arrays.a_position.data.push(-0.1, -0.3);    // Vertex 2
    arrays.a_position.data.push(0.0, -0.32);    // Vertex 3
    arrays.a_position.data.push(0.1, -0.3);     // Vertex 4
    arrays.a_position.data.push(0.2, -0.25);    // Vertex 5

    arrays.a_color.data.push(0, 0, 0, 1.0);
    arrays.a_color.data.push(0, 0, 0, 1.0);
    arrays.a_color.data.push(0, 0, 0, 1.0);
    arrays.a_color.data.push(0, 0, 0, 1.0);
    arrays.a_color.data.push(0, 0, 0, 1.0);

    arrays.indices.data.push(
        vertexOffset, vertexOffset + 1, vertexOffset + 2,  // Triangle 1
        vertexOffset + 1, vertexOffset + 2, vertexOffset + 3,  // Triangle 2
        vertexOffset + 2, vertexOffset + 3, vertexOffset + 4   // Triangle 3
    );

    vertexOffset += 5;

    return arrays;
};

// Create a pivot
function pivot(color) {
    let arrays = {
        a_position: { numComponents: 2, data: [] },
        a_color: { numComponents: 4, data: [] },
        indices: { numComponents: 3, data: [] }
    };

    let sides = 7;

    // Initialize the center vertex, at the origin and with yellow color
    arrays.a_position.data.push(0);
    arrays.a_position.data.push(0);
    arrays.a_color.data.push(...color);

    let angleStep = 2 * Math.PI / sides;

    // Loop over the sides to create the rest of the vertices
    for (let s=0; s<sides; s++) {
        let angle = angleStep * s;
        // Generate the coordinates of the vertex
        let x = Math.cos(angle) / 30;
        let y = Math.sin(angle) / 30;
        arrays.a_position.data.push(x);
        arrays.a_position.data.push(y);
        // Generate a yellow color for the vertex
        arrays.a_color.data.push(...color);

        // Define the triangles, in counter clockwise order
        arrays.indices.data.push(0);
        arrays.indices.data.push(s + 1);
        arrays.indices.data.push(((s + 2) <= sides) ? (s + 2) : 1);
    }
    return arrays;
};

export {emojiCat, pivot}