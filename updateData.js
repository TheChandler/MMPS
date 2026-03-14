const { execSync } = require('node:child_process');


const date = new Date().toISOString().split("T")[0]

try {
    console.log(execSync('git add .'));
    console.log(execSync('git stash'));
    console.log(execSync('git pull'));
    console.log(execSync('git stash pop'));
    console.log(execSync('git add .'));
    console.log(execSync(`git commit -m "${date} data update"`));
    console.log(execSync('git push'));
} catch (e) {
    console.log("Nothing to commit");
}