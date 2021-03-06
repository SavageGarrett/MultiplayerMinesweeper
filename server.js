const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

app.use(express.static('client'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client'));
})

app.get('/js/sketch.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/js/sketch.js'));
})

app.get('/font/midazzle', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/font/midazzle.ttf'));
})

app.get('/img/:fname', (req, res) => {
    console.log(fname)
    let fname = req.params.fname;
    res.sendFile(path.join(__dirname, `client/img/${fname}`));
})

app.get('/css/:fname', (req, res) => {
    console.log(fname)
    let fname = req.params.fname;
    res.sendFile(path.join(__dirname, `client/css/${fname}`));
})

// app.get('/js/gameboard.js', (req, res) => {
//     res.sendFile(path.join(__dirname, 'client/js/sketch.js'))
// })

app.listen(port, () => {
    console.log(`Minesweeper server running on http://localhost:${port}`)
})