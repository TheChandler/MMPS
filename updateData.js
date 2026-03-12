const fs = require('node:fs')
const { exec, execSync } = require('node:child_process');


const date = new Date().toISOString().split("T")[0]

try {
    execSync('git pull')
    execSync('git add .')
    execSync(`git commit -m "${date} data update"`)
    execSync('git push');
} catch (e) {
    console.log("Nothing to commit");
}