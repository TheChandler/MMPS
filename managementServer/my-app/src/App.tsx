import { useEffect, useState } from 'react'
import './App.css'

interface episode {
  id: string,
  number: string,
  title: string,
  date: string,
  hosts: string[],
  url: string
}

async function getData() {
  return fetch('./all').then(res => res.json())
}

function App() {
  const [episdoes, setEpisodes] = useState<episode[]>([])
  const [selectedEpisode, setSelectedEpisode] = useState<string | null>(null)
  useEffect(() => {
    getData().then(data => setEpisodes(data))
  }, [])

  if (selectedEpisode) {
    console.log(episdoes.find(e => e.id == selectedEpisode))
  }

  function makeCard(e: episode, isBig = false, isHidden = false) {
    return <Card episode={e} setSelectedEpisode={setSelectedEpisode} isBig={isBig} isHidden={isHidden} />
  }

  getData();
  return <div className='cardHolder'>
    {/* {episdoes.map(e => selectedEpisode ? (selectedEpisode == e.id && makeCard(e, true)) : makeCard(e))} */}
    {episdoes.map(e => makeCard(e, selectedEpisode == e.id, !!(selectedEpisode && selectedEpisode != e.id)))}
  </div>
}

function Card({ episode, setSelectedEpisode, isBig = false, isHidden = false }: { episode: episode, setSelectedEpisode: (id: string) => void, isBig?: boolean, isHidden?: boolean }) {
  return <div className={`card ${isBig ? 'big' : 'small'} ${isHidden ? 'hidden' : ''}`} onClick={() => setSelectedEpisode(episode.id)}>
    <div className="cardInner">
      <div className="cardNumber">{episode.number}</div>
      <div className="cardTitle">{episode.title}</div>
      <div className="cardDate">{episode.date}</div>
      <div className="cardHosts">{episode.hosts?.join(', ')}</div>
    </div>
  </div>
}

export default App
