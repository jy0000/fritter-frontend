import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Display
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Display on the backend
export type Display = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: Types.ObjectId;
  displayType: string;
  dateModified: Date;
};

export type PopulatedDisplay = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: User;
  displayType: string;
  dateModified: Date;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Displays stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const DisplaySchema = new Schema<Display>({
  // The author userId
  authorId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The content of the Display
  displayType: {
    type: String,
    required: true
  },
  // The date the Display was modified
  dateModified: {
    type: Date,
    required: true
  }
});

const DisplayModel = model<Display>('Display', DisplaySchema);
export default DisplayModel;
