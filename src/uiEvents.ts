
function toggleBigMode() {
    console.log("bm toggle")
    let column = document.getElementById("chart-column")
    column.classList.toggle('col-lg-4')

    let button = document.querySelector('#chart-column .btn')
    button.textContent = button.textContent == 'big mode' ? 'teeny mode' : 'big mode'
}
function updateWindowSize(e) {
    windowSize = parseInt(e.value)
    recalculateData()
}
function sliderChanged(e){
    
    endEpisode = parseInt(e.value)
    updateChart()
}
function changeSortDirection() {
    let icon = document.querySelector('#sort-direction')
    icon.classList.toggle("bi-arrow-down")
    icon.classList.toggle("bi-arrow-up")
    sortDescending = !sortDescending
    updatePodcastsDisplay(podcasts);
}
function updateXAxis(e) {
    xAxisSize = parseInt(e.value)
    console.log(xAxisSize)
    updateChart()
}

function updateSlider() {
    let max = getRangeOfDates()
    let range = document.getElementById('range');
    range.setAttribute('max', max.toString());
    range.setAttribute('value', max.toString())
    endEpisode = max;
}
function updateXAxisInputElement() {
    let max = getRangeOfDates()
    document.getElementById('x-axis').setAttribute('value', max.toString())
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

    updateChart()
}
function toggleIsBar(e){
    isBar = e.checked;
    chart.destroy()
    createChart()
    updateChart()
}
function toggleIsStacked(e){
    isStacked = e.checked;
    chart.destroy()
    createChart()
    updateChart()
}