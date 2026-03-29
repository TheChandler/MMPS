// import {google} from 'googleapis';
const { google } = require('googleapis');

const youtube = google.youtube('v3');

process.loadEnvFile()

const KEY = process.env.google_key

async function getPlayListItems () {
    return youtube.playlistItems.list({
        key: KEY,
        part: 'contentDetails, id, snippet',
        maxResults: 52,
        playlistId: 'PL6FR1Lkt9IiPuk2Xvs6Z2psbgAHnLM4Ux'
    })
}


module.exports = {
    getPlayListItems
}