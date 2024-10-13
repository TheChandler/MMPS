console.log('test')

let json = {}
function setJson(value) {
    json = value
}

let hosts = []
let podcasts = []
let selectedHosts = []
fetch('responseFiles/latest_response.json')
    .then((response) => {
        response.json()
            .then(j => {
                setJson(j)
                runBuilder(j)
            })

    })

function runBuilder() {

    let data = json.values
    let indexes = {}

    let startAdding = false;
    for (const [index, value] of data[0].entries()) {
        if (value == "Rolling>>>>") {
            break;
        }
        if (startAdding) {
            hosts.push({
                id: index,
                name: value,
                podcasts: [],
            })
        }
        if (value == "Year") {
            startAdding = true;
        }
    }
    let rows = data.slice(1)
    for (const [index, rowData] of rows.entries()) {
        if (!rowData) {
            continue
        }
        console.log("Row data", rowData)
        let podcast = {
            id: index,
            episodeNumber: rowData[0],
            title: rowData[1],
            date: rowData[2],
            hostsString: rowData[3],
            hosts: []
        }
        for (let host of hosts) {
            // console.log(rowData[host.id])
            if (rowData[host.id] == "1") {
                host.podcasts.push(index)
                podcast.hosts.push(host.id)
            }
        }
        if (podcast.hosts.length > 0){
            podcasts.push(podcast)
        }
    }

    hosts = hosts.sort((a,b) => a.podcasts.length < b.podcasts.length)

    updateHostsDisplay(hosts)
    updatePodcastsDisplay(podcasts)
    createChart()
}

function updateHostsDisplay(hosts) {
    const div = document.getElementById("hosts")
    for (let host of hosts) {
        let newDiv = document.createElement('div')
        newDiv.setAttribute("onclick", `updateHostSelection(${host.id})`);
        newDiv.id = `host-${host.id}`;
        newDiv.className = `host-container card fs-3 mb-2`;

        newDiv.innerHTML = "<div class='row g-0'>" +
            `<div class="host-name col p-2">${host.name}</div><div class="host-appearances col-4 bg-secondary text-white rounded-end text-center align-content-center">${host.podcasts.length}</div>` +
            "</div>"
        div.appendChild(newDiv)
        // console.log("appended", newDiv)
    }
}

function updatePodcastsDisplay(podcasts) {
    const div = document.getElementById("podcasts")
    div.innerHTML = '';
    div.className = "accordion accordion-flush col"
    for (let podcast of podcasts) {
        // console.log(podcast)
        let newDiv = createPodcastDiv(podcast)
        div.appendChild(newDiv)
        // console.log("appended", newDiv)
    }
}
function createPodcastDiv(podcast) {
    //Header button
    let newDiv = document.createElement('div')
    newDiv.className = "podcast-container accordion-item";
    let header = document.createElement('div');
    header.className = "podcast-header accordion-header";

    let headerButton = document.createElement("button")
    headerButton.className = "podcast-name accordion-button collapsed"
    headerButton.innerHTML = `<div><div class="podcast-date">${podcast.date}</div> <div class="d-flex align-items-end gap-3">` +
        `<div class="episode-number">${podcast.episodeNumber}</div><div class="episode-title">${podcast.title}</div>` +
        "</div> </div>"
    headerButton.setAttribute('data-bs-toggle', "collapse")
    headerButton.setAttribute('data-bs-target', '#podcast-' + podcast.id)

    header.appendChild(headerButton)

    // Body
    let bodyContainer = document.createElement("div");
    bodyContainer.id = 'podcast-' + podcast.id
    bodyContainer.className = "accordion-collapse collapse";


    let body = document.createElement("div")
    body.className = "accordion-body"
    body.innerHTML = `<div>
    <div><a target="blank" href="https://youtube.com/results/?search_query=${podcast.title}">Find it on youtube</a></div>
    <b>Date:</b> ${podcast.date} </div>
    <div><b>Podcasters:</b> <pre class="ps-2">${podcast.hostsString}</pre></div>`

    bodyContainer.appendChild(body)

    newDiv.appendChild(header)
    newDiv.appendChild(bodyContainer)
    return newDiv;
}

function updateHostSelection(id) {
    console.log("udpating host selected")
    console.log("includes", selectedHosts, id)

    document.getElementById(`host-${id}`).classList.toggle("selected-item")

    if (selectedHosts.includes(id)) {
        selectedHosts = selectedHosts.filter(sh => sh != id);
    } else {
        selectedHosts.push(id)
    }


    let podcastsFiltered = podcasts.filter(p => true)
    for (hostId of selectedHosts) {
        console.log(podcastsFiltered.length, hostId)
        console.log(podcastsFiltered)
        podcastsFiltered = podcastsFiltered.filter(p => p.hosts.includes(hostId))
        console.log(podcastsFiltered.length)
    }
    updatePodcastsDisplay(podcastsFiltered)
}

function createChart(){
    const ctx = document.getElementById('chart-canvas');

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: '# of Votes',
          data: [[1,1], [2,3]],
          borderWidth: 1
        },{
            label: '# of Votes',
            data: [[1,3], [2,2]],
            borderWidth: 1
          }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
}