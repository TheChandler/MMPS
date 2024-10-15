
function createChart() {
    const ctx = document.getElementById('chart-canvas');
    //@ts-ignore
    chart = new Chart(ctx, {
        type: isBar? 'bar': 'line',
        data: {
            labels: [],
            datasets: []
        },
        options: {
            scales: {
                y: {
                    min:0,
                    max: isStacked? null: 1,
                    ticks: {
                        format: {
                            style: 'percent'
                        }
                    },
                    stacked: isBar && isStacked
                },
                x:{
                    stacked: true
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

    
    dataset = dataset.map(ds => {
     let data = ds.data.slice(Math.max(endEpisode-xAxisSize,0), endEpisode)
     if (isBar){
        data = data.map(array=> array[1])
     }
        return {
            ...ds,
            data: data
        }
    })
    console.log(dataset)

    return dataset.filter(d => selectedHosts.some(sh => sh == d.id))

}
function updateChart() {
    console.log("update chart?")
    let labels = podcasts.map(p => p.dateString)
    labels = labels.slice(Math.max(endEpisode-xAxisSize,0), endEpisode)
    chart.data = {
        labels: labels,
        datasets: getDataForDisplay()
    }
    chart.type= isBar ? 'bar': 'line'
    chart.update();

}