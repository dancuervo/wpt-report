let fs = require('fs');


let procesaJSON = (data) => {
    data = JSON.parse(data)
    //data = JSON.stringify(data)

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


        totalTime = entriesArr[i]._dns_ms + entriesArr[i]._connect_ms + entriesArr[i]._ssl_ms + entriesArr[i]._ttfb_ms + entriesArr[i]._download_ms;

        req_ready = entriesArr[i]._load_start + totalTime;


        if (entriesArr[i]._cached === 0) {

            var entradas = {};

            entradas['request'] = entriesArr[i]._number;
            entradas['url'] = entriesArr[i]._full_url;
            entradas['req_start'] = entriesArr[i]._load_start;
            entradas['total_kb_download'] = entriesArr[i]._load_start;
            entradas['total_download_time'] = totalTime;
            entradas['req_ready'] = req_ready;
            entradas['startedDateTime'] = date;

            no_cached.push(entradas);

        }

        if (entriesArr[i]._cached === 1) {

            var entradas_cacheadas = {};

            entradas_cacheadas['request'] = entriesArr[i]._number;
            entradas_cacheadas['url'] = entriesArr[i]._full_url;
            entradas_cacheadas['req_start'] = entriesArr[i]._load_start;
            entradas_cacheadas['total_kb_download'] = entriesArr[i]._load_start;
            entradas_cacheadas['total_download_time'] = totalTime;
            entradas_cacheadas['req_ready'] = req_ready;
            entradas_cacheadas['startedDateTime'] = date;

            cached.push(entradas_cacheadas);
        }
    }
    lista['no_cached'] = no_cached;
    lista['cached'] = cached;
    let requests = {};
    requests['entradas'] = lista;
    requests = JSON.stringify(requests);
    let titulo = Math.floor(Math.random() * 100);
    let OutFile = `./reportsNewJson/${titulo}-WPTreport.json`;

    fs.writeFile(OutFile, requests, (error) => {
        if (error) throw error;
        console.log('WPTReport guardado!');
    });
    return
}


var origen = './har'

let leer = () => {
    fs.readdir(origen, (error, items) => {
        if (error) throw error
        console.log(`Items en el directorio: ${items}\n`)
        convertir(items)
    })
}
let convertir = (items) => {
    items.forEach(element => {
        console.log(`Enviando ${element} para conversion\n`)
        leeHar(element)
    });
}

let leeHar = (element) => {
    fs.readFile('./har/' + element, 'utf-8', (error, data) => {
        if (error) throw error
        procesaJSON(data)
    })
}

leer();

