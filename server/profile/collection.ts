import type {HydratedDocument, Types} from 'mongoose';
import type {Profile} from './model';
import ProfileModel from './model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore profiles
 * stored in MongoDB, including adding, finding, updating, and deleting profiles.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Profile> is the output of the ProfileModel() constructor,
 * and contains all the information in Profile. https://mongoosejs.com/docs/typescript.html
 */
class ProfileCollection {
  /**
   * Add a profile to the collection
   *
   * @param {string} userId - The id of the user of the profile
   * @param {string} content - The id of the content of the profile
   * @return {Promise<HydratedDocument<Profile>>} - The newly created profile
   */
  static async addOne(userId: Types.ObjectId | string, handle: string, type: string, bio: string): Promise<HydratedDocument<Profile>> {
    const date = new Date();
    const profile = new ProfileModel({
      userId,
      handle,
      type,
      bio,
      dateCreated: date,
      dateModified: date
    });
    await profile.save(); // Saves profile to MongoDB
    return profile.populate('userId');
  }

  /**
   * Find a profile by profileId
   *
   * @param {string} profileId - The id of the profile to find
   * @return {Promise<HydratedDocument<Profile>> | Promise<null> } - The profile with the given profileId, if any
   */
  static async findOne(profileId: Types.ObjectId | string): Promise<HydratedDocument<Profile>> {
    return ProfileModel.findOne({_id: profileId}).populate('userId');
  }

  /**
   * Find a user by handle (case insensitive).
   *
   * @param {string} handle - The handle of the user to find
   * @return {Promise<HydratedDocument<Profile>> | Promise<null>} - The profile with the given handle, if any
   */
  static async findOneByProfileHandle(handle: string): Promise<HydratedDocument<Profile>> {
    return ProfileModel.findOne({handle: new RegExp(`^${handle.trim()}$`, 'i')});
  }

  /**
   * Get all the profiles in the database
   *
   * @return {Promise<HydratedDocument<Profile>[]>} - An array of all of the profiles
   */
  static async findAll(): Promise<Array<HydratedDocument<Profile>>> {
    // Retrieves profiles and sorts them from most to least recent
    return ProfileModel.find({}).sort({dateModified: -1}).populate('userId');
  }

  /**
   * Get all the profiles in by given user
   *
   * @param {string} username - The username of user of the profiles
   * @return {Promise<HydratedDocument<Profile>[]>} - An array of all of the profiles
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Profile>>> {
    const user = await UserCollection.findOneByUsername(username);
    return ProfileModel.find({userId: user._id}).populate('userId');
  }

  /**
   * Update a profile with the new content
   *
   * @param {string} profileId - The id of the profile to be updated
   * @param {string} content - The new content of the profile
   * @return {Promise<HydratedDocument<Profile>>} - The newly updated profile
   */
  static async updateOne(profileId: Types.ObjectId | string, handle: string, bio: string): Promise<HydratedDocument<Profile>> {
    const profile = await ProfileModel.findOne({_id: profileId});
    profile.bio = bio;
    profile.handle = handle;
    profile.dateModified = new Date();
    await profile.save();
    return profile.populate('userId');
  }

  /**
   * Delete a profile with given profileId.
   *
   * @param {string} profileId - The profileId of profile to delete
   * @return {Promise<Boolean>} - true if the profile has been deleted, false otherwise
   */
  static async deleteOne(profileId: Types.ObjectId | string): Promise<boolean> {
    const profile = await ProfileModel.deleteOne({_id: profileId});
    return profile !== null;
  }

  /**
   * Delete all the profiles by the given user
   *
   * @param {string} userId - The id of user of profiles
   */
  static async deleteMany(userId: Types.ObjectId | string): Promise<void> {
    await ProfileModel.deleteMany({userId});
  }
}

export default ProfileCollection;
