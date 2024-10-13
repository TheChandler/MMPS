console.log('test')

let json: { values: string[][] } = { values: [] }
function setJson(value) {
    json = value
}

interface host {
    id: number;
    name: string;
    nameSearch: string;
    podcasts: number[];
}
interface podcast {
    id: number;
    episodeNumber: string;
    title: string;
    date: Date;
    dateString: string;
    hostsString: string;
    hosts: number[];
}

let hosts: host[] = []
let podcasts: podcast[] = []
let selectedHosts = []
fetch('responseFiles/latest_response.json')
    .then((response) => {
        response.json()
            .then(j => {
                setJson(j)
                run()
            })

    })

function run() {
    let data = json.values
    populateData(data.slice(1))
    hosts = hosts.sort((a, b) => a.podcasts.length < b.podcasts.length ? 1 : -1)
    updateHostsDisplay(hosts)
    updatePodcastsDisplay(podcasts)
    createChart()
    updateSlider()
}
function populateData(rows) {
    for (const [index, rowData] of rows.entries()) {
        if (!rowData || rowData[3] == undefined || rowData[3] == '') {
            continue
        }
        let podcast = {
            id: index,
            episodeNumber: rowData[0],
            title: rowData[1],
            date: new Date(rowData[2]),
            dateString: rowData[2],
            hostsString: rowData[3],
            hosts: []
        }
        console.log(podcast)
        for (let host of podcast.hostsString.split('\n')) {
            let hostName = host.trim()
            let hostIndex = getOrAddHostId(hostName)
            hosts[hostIndex].podcasts.push(index)
            podcast.hosts.push(hostIndex)
        }
        if (podcast.hosts.length > 0) {
            podcasts.push(podcast)
        }
        podcasts = podcasts.sort((a, b) => a.date > b.date ? 1 : -1)

    }
}
function getOrAddHostId(hostName) {
    let nameSearch = hostName.trim().replace(/[\W_]+/g, "").toLowerCase();
    let index = hosts.findIndex(h => h.nameSearch == nameSearch);
    if (index == -1) {
        index = hosts.length;
        hosts.push({
            id: index,
            name: hostName,
            nameSearch: nameSearch,
            podcasts: []
        })
    }
    return index;
}


function updateSlider() {
    let max = getRangeOfDates()
    let range = document.getElementById('range');
    range.setAttribute('max', max.toString());
    range.setAttribute('value', max.toString())
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
    const count = document.getElementById('podcast-count')
    count.innerText = podcasts.length
}
function createPodcastDiv(podcast) {
    //Header button
    let newDiv = document.createElement('div')
    newDiv.className = "podcast-container accordion-item";
    let header = document.createElement('div');
    header.className = "podcast-header accordion-header";

    let headerButton = document.createElement("button")
    headerButton.className = "podcast-name accordion-button collapsed pe-0"
    headerButton.innerHTML = `<div><div class="podcast-date">${podcast.dateString}</div> <div class="d-flex align-items-end gap-3">` +
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
    <!-- <b>Date:</b> ${podcast.dateString} </div> -->
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
    for (const hostId of selectedHosts) {
        console.log(podcastsFiltered.length, hostId)
        console.log(podcastsFiltered)
        podcastsFiltered = podcastsFiltered.filter(p => p.hosts.includes(hostId))
        console.log(podcastsFiltered, podcastsFiltered.length)
    }
    let podcastsSorted = podcastsFiltered.sort((a, b) => { return b.date > a.date ? 1 : -1 })
    updatePodcastsDisplay(podcastsSorted)
}

function createChart() {
    const ctx = document.getElementById('chart-canvas');
    let labels = podcasts.map(p => p.dateString)

    //@ts-ignore
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: getDataForDisplay()
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

function getRangeOfDates() {

    return podcasts.length
}

interface chartData {
    label: string;
    data: number[][];
    borderWidth: number;
    id: number;
    currentScore: number[];
}
function getDataForDisplay() {
    let dataset = createLineDatasets(8)
    let selectedHosts = [
        'Ben Hanson',
        "Sarah Podzorski",
        "Jeff Marchiafava",
        "Jacob Geller"
    ]
    return dataset.filter(d => selectedHosts.some(sh => sh == d.label))

}
function createLineDatasets(windowTarget: number) {

    let runningCounts: chartData[] = hosts.map(h => ({ id: h.id, label: h.name, data: [], borderWidth: 1, currentScore: [] }))
    let window = 0;

    for (let [index, podcast] of podcasts.entries()) {
        //grow window until it reaches target size. could alternatively use index?
        window += window < windowTarget ? 1 : 0;
        for (let host of runningCounts) {
            if (podcast.hosts.includes(host.id)) {
                host.currentScore.push(1)
            }else{
                host.currentScore.push(0)
            }
            if (host.currentScore.length > window){
                host.currentScore.shift()
            }
            runningCounts[host.id].data.push([index, sumArray(host.currentScore) / window])
            if (host.label == 'Sarah Podzorski') {
                console.log(host.currentScore, podcast.hosts.includes(host.id), )
            }
        }
    }

    return runningCounts

}
function sumArray(array: number[]){
    return array.reduce((a, b)=> a+b, 0)
}

function toggleBigMode() {
    console.log("bm toggle")
    let column = document.getElementById("chart-column")
    column.classList.toggle('col-lg-4')

    let button = document.querySelector('#chart-column .btn')
    button.textContent = button.textContent == 'big mode' ? 'teeny mode' : 'big mode'
}