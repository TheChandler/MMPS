import { useEffect, useState } from "react";
import type { episode } from "./models.ts";

export function Card({ error, episode, setSelectedEpisode, isBig = false, isHidden = false, onSave, onCancel, onDelete }: { error: string | null, episode: episode, setSelectedEpisode: (id: string) => void, isBig?: boolean, isHidden?: boolean, onSave: (formData: any) => void, onCancel: () => void, onDelete: () => void }) {
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
