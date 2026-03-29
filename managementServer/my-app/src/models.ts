export interface episode {
  id: string,
  number: string,
  title: string,
  date: string,
  hosts: string[],
  url: string
}

export interface youtubePlaylistItem {
  id: string,
  description: string,
  publishedAt: string,
  title: string,
  url: string, 
}