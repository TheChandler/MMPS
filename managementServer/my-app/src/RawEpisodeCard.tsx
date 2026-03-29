export const RawEpisodes = function ({ rawEpisodes, addEpisode, selectedRaw }: { rawEpisodes: any[], addEpisode: (rawEpisode?: any) => void, selectedRaw: string | null }) {
    return <div className="rawEpisodes">
        {rawEpisodes.map(e => <RawEpisodeCard key={e.id} rawEpisode={e} addEpisode={addEpisode} selected={selectedRaw == e.id} />)}
    </div>
}


export const RawEpisodeCard = function ({ rawEpisode, addEpisode, selected }: { rawEpisode: any, addEpisode: (rawEpisode?: any) => void, selected: boolean }) {
    return <div className={`card small raw ${selected ? 'selected' : ''}`} onClick={() => addEpisode(rawEpisode)}>
        {/* <div className="button addRaw" >Add Episode</div> */}
        <div className="" >
            <RawEpisodeInnardsSmall episode={rawEpisode} selected={selected} />
        </div>
    </div>
}

const RawEpisodeInnardsSmall = function ({ episode, selected }: { episode: any, selected: boolean }) {
    return <div className="cardDetails">
        <div>{episode.title}</div>
        <div>{episode.number}</div>
        {selected && <div className="rawDescription">{episode.description}</div>}
        <div>{episode.publishedAt}</div>
    </div>
}
