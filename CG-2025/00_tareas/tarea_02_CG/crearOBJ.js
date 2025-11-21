/*
 * Script para crear un objeto 3D en OBJ
 *
 * Miranda Urban Solano A01752391
 * noviembre 2025
 */

'use strict';
const fs = require('fs'); // Importar el módulo nativo del sistema de archivos

// Función para crear el objeto
function crearObjeto(lados_circulo, altura, radio_base, radio_cima) {
    let vertices = [];
    let normales = [];
    let caras = [];
    
    // Calcular ángulo para los círculos
    let angleStep = 2 * Math.PI / lados_circulo;
    
    // Vértices centrales (1: base, 2: cima)
    vertices.push([0.0000, 0.0000, 0.0000]); // Base
    vertices.push([0.0000, altura, 0.0000]);  // Top
    
    // Crear vértices para la base
    for (let s = 0; s < lados_circulo; s++) {
        let angle = angleStep * s;
        let x = radio_base * Math.cos(angle);
        let z = radio_base * Math.sin(angle);
        vertices.push([x, 0.0000, z]);
    }
    
    // Crear vértices para el top
    for (let s = 0; s < lados_circulo; s++) {
        let angle = angleStep * s;
        let x = radio_cima * Math.cos(angle);
        let z = radio_cima * Math.sin(angle);
        vertices.push([x, altura, z]);
    }
    
    // Normales para tapas
    normales.push([0.0000, -1.0000, 0.0000]); // Base (hacia abajo)
    normales.push([0.0000, 1.0000, 0.0000]);  // Top (hacia arriba)
    
    // Crear normales para las caras laterales
    for (let s = 0; s < lados_circulo; s++) {
        let angle = angleStep * s;
        let nextAngle = angleStep * ((s + 1) % lados_circulo);
        
        // Puntos en la base
        let x1 = Math.cos(angle);
        let z1 = Math.sin(angle);
        let x2 = Math.cos(nextAngle);
        let z2 = Math.sin(nextAngle);
        
        let tx = x2 - x1;
        let tz = z2 - z1;
        
        // Vector desde base hasta arriba (considerando diferencia de radios)
        let bx = x1 * (radio_base - radio_cima);
        let bz = z1 * (radio_base - radio_cima);
        let by = altura;
        
        // Producto cruzado para obtener normal
        let nx = tz * by - bz * 0;
        let ny = 0 * bx - tx * by;
        let nz = tx * bz - tz * bx;
        
        // Normalizar
        let length = Math.sqrt(nx * nx + ny * ny + nz * nz);
        if (length > 0) {
            nx = nx / length;
            ny = ny / length;
            nz = nz / length;
        }
        
        // Agregar dos vectores normales iguales por cara
        normales.push([nx, ny, nz]);
        normales.push([nx, ny, nz]);
    }
    
    // Crear caras
    for (let s = 0; s < lados_circulo; s++) {
        let next_s = (s + 1) % lados_circulo;
        
        // Índices de vértices
        let base1 = 3 + s;
        let base2 = 3 + next_s;
        let top1 = 3 + lados_circulo + s;
        let top2 = 3 + lados_circulo + next_s;
        
        // Índices de normales
        let normalBase = 1;
        let normalTop = 2;
        let normalLateral1 = 3 + (s * 2);
        let normalLateral2 = 3 + (s * 2) + 1;
        
        // Base -> triángulo desde el centro
        caras.push([
            [base1, normalBase],
            [1, normalBase], 
            [base2, normalBase]
        ]);
        
        // Top -> triángulo desde el centro
        caras.push([
            [top1, normalTop],
            [top2, normalTop],
            [2, normalTop]
        ]);
        
        // Caras laterales
        // Primer triángulo
        caras.push([
            [base1, normalLateral1],
            [base2, normalLateral1],
            [top2, normalLateral1]
        ]);
        
        // Segundo triángulo
        caras.push([
            [base1, normalLateral2],
            [top2, normalLateral2],
            [top1, normalLateral2]
        ]);
    }
    
    return { vertices, normales, caras };
}

// Función para generar el OBJ y guardarlo en archivo
function generarOBJ(lados_circulo, altura, radio_base, radio_cima) {
    // Inicializar archivo
    const nombre_archivo = `objeto_${lados_circulo}_${altura}_${radio_base}_${radio_cima}.obj`;
    let contenido = `# OBJ file ${nombre_archivo}\n`;

    const objeto = crearObjeto(lados_circulo, altura, radio_base, radio_cima); // Crear objeto para el archivo
    
    // Agregar información de vértices
    contenido += `# ${objeto.vertices.length} vertices\n`;
    objeto.vertices.forEach(vertice => {
        contenido += `v ${vertice[0].toFixed(4)} ${vertice[1].toFixed(4)} ${vertice[2].toFixed(4)}\n`;
    });
    
    // Agregar información de normales
    contenido += `# ${objeto.normales.length} normals\n`;
    objeto.normales.forEach(normal => {
        contenido += `vn ${normal[0].toFixed(4)} ${normal[1].toFixed(4)} ${normal[2].toFixed(4)}\n`;
    });
    
    // Agregar información de caras
    contenido += `# ${objeto.caras.length} faces\n`;
    objeto.caras.forEach(cara => {
        let faceStr = "f";
        cara.forEach(indices => {
            faceStr += ` ${indices[0]}//${indices[1]}`;
        });
        contenido += faceStr + "\n";
    });
    
    // Guardar archivo
    fs.writeFileSync(nombre_archivo, contenido);
    console.log(`Archivo OBJ generado: ${nombre_archivo}`);
}

function main() {
    // Obtener argumentos de línea de comandos
    let args = process.argv.slice(2);
    
    // Valores default
    let lados_circulo = 8;
    let altura = 6.0;
    let radio_base = 1.0;
    let radio_cima = 0.8;
    
    // Si se proporcionan argumentos, leerlos
    if (args.length >= 1) {
        lados_circulo = parseInt(args[0]);
    }
    if (args.length >= 2) {
        altura = parseFloat(args[1]);
    }
    if (args.length >= 3) {
        radio_base = parseFloat(args[2]);
    }
    if (args.length >= 4) {
        radio_cima = parseFloat(args[3]);
    }
    
    // Verificar que los argumentos cumplan con las condiciones establecidas
    if (lados_circulo < 3 || lados_circulo > 36 || isNaN(lados_circulo)) {
        lados_circulo = 8;
    }
    
    if (altura <= 0 || isNaN(altura)) {
        altura = 6.0;
    }
    
    if (radio_base <= 0 || isNaN(radio_base)) {
        radio_base = 1.0;
    }
    
    if (radio_cima <= 0 || isNaN(radio_cima)) {
        radio_cima = 0.8;
    }
    
    generarOBJ(lados_circulo, altura, radio_base, radio_cima);
}

main();