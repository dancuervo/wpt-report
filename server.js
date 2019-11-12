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
const wptReportToJson = wptReport.reportJSON;
const listarelatorios = wptReport.listarelatorios;

app.get('/', (req, res) => {

    res.render(`index`);
})

app.get('/listarelatorios', (req, res) => {
    listarelatorios(app, res);
});

app.get('/novoRelatorio', (req, res) => {
    res.render(`novoRelatorio`);
});

app.post('/form', urlencodedParser, (req, res) => {
    if (req.body) {
        console.log("datos recibidos de form: " + req.body.site + req.body.hash);
        let arquivo = req.body.site;
        let hash = req.body.hash;
        wptReportToJson(arquivo, hash);

        res.send(
            `<p>Report guardado: ${arquivo}</p>
            <p> Report JSON criado para o cliente ${arquivo} <p>
            <a href="reports/${arquivo}">Abrir ${arquivo}</a> `
        );
    }
    else {
        return res.sendStatus(400);
    }
});

app.post('/gethar', urlencodedParser, (req, res) => {
    //hace fetch al HAR de WPT
    //https://www.webpagetest.org/export.php?bodies=1&pretty=1&test=HASH
    //recibe: url examinada + HASH
    //guarda archivo har en disco
    if (req.body) {

        let harReq = 'https://www.webpagetest.org/export.php?bodies=1&pretty=1&test=';
        let url = req.body.site;
        let hash = req.body.hash;
        let getHar = harReq + hash;

        async function Data(getHar, url) {
            await fetch(getHar)
                .then(
                    (response) => {
                        if (response.status !== 200) {
                            console.log(`Fetch falló con código: ${response.status}`)
                            return;
                        }
                        //response
                        console.log('Buscando .har en WPT');

                        response.json().then((data) => {
                            console.log('Contenido archivo recuperado en WPT');
                            //console.log(data);
                            //guarda en carpeta HAR crear function

                            const fs = require('fs');
                            const dir = './har/';
                            console.log('\nPreparando para almacenar en dir: ' + dir + ' + url: ' + url + '\n');
                            let datosString = JSON.stringify(data);
                            fs.writeFileSync(dir + url + '.har', datosString);
                            console.log('Guardando datos en archivo');

                        });


                    }).catch((error) => {
                        console.log(`Error al realizar el fetch: ${error}`);
                    })
        }

        Data(getHar, url);
    }
    res.redirect('/listarelatorios');
});
//muestra en consola
/*
app.get(`/reports/:id`, (req, res) => {
    console.log(req.params);
    let id = req.params.id;
    let lista = require(`./reports/${id}report.json`);

    //tratando json para iterar array
     //console.log(require(`./reports/${id}report.json`));
    /*
    res.sendfile(`./reports/${id}report.json`)
});
*/

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
