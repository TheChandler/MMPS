
function createChart() {
    const ctx = document.getElementById('chart-canvas');
    //@ts-ignore
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: []
        },
        options: {
            scales: {
                y: {
                    ticks: {
                        format: {
                            style: 'percent'
                        }
                    }
                }
            }
        }
    });
}

function recalculateData() {
    createLineDatasets(windowSize)
    updateChart()
}
function getDataForDisplay() {
    let dataset = calculatedData;

    dataset = dataset.map(ds => ({
        ...ds,
        data: ds.data.slice(-xAxisSize, endEpisode)
    }))
    console.log(dataset)

    return dataset.filter(d => selectedHosts.some(sh => sh == d.id))

}
function updateChart() {
    console.log("update chart?")
    let labels = podcasts.map(p => p.dateString)
    labels = labels.slice(-xAxisSize, endEpisode)
    chart.data = {
        labels: labels,
        datasets: getDataForDisplay()
    }
    chart.update();

}