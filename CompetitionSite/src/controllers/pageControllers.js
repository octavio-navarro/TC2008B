import express from 'express';
import fs from 'fs';

function getHomePage(req, res) {
    fs.readFile('public/html/index.html', 'utf8', function(err, data) {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred');
        }
        else {
            res.send(data);
        }
    });
}

export {getHomePage};