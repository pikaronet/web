export interface SocialLink {
    name: string;
    url: string;
}

export interface SocialsCategories {
    music: SocialLink[];
    other: SocialLink[];
}

export interface ReleaseLinks {
    spotify?: string;
    bandcamp?: string;
    youtube?: string;
    appleMusic?: string;
    soundcloud?: string;
}

export interface ReleaseTrack {
    trackNumber: number;
    title: string;
    file: string;
}

export interface Release {
    title: string;
    slug: string;
    releaseDate: string;
    image: string;
    tracks: ReleaseTrack[];
    links?: ReleaseLinks;
}

export interface SiteData {
    socials: SocialsCategories;
    releases: Release[];
}