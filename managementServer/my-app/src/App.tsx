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
async function saveData(data: episode) {
  return fetch('./save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(res => {
      if (!res.ok) {
        return res.json().then(err => {
          console.log("error response from server", err)
          throw new Error(err.error || 'An error occurred while saving the episode.');
        });
      }
      return res.json()
    })
}
async function publish() {
  return fetch('./publish', {
    method: 'POST'
  })
    .then(res => {
      if (!res.ok) {
        return res.json().then(err => {
          throw new Error(err.error || 'An error occurred while publishing.');
        });
      }
      return res.json()
    })
}
async function deleteData(id: string) {
  return fetch('./delete', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id })
  }).then(res => res.json())
}

function App() {
  const [episdoes, setEpisodes] = useState<episode[]>([])
  const [selectedEpisode, setSelectedEpisode] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    getData().then(data => {
      data = data.map((d: any) => ({
        id: "",
        number: "",
        title: "",
        date: "",
        hosts: [],
        url: "",
        ...d,
      }))

      setEpisodes(data)
    })
  }, [])

  if (selectedEpisode) {
    console.log(episdoes.find(e => e.id == selectedEpisode))
  }

  const onSave = (formData: any) => {
    if (formData.hosts && typeof formData.hosts == 'string') {
      formData.hosts = formData.hosts.split('\n').map((h: string) => h.trim()).filter((h: string) => h.length > 0)
    } else {
      formData.hosts = [];
    }

    if (formData.id == "new") {
      formData.id = null;
    }

    saveData(formData).then(data => {
      setSelectedEpisode(null)
      setEpisodes(prev => prev.map(e => (e.id == data.id || e.id == 'new') ? data : e))
    })
      .catch(err => {
        console.log("ERR", JSON.stringify(err))
        setError(err.message || 'An error occurred reading the error.');
      })
  }
  const [isLoading, setIsLoading] = useState(false);
  const onPublish = () => {
    setIsLoading(true);
    publish()
      .then(() => {
        setIsLoading(false);
      }).catch(err => {
        console.log("ERR", JSON.stringify(err))
        setError(err.message || 'An error occurred reading the error.');
        setIsLoading(false);
      })
  }

  const onCancel = () => {
    console.log('canceling', selectedEpisode)
    setSelectedEpisode(null);
  }
  const onDelete = () => {
    deleteData(selectedEpisode!).then(() => {
      setEpisodes(prev => prev.filter(e => e.id != selectedEpisode))
      setSelectedEpisode(null);
    })
  }

  const addEpisode = () => {
    const newEpisode = {
      id: 'new',
      number: '',
      title: '',
      date: '',
      hosts: [],
      url: ''
    };
    setEpisodes(prev => [newEpisode, ...prev]);
    setSelectedEpisode(newEpisode.id);
  };

  function makeCard(e: episode, isBig = false, isHidden = false) {
    return <Card error={error} episode={e} setSelectedEpisode={setSelectedEpisode} isBig={isBig} isHidden={isHidden} onSave={onSave} onCancel={onCancel} onDelete={onDelete} />
  }

  return <div>
    <div className='header'>
      <div className="button" onClick={() => addEpisode()}>Add Episode</div>
      <div className={"button"+ (isLoading ? ' loading' : '')} onClick={() => onPublish()} >
        {isLoading ? 'Publishing...' : 'Publish'}
      </div>
    </div>

    <div className='cardHolder'>
      {/* {episdoes.map(e => selectedEpisode ? (selectedEpisode == e.id && makeCard(e, true)) : makeCard(e))} */}
      {episdoes.map(e => makeCard(e, selectedEpisode == e.id, !!(selectedEpisode && selectedEpisode != e.id)))}
    </div>
  </div>
}

function Card({ error, episode, setSelectedEpisode, isBig = false, isHidden = false, onSave, onCancel, onDelete }: { error: string | null, episode: episode, setSelectedEpisode: (id: string) => void, isBig?: boolean, isHidden?: boolean, onSave: (formData: any) => void, onCancel: () => void, onDelete: () => void }) {
  isHidden = false;
  return <div className={`card ${isBig ? 'big' : 'small'} ${isHidden ? 'hidden' : ''}`} onClick={() => isBig == false && setSelectedEpisode(episode.id)}>
    <div className="cardInner" >
      {error && <div className="error">{error}</div>}
      {isBig ? <CardInnardsBig episode={episode} onSave={onSave} onCancel={onCancel} onDelete={onDelete} /> : <CardInnardsSmall episode={episode} />}
    </div>
  </div>
}



function CardInnardsBig({ episode, onSave, onCancel, onDelete }: { episode: episode, onSave: (formData: any) => void, onCancel: () => void, onDelete: () => void }) {
  const [formData, setFormData] = useState<any>()
  useEffect(() => {
    let hosts: string[] | string = episode.hosts;
    if (episode.hosts && Array.isArray(episode.hosts)) {
      hosts = episode.hosts.join('\n')
    }

    setFormData({ ...episode, hosts: hosts })
  }, [episode]);

  const onChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
  }

  console.log("formData", formData)
  if (!formData) return null;
  return <>
    <div className="editHeader">
      <div className="button save" onClick={() => onSave(formData)}>save</div>
      <div className="button cancel" onClick={() => onCancel()}>cancel</div>
      <div className="button delete" onClick={() => onDelete()}>delete</div>
    </div>
    <div><input placeholder="Episode Number" value={formData.number} onChange={(e) => onChange('number', e.target.value)}></input></div>
    <div><input className="cardTitle input" placeholder="Title" value={formData.title} onChange={(e) => onChange('title', e.target.value)}></input></div>

    <div><input placeholder="url" value={formData.url} onChange={(e) => onChange('url', e.target.value)}></input></div>
    <div><input placeholder="Date" value={formData.date} onChange={(e) => onChange('date', e.target.value)}></input></div>
    <div><textarea placeholder="Hosts" rows={9} value={formData.hosts} onChange={(e) => onChange('hosts', e.target.value)}></textarea></div>
  </>
}
function CardInnardsSmall({ episode }: { episode: episode }) {
  return <div className="cardDetails">
    <div>
      <div className="cardTitle">{episode.title}</div>
      <div className="flex">
        <div className="cardNumber">{episode.number}</div>
        <div className="cardDate">{episode.date}</div>
      </div>
    </div>
    <div className="cardHosts">{episode.hosts?.join(', ')}</div>
  </div>
}

export default App
