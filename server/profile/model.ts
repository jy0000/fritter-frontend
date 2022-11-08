import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Profile
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Profile on the backend
export type Profile = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  userId: Types.ObjectId;
  handle: string;
  type: string;
  bio: string;
  dateCreated: Date;
  dateModified: Date;
};

export type PopulatedProfile = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  userId: User;
  handle: string;
  type: string;
  bio: string;
  dateCreated: Date;
  dateModified: Date;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Profiles stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const ProfileSchema = new Schema<Profile>({
  // The user userId
  userId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // Username handle
  handle: {
    type: String,
    required: true
  },
  // The type of the profile
  type: {
    type: String,
    required: true
  },
  // The bio of the profile
  bio: {
    type: String,
    required: false
  },
  // The date the profile was created
  dateCreated: {
    type: Date,
    required: true
  },
  // The date the profile was modified
  dateModified: {
    type: Date,
    required: true
  }
});

const ProfileModel = model<Profile>('Profile', ProfileSchema);
export default ProfileModel;
