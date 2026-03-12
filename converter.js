// Source - https://stackoverflow.com/a/10011078
// Posted by mihai, modified by community. See post 'Timeline' for change history
// Retrieved 2026-03-11, License - CC BY-SA 3.0

var fs = require('fs');
var latest_response = JSON.parse(fs.readFileSync('./dataFiles/latest_response.json', 'utf8')).values;



function convert(response) {
    let hosts = [];
    if (response[3]) {
        hosts = response[3].split('\n');
        hosts = hosts.map(h => h.trim());
    }

    return {
        id: crypto.randomUUID(),
        number: response[0],
        title: response[1],
        date: response[2],
        hosts: hosts
    }

}

function run() {
    let data = latest_response.map(lr => convert(lr));
    fs.writeFileSync('./dataFiles/episode_list.json', JSON.stringify(data));

}

run();