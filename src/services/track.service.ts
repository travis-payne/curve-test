import { ITrack } from "../models/track.model";
import Track from "../models/track.model";

export const saveOrUpdateTrack = async (trackData: ITrack) => {
    await Track.findOneAndUpdate(
        { _id: trackData._id },
        trackData,
        {
            upsert: true,
        }
    );
}

export const extractTrackData = (row: { [key: string]: string; }) => {
    return {
        id: row['ID'],
        title: row['Title'],
        isrc: row['ISRC'].replace(/[^a-zA-Z0-9]/g, ''),
        contractId: row['Contract'],
        aliases: (row['Aliases']) ? (row['Aliases'])
            .split(';')
            .map((alias: string) => alias.trim()) : [],
        artist: row['Artist'],
        version: row['Version'],
        pLine: row['P Line'],
    }
}
