import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Incognito
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Incognito on the backend
export type Incognito = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  userId: Types.ObjectId;
};

export type PopulatedIncognito = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  userId: User;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Incognitos stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const IncognitoSchema = new Schema<Incognito>({
  // The user userId
  userId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
});

const IncognitoModel = model<Incognito>('Incognito', IncognitoSchema);
export default IncognitoModel;
