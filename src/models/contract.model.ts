import mongoose, { Document, Schema } from 'mongoose';


export interface IContract extends Document {
  name: string;         
}

const contractSchema = new Schema<IContract>(
  {
    name: {
      type: String,
      required: [true, 'Contract name is required.'],
      unique: true,
      trim: true       
    }
  },
);


const Contract = mongoose.model<IContract>('Contract', contractSchema);

export default Contract;
