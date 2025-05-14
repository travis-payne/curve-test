import mongoose, { Document, Schema, Types } from 'mongoose';
import { IContract } from './contract.model'; 


export interface ITrack extends Document {
  title: string;                           
  version?: string;
  artist?: string;
  isrc: string; // International Standard Recording Code. 12 char alphanumeric code
  pLine?: string;
  aliases: string[];                         
  contractId?: Types.ObjectId | IContract;
}


const trackSchema = new Schema<ITrack>(
  {
    title: {
      type: String,
      required: [true, 'Track title is required.'],
      trim: true
    },
    version: {
        type: String,
        required: false,
    },
    artist: {
        type: String,
        required: false,
    },
    isrc: {
        type: String,
        required: true,
    },
    pLine: {
        type: String,
        required: false,
    },
    aliases: {
      type: [String], 
      default: []     
    },
    contractId: {
      type: Schema.Types.ObjectId, 
      ref: 'Contract',             
      required: false          
    }
  },
);


const Track = mongoose.model<ITrack>('Track', trackSchema);

export default Track;
