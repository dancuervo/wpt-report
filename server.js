const express = require('express');
const app = express();
const port = 3000;

//require HTTP
const http = require('http');
//require body-parser para tratar POST requests
const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
const urlencodedParser = bodyParser.urlencoded({ extended: false });
// parse application/json
const jsonParser = bodyParser.json();
//require FETCH
const fetch = require('node-fetch');
//require and configure PUG
const pug = require('pug');
app.set('view engine', 'pug')
//static
app.use(express.static('./views/includes'));
const wptReport = require('./app.js');
const listarelatorios = wptReport.listarelatorios;
const DownloadtHAr = wptReport.obtenerHAR;
const harToJson = wptReport.reportJSON;
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/', (req, res) => {
    res.render(`index`);
})

app.get('/listarelatorios', (req, res) => {
    listarelatorios(app, res);
});

app.get('/novoRelatorio', (req, res) => {
    res.render('novoRelatorio');
});


app.post('/gethar', urlencodedParser, (req, res) => {
    //hace fetch al HAR de WPT
    //https://www.webpagetest.org/export.php?bodies=1&pretty=1&test=HASH
    //recibe: url examinada + HASH
    //guarda archivo har en disco
    if (req.body) {
        DownloadtHAr(req, fetch);
        console.log("datos recibidos de form: " + req.body.site + req.body.hash);
    }else{
        console.log('error al recuperar .HAR de WPT');
    }
    res.redirect('/listarelatorios');
});

//renderiza report json 
app.get('/reports/:id', (req, res) => {
    let id = req.params.id;
    let lista = require(`./reports/${id}`);
    lista = JSON.stringify(lista);
    res.render('./report', { caso: id, lista: JSON.parse(lista) });
});

app.get('/about', (req, res) => {
    res.render('about');
});


app.listen(port, () => console.log(`App listening port ${port}!`));
