/*
Baja archivo HAR de WPT //exporta archivo HAR - https://www.webpagetest.org/export.php?bodies=1&pretty=1&test=190916_5G_212c81909a617586f70df1d2c63d33b7
https://www.webpagetest.org/export.php?bodies=1&pretty=1&test=HARURL

=> https://medium.com/@dickydraknes/how-to-fetch-data-using-async-await-express-js-based-request-f760736e345c

const fetch = require('node-fetch');
function getHARremote(){
    let file = 'HARURL';
    return fetch(`https://www.webpagetest.org/export.php?bodies=1&pretty=1&test=#{HARURL}`);
}

const getHar = () => {
    let harId = getHARremote;
    console.log();
}
WPT exporta arcivo HAR que es un JSON con los detalles del análisis
los sucesivos test son identificados con la llave "_cached": el primer test es "_cached": 0,
*/

/*TOTAL resource'a download time
DNS Lookup: _dns_ms
Initial conection: _connect_ms
SSL Negotiation: _ssl_ms
Time for first bite: _ttfb_ms
Content Download: _download_ms
*/
//recibe el nombre que llega por formulario para usar como nombre al guardar el json final
module.exports.reportJSON = function(url, hash){
    const fetch = require('node-fetch');
    let urlCliente  = url;
    let hashHar     = hash;
    
    //fetch file from WPT
    let fetchHar = (hashHar) => {
        return fetch(`https://www.webpagetest.org/export.php?bodies=1&pretty=1&test=${hashHar}`);
    }
    //https://www.webpagetest.org/export.php?bodies=1&pretty=1&test=190916_5G_212c81909a617586f70df1d2c63d33b7
    //const report = require('./har/www.brasil247.com.191105_8K_691cc03c178613c084f5cc7fcceb3462.json');
    console.log('Report solicitado!');

    //guardar .HAR en disco
    const fs = require('fs');
    fs.writeFile(`./reports/${url}`, fetchHar(hashHar), (error) => {
        if(error) throw error;
        console.log(`Report salvo para ${url}`);
    });


    //listarRequest(fetchHar(), url);
}

//function crearJSON a partir de HAR
 
function listarRequest(report, url) {
    //exhibe las requests
    
    let entriesArr = report.log.entries;
    let lista = [];

    for (let i = 0; i < entriesArr.length; i++) {
        //los valores de 0 se representan como -1 y rompen la suma
        let totalTime;

        if (entriesArr[i]._dns_ms == -1) { entriesArr[i]._dns_ms = 0 };
        if (entriesArr[i]._connect_ms == -1) { entriesArr[i]._connect_ms = 0 };
        if (entriesArr[i]._ssl_ms == -1) { entriesArr[i]._ssl_ms = 0 };
        if (entriesArr[i]._ttfb_ms == -1) { entriesArr[i]._ttfb_ms = 0 };
        if (entriesArr[i]._download_ms == -1) { entriesArr[i]._download_ms = 0 };
        
        //total download time de cada request
        totalTime = entriesArr[i]._dns_ms + entriesArr[i]._connect_ms + entriesArr[i]._ssl_ms + entriesArr[i]._ttfb_ms + entriesArr[i]._download_ms;
        //request completada
        req_ready = entriesArr[i]._load_start+ totalTime;

        //agrega los request a la lista si pertenecen al primer test - '_cached: 0'
        if (entriesArr[i]._cached == 0) {
            let entradas = {};

            //lista.push("<b>Request: [" + entriesArr[i]._number + "]</b> => " + entriesArr[i]._full_url + "<br><b>Total Download Time [" + totalTime + "]ms<b><hr>");
            entradas['request']                = entriesArr[i]._number;
            entradas['url']                    = entriesArr[i]._full_url;
            entradas['req_start']              = entriesArr[i]._load_start;
            entradas['total_kb_download']      = entriesArr[i]._load_start;
            entradas['total_download_time']    = totalTime;
            entradas['req_ready']              = req_ready;

            lista.push(entradas);
        }
    }
    let requests = {};
    requests['entradas']                       = lista;

    requests = JSON.stringify(requests);
    //guarda el report

    let OutFile = `./reports/${url}-WPTreport.json`;

    let fs = require('fs');
    fs.appendFile(OutFile, requests, function(error){
        if(error) throw error;
        console.log('WPTReport guardado!');
    });

    return lista, entriesArr;
    //creatTabla(lista, entriesArr);
}
//crea tabla en html
function crearTabla(lista, entriesArr){
    //imprime las request con los detalles de nº requisicion y total download time
    for (let i = 0; i < lista.length; i++) {
        console.log(lista[i] + "\n");
    }
    console.log("\nENTRADAS 1er Test: [" + lista.length + "]\nRequest del primer test (sin cache).\nENTRADAS todos los test: " + entriesArr.length );
}

module.exports.listarelatorios = (app, res)=>{
    //abre el directorio con los reportes anteriores y crea una lista que se envia a la vista ASYNC
    const fs = require('fs');
    fs.readdir('./reports/', (error, files) => {
        if (error) {
            console.log(`Error al recuperar archivos: ${error}`);
        }
        res.render(`relatoriosanteriores`, { 'lista': files });
    });
}

//empieza programa
//reportJSON();