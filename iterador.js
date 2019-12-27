//function importarJSON() {
 
module.exports.listarRequest = (report) => {
    //exhibe las requests
    let entriesArr = report.log.entries;
    let lista = [];
    for (let i = 0; i < entriesArr.length; i++) {
        //los valores de 0 se representan como -1 y rompen la suma
        let totalTime;
        let arrInd = entriesArr[i]._index + 1;

        if (entriesArr[i]._dns_ms == -1) { entriesArr[i]._dns_ms = 0 };
        if (entriesArr[i]._connect_ms == -1) { entriesArr[i]._connect_ms = 0 };
        if (entriesArr[i]._ssl_ms == -1) { entriesArr[i]._ssl_ms = 0 };
        if (entriesArr[i]._ttfb_ms == -1) { entriesArr[i]._ttfb_ms = 0 };
        if (entriesArr[i]._download_ms == -1) { entriesArr[i]._download_ms = 0 };
        
        //total download time de cada request
        totalTime = entriesArr[i]._dns_ms + entriesArr[i]._connect_ms + entriesArr[i]._ssl_ms + entriesArr[i]._ttfb_ms + entriesArr[i]._download_ms;

        //agrega los request a la lista si pertenecen al primer test - '_cached: 0'
        if (entriesArr[i]._cached == 0) {

            lista.push("Request: [" + entriesArr[i]._number + "] => " + entriesArr[i]._full_url + "\nTotal Download Time [" + totalTime + "]");
        }
    }
    //imprime las request con los detalles de nº requisicion y total download time
    for (let i = 0; i < lista.length; i++) {
        console.log(lista[i] + "\n");
    }
    console.log("\nENTRADAS 1er Test: [" + lista.length + "]\nRequest del primer test (sin cache).\nENTRADAS todos los test: " + entriesArr.length );
}