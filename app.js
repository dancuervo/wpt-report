/*
Baja archivo HAR de WPT //exporta archivo HAR
FORMATO
https://www.webpagetest.org/export.php?bodies=1&pretty=1&test=190916_5G_212c81909a617586f70df1d2c63d33b7

https://www.webpagetest.org/export.php?bodies=1&pretty=1&test=HARURL

WPT exporta arcivo HAR que es un JSON con los detalles del análisis
los sucesivos test son identificados con la llave "_cached": el primer test es "_cached": 0,
*/

/*
TOTAL resource'S download time
DNS Lookup: _dns_ms
Initial conection: _connect_ms
SSL Negotiation: _ssl_ms
Time for first bite: _ttfb_ms
Content Download: _download_ms
*/

//recibe el req.body de un post con los datos: url de la cuenta y .har de la prueba realizada por WPT
module.exports.obtenerHAR = function (req, fetch) {
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
                    console.log('Buscando .har en https://www.webpagetest.org/');

                    response.json()
                    .then((data) => {
                        console.log('Contenido archivo recuperado en WPT');
                        //guarda en carpeta HAR crear function
                        const fs = require('fs');
                        const dir = './har/';
                        
                        console.log('Preparando para almacenar en dir: ' + dir + ' + url: ' + url);
                        let datosString = JSON.stringify(data);
                       
                        fs.writeFileSync(dir + url + '.har', datosString);
                        console.log('Guardando datos en archivo\nConvirtiendo HAR en Json');

                        harToJson(data, url)
                    });
                }).catch((error) => {
                    console.log(`Error al realizar el fetch: ${error}`);
                })
    }
    Data(getHar, url);
}

function harToJson(data, url) {
    //exhibe las requests
    
    let date = data.log.pages[0].startedDateTime;
    let entriesArr = data.log.entries;
    let lista = {};
    let no_cached = [];
    let cached = [];

    for (var i = 0; i < entriesArr.length; i++) {
        //los valores de 0 se representan como -1 y rompen la suma
        var totalTime;

        if (entriesArr[i]._dns_ms == -1) { entriesArr[i]._dns_ms = 0 };
        if (entriesArr[i]._connect_ms == -1) { entriesArr[i]._connect_ms = 0 };
        if (entriesArr[i]._ssl_ms == -1) { entriesArr[i]._ssl_ms = 0 };
        if (entriesArr[i]._ttfb_ms == -1) { entriesArr[i]._ttfb_ms = 0 };
        if (entriesArr[i]._download_ms == -1) { entriesArr[i]._download_ms = 0 };

        //total download time de cada request
        totalTime = entriesArr[i]._dns_ms + entriesArr[i]._connect_ms + entriesArr[i]._ssl_ms + entriesArr[i]._ttfb_ms + entriesArr[i]._download_ms;
        //request completada
        req_ready = entriesArr[i]._load_start + totalTime;

        //agrega los request a la lista si pertenecen al primer test - '_cached: 0'
        if (entriesArr[i]._cached === 0) {
            
            var entradas = {};
            
            //lista.push("<b>Request: [" + entriesArr[i]._number + "]</b> => " + entriesArr[i]._full_url + "<br><b>Total Download Time [" + totalTime + "]ms<b><hr>");
            entradas['request'] = entriesArr[i]._number;
            entradas['url'] = entriesArr[i]._full_url;
            entradas['req_start'] = entriesArr[i]._load_start;
            entradas['total_kb_download'] = entriesArr[i]._load_start;
            entradas['total_download_time'] = totalTime;
            entradas['req_ready'] = req_ready;
            entradas['startedDateTime'] = date;
            
            no_cached.push(entradas);

        }
        
        if(entriesArr[i]._cached === 1){

            var entradas_cacheadas = {};

            //agrega los request a la lista si pertenecen al segundo test - '_cached: 1'
            //lista.push("<b>Request: [" + entriesArr[i]._number + "]</b> => " + entriesArr[i]._full_url + "<br><b>Total Download Time [" + totalTime + "]ms<b><hr>");
            entradas_cacheadas['request'] = entriesArr[i]._number;
            entradas_cacheadas['url'] = entriesArr[i]._full_url;
            entradas_cacheadas['req_start'] = entriesArr[i]._load_start;
            entradas_cacheadas['total_kb_download'] = entriesArr[i]._load_start;
            entradas_cacheadas['total_download_time'] = totalTime;
            entradas_cacheadas['req_ready'] = req_ready;
            entradas_cacheadas['startedDateTime'] = date;

            cached.push(entradas_cacheadas);
            //console.log(`Entrada: [${i}] ${entriesArr[i]._full_url}`)
        }
    }
    lista['no_cached'] = no_cached ;
    lista['cached'] = cached;
    //console.log(`\nLista de req: ${JSON.stringify(lista)}`)
    let requests = {};
    requests['entradas'] = lista;
    requests = JSON.stringify(requests);
    //guarda el report
    let OutFile = `./reports/[new_model]${url}-WPTreport.json`;
    let fs = require('fs');
    fs.writeFile(OutFile, requests, (error) => {
        if (error) throw error;
        console.log('WPTReport guardado!');
    });
    return lista, entriesArr;
    //creatTabla(lista, entriesArr);
}

module.exports.listarelatorios = (app, res) => {
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