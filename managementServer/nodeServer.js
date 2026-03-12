const express = require('express')
const app = express()
const port = 3000

const fs = require('fs')
const { exec, execSync } = require('node:child_process');
const path = require('node:path');


app.use(express.json());

app.get('/all', (req, res) => {
  let json = fs.readFileSync('dataFiles\\episode_list.json');
  res.json(JSON.parse(json))
})

app.post('/', (req, res) => {
  let body = req.body
  let json = JSON.parse(fs.readFileSync('dataFiles\\episode_list.json'));

  const updated = json.map(episode => {
    if (episode.id === body.id) {
      return body;
    }
    return episode;
  });
  fs.writeFileSync('dataFiles\\episode_list.json', JSON.stringify(updated));
  res.json(updated);
})

app.post('/gitCommit', (req, res) => {
  execSync('node ../updateData.js')
})

// app.get('/', (req, res) => {
//   const options = {
//     root: path.join(__dirname, './')
//   };
//   res.sendFile('./my-app/dist/index.html', options)
//})

app.use(express.static(path.join(__dirname, './my-app/dist')));


// For any other route, serve the React app's index.html
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, './my-app/dist', 'index.html'));
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
