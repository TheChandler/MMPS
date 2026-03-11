interface podcast {
    id: number;
    episodeNumber: string;
    title: string;
    date: Date;
    dateString: string;
    hostStrings: string[];
    hostIds: number[];
    url: string;
}
interface unformattedPodcast {
    number: string,
    title: string,
    date: string,
    hosts: string[],
    url: string
}