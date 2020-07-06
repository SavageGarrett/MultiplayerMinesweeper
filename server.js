const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

app.use(express.static('client'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client'))
})

app.get('/js/sketch.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/js/sketch.js'))
})

app.get('/font/midazzle', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/font/midazzle.ttf'))
})

// app.get('/js/gameboard.js', (req, res) => {
//     res.sendFile(path.join(__dirname, 'client/js/sketch.js'))
// })

app.listen(port, () => {
    console.log(`Minesweeper server running on http://localhost:${port}`)
})