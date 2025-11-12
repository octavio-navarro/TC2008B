function face() {
    let arrays = {
        a_position: {
            numComponents: 2,
            data: []
        },
        indices: {
            numComponents: 3,
            data: []
        },
        //a_color: { numComponents: 4, data: [] },
    };

    let sides = 40;
    let centerX = canvas.width / 2;
    let centerY = canvas.height / 2;
    let radius = 200;
    let color = [0.3, 0.5, 0.9, 0.8];

    // Initialize the center vertex at the origin
    arrays.a_position.data.push(centerX);
    arrays.a_position.data.push(centerY);
    //arrays.a_color.data.push(...color);

    let angleStep = 2 * Math.PI / sides;

    // Loop over the sides to create the rest of the vertices
    for (let s=0; s<sides; s++) {
        let angle = angleStep * s;
        // Generate the coordinates of the vertex
        let x = centerX + Math.cos(angle) * radius;
        let y = centerY + Math.sin(angle) * radius;
        arrays.a_position.data.push(x);
        arrays.a_position.data.push(y);
        // Use a defined color for the vertex
        //arrays.a_color.data.push(color);
        // Define the triangles, in counter clockwise order
        arrays.indices.data.push(0);
        arrays.indices.data.push(s + 1);
        arrays.indices.data.push(((s + 2) <= sides) ? (s + 2) : 1);
    }

    return arrays;
}

function pivote() {
    let arrays = {
        a_position: {
            numComponents: 2,
            data: []
        },
        indices: {
            numComponents: 3,
            data: []
        },
        //a_color: { numComponents: 4, data: [] },
    };

    let sides = 4;
    let centerX = canvas.width / 2;
    let centerY = canvas.height / 2;
    let radius = 20;
    let color = [0.3, 0.5, 0.9, 0.8];

    // Initialize the center vertex at the origin
    arrays.a_position.data.push(centerX);
    arrays.a_position.data.push(centerY);
    //arrays.a_color.data.push(...color);

    let angleStep = 2 * Math.PI / sides;

    // Loop over the sides to create the rest of the vertices
    for (let s=0; s<sides; s++) {
        let angle = angleStep * s;
        // Generate the coordinates of the vertex
        let x = centerX + Math.cos(angle) * radius;
        let y = centerY + Math.sin(angle) * radius;
        arrays.a_position.data.push(x);
        arrays.a_position.data.push(y);
        // Use a defined color for the vertex
        //arrays.a_color.data.push(color);
        // Define the triangles, in counter clockwise order
        arrays.indices.data.push(0);
        arrays.indices.data.push(s + 1);
        arrays.indices.data.push(((s + 2) <= sides) ? (s + 2) : 1);
    }

    return arrays;
}

export {face, pivote };