const fs = require('node:fs')

const { key } = require('./googleApiKey.json');
const { exec, execSync } = require('node:child_process');
const sheetId = "17mOTV4LuIgdz_ui_pIzGC-vqDtIiFPXfDTh2l-r0EZA"

// https://docs.google.com/spreadsheets/d/17mOTV4LuIgdz_ui_pIzGC-vqDtIiFPXfDTh2l-r0EZA/edit?gid=0#gid=0

const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1?alt=json&key=${key}`


const date = new Date().toISOString().split("T")[0]

async function getData() {

    let response = await fetch(url);

    if (response.status != 200) {
        console.error("Error fetching data", response)
        return
    }

    const body = await response.json();
    

    fs.writeFileSync('./responseFiles/' + date + "_response.json", JSON.stringify(body));
    fs.writeFileSync("./responseFiles/latest_response.json", JSON.stringify(body))


}
execSync('git pull')
getData().then(()=>{
    
    execSync('git add .')
    execSync(`git commit -m "${date} data update"`)
    execSync('git push')
})
