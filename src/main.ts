let json: { values: string[][] } = { values: [] }
function setJson(value) {
    json = value
}

let hosts: host[] = []
let podcasts: podcast[] = []
let selectedHosts = []
let selectedHostsForGraph = [];

let calculatedData = []
let chart: any;

let windowSize: number = parseInt((document.getElementById('week-amount') as HTMLInputElement).value);
let xAxisSize: number = parseInt((document.getElementById('x-axis') as HTMLInputElement).value);
let endEpisode: number = parseInt((document.getElementById('range') as HTMLInputElement).value);;
let sortDescending = true

let colors = [
    '#e67a57',
    '#4697c3',
    '#953d3d',
    '#f187bd',
    '#8896fd',
    '#a0b810',
    '#f9c023',
    '#511d91',
    '#40f717',
    '#a51bad',
    '#ee2f46',
    '#5cf99c'
]

fetch('dataFiles/latest_response.json')
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
    recalculateData()
    updateSlider()
    updateXAxisInputElement()
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
    const defaultHosts = ['ben hanson', 'jacob geller', 'sarah podzorski', 'kyle hilliard', 'jeff marchiafava', 'leo vader', 'janet garcia', 'suriel vazquez', 'kelsey lewin', 'haley maclean']
    selectedHostsForGraph = hosts
        .filter(h => defaultHosts.some(dh => normalizeName(dh) == h.nameSearch))
        .map(h => h.id)
}
function getOrAddHostId(hostName) {
    let index = getHostId(hostName);
    if (index == -1) {
        index = hosts.length;
        hosts.push({
            id: index,
            name: hostName,
            nameSearch: normalizeName(hostName),
            podcasts: [],
            color: colors[index % colors.length]
        })
    }
    return index;
}
function getHostId(hostName) {
    let nameSearch = normalizeName(hostName);
    return hosts.findIndex(h => h.nameSearch == nameSearch);
}
function normalizeName(name) {
    return name.trim().replace(/[\W_]+/g, "").toLowerCase();;
}


function updateHostsDisplay(hosts) {
    const div = document.getElementById("hosts")
    for (let host of hosts) {
        let newDiv = document.createElement('div')
        newDiv.setAttribute("onclick", `updateHostSelection(${host.id})`);
        newDiv.id = `host-${host.id}`;
        newDiv.className = `host-container card fs-3 mb-2 pointer`;



        newDiv.innerHTML = "<div class='row g-0'>" +
            `<div class="host-name col p-2 ms-2">${host.name}</div>` +
            `<div class="host-appearances col-4 bg-secondary text-white rounded-end text-center align-content-center">${host.podcasts.length}</div>` +
            "</div>"
        div.appendChild(newDiv)
        // console.log("appended", newDiv)
    }
}

function updatePodcastsDisplay(podcasts) {
    const div = document.getElementById("podcasts")
    div.innerHTML = '';
    div.className = "accordion accordion-flush col"

    let orderedPodcasts = podcasts.toSorted((a, b) => (a.date < b.date == sortDescending) ? 1 : -1)
    for (let podcast of orderedPodcasts) {
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

function updateHostGraphSelection(id) {
    let icon = document.querySelector(`#host-${id} i`)
    icon.classList.toggle('bi-square')
    icon.classList.toggle('bi-x-square-fill')
}

function getRangeOfDates() {

    return podcasts.length
}


function createLineDatasets(windowTarget: number) {
    let runningCounts: chartData[] = hosts.map(h => ({ id: h.id, label: h.name, data: [], borderWidth: 1, currentScore: [], borderColor: h.color, backgroundColor: h.color }))
    let window = 0;

    for (let [index, podcast] of podcasts.entries()) {
        //grow window until it reaches target size. could alternatively use index?
        window += window < windowTarget ? 1 : 0;
        for (let host of runningCounts) {
            if (podcast.hosts.includes(host.id)) {
                host.currentScore.push(1)
            } else {
                host.currentScore.push(0)
            }
            if (host.currentScore.length > window) {
                host.currentScore.shift()
            }
            host.data.push([index, (sumArray(host.currentScore) / window)])
            if (host.label == 'Sarah Podzorski') {
                console.log(podcast.dateString, host.currentScore, sumArray(host.currentScore) / window, podcast.hosts.includes(host.id))
                if (podcast.hosts.includes(host.id)) {
                    console.log(host.data[host.data.length - 1])
                    console.log(runningCounts[host.id])
                }

            }
            if (podcast.hosts.includes(host.id) && host.currentScore[host.currentScore.length - 1] != 1) {
                console.error("Something is wrong here")
            }
        }
    }
    // console.log(runningCounts)
    calculatedData = runningCounts
    return runningCounts

}
function sumArray(array: number[]) {
    return array.reduce((a, b) => a + b, 0)
}
