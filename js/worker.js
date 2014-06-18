//http://www.html5rocks.com/en/tutorials/file/filesystem-sync/?redirect_from_locale=es#toc-passing-data
//http://fr.openclassrooms.com/informatique/cours/html5-web-workers-le-monde-parallele-du-javascript/la-communication-envoyer-et-recevoir-des-messages

self.addEventListener('message', function(e) {
    console.log(e.data);/*
    var files = e.data;
    var buffers = [];

    // Read each file synchronously as an ArrayBuffer and
    // stash it in a global array to return to the main app.
    [].forEach.call(files, function(file) {
        var reader = new FileReaderSync();
        buffers.push(reader.readAsArrayBuffer(file));
    });

    postMessage(buffers);*/
}, false);