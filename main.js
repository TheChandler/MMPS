console.log('test')

let json = {}
function setJson(value){
    json = value
}
fetch('responseFiles/latest_response.json')
    .then((response) => {
        response.json()
            .then(j => {
                setJson(j)
                runBuilder(j)
            })

    })

function runBuilder(){

    let data = json.values
    let indexes = {}

    let startAdding = false;
    for (const [index, value] of data[0].entries()){
        console.log(index,value)
        
        if (value == "Rolling>>>>"){
            break;
        }
        if (startAdding){
            indexes[index] = {name: value}
        }
        if (value == "Year"){
            startAdding = true;
        }
    }
    let rows = data.slice(1)
    for (const row of rows.entries()){
        const rowData = row[1]
        for (const [index,value] of Object.entries(indexes)){
            if (rowData[index] == "1"){
                
                value.count = value.count ? value.count+1 : 1;
                console.log(value)
            }
        }
    }
    console.log(indexes)

}
