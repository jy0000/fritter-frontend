import type {HydratedDocument, Types} from 'mongoose';
import type {Reaction} from './model';
import ReactionModel from './model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore reactions
 * stored in MongoDB, including adding, finding, updating, and deleting reactions.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Reaction> is the output of the ReactionModel() constructor,
 * and contains all the information in Reaction. https://mongoosejs.com/docs/typescript.html
 */
class ReactionCollection {
  /**
   * Add a reaction to the collection
   *
   * @param {string} userId - The id of the user of the reaction
   * @param {string} symbol - The id of the symbol of the reaction
   * @return {Promise<HydratedDocument<Reaction>>} - The newly created reaction
   */
  static async addOne(userId: Types.ObjectId | string, freetId: Types.ObjectId | string, symbol: string): Promise<HydratedDocument<Reaction>> {
    const date = new Date();
    const reaction = new ReactionModel({
      userId,
      freetId,
      symbol,
      dateCreated: date,
      dateModified: date
    });
    await reaction.save(); // Saves reaction to MongoDB
    return reaction.populate('userId');
  }

  /**
   * Find a reaction by reactionId
   *
   * @param {string} reactionId - The id of the reaction to find
   * @return {Promise<HydratedDocument<Reaction>> | Promise<null> } - The reaction with the given reactionId, if any
   */
  static async findOne(reactionId: Types.ObjectId | string): Promise<HydratedDocument<Reaction>> {
    return ReactionModel.findOne({_id: reactionId}).populate('userId');
  }

  /**
   * Find reaction by freet (case insensitive).
   *
   * @param {string} freet - The freet of the user to find
   * @return {Promise<HydratedDocument<User>> | Promise<null>} - The reaction by username on freet, if any
   */
  static async findOneByFreet(freet: string): Promise<HydratedDocument<Reaction>> {
    return ReactionModel.findOne({freet: new RegExp(`^${freet.trim()}$`, 'i')});
  }

  /**
   * Find reaction by freet (case insensitive).
   *
   * @param {string} freet - The freet of the user to find
   * @return {Promise<HydratedDocument<User>> | Promise<null>} - The reaction by username on freet, if any
   */
  static async findAllByFreet(freet: Types.ObjectId | string): Promise<Array<HydratedDocument<Reaction>>> {
    return ReactionModel.find({freetId: freet}).populate('userId');
  }

  // /**
  //  * Find a user by username (case insensitive).
  //  *
  //  * @param {string} username - The user of the reaction to find
  //  * @param {string} freet - The freet of the reaction to find
  //  * @return {Promise<HydratedDocument<User>> | Promise<null>} - The reaction by username on freet, if any
  //  */
  // static async findOneByUsernameAndFreet(username: string, freet: string): Promise<HydratedDocument<Reaction>> {
  //   return ReactionModel.findOne({
  //     username: new RegExp(`^${username.trim()}$`, 'i'),
  //     freetId: freet
  //   });
  // }

  /**
   * Find a reaction by user and freet(case insensitive).
   *
   * @param {string} user - The user of the reaction to find
   * @param {string} freet - The freet of the reaction to find
   * @return {Promise<HydratedDocument<User>> | Promise<null>} - The reaction by username on freet, if any
   */
  static async findOneByUserAndFreet(user: Types.ObjectId | string, freet: Types.ObjectId | string): Promise<HydratedDocument<Reaction>> {
    return ReactionModel.findOne({
      userId: user,
      freetId: freet
    });
  }

  /**
   * Get all the reactions in the database
   *
   * @return {Promise<HydratedDocument<Reaction>[]>} - An array of all of the reactions
   */
  static async findAll(): Promise<Array<HydratedDocument<Reaction>>> {
    // Retrieves reactions and sorts them from most to least recent
    return ReactionModel.find({}).sort({dateModified: -1}).populate('userId');
  }

  /**
   * Get all the reactions in by given user
   *
   * @param {string} username - The username of user of the reactions
   * @return {Promise<HydratedDocument<Reaction>[]>} - An array of all of the reactions
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Reaction>>> {
    const user = await UserCollection.findOneByUsername(username);
    return ReactionModel.find({userId: user._id}).populate('userId');
  }

  /**
   * Update a reaction with the new symbol
   *
   * @param {string} userId - the id of the user
   * @param {string} freetId - The id of the freet of reaction to be updated
   * @param {string} symbol - The new symbol of the reaction
   * @return {Promise<HydratedDocument<Reaction>>} - The newly updated reaction
   */
  static async updateOne(userId: Types.ObjectId | string, freetId: Types.ObjectId | string, symbol: string): Promise<HydratedDocument<Reaction>> {
    const reaction = await ReactionModel.findOne({userId, freetId});
    reaction.symbol = symbol;
    reaction.dateModified = new Date();
    await reaction.save();
    return reaction.populate('userId');
  }

  /**
   * Delete a reaction with given reactionId.
   *
   * @param {string} userId - The user id of reaction's user to delete
   * @param {string} freetId - The freet id of reaction to delete
   * @return {Promise<Boolean>} - true if the reaction has been deleted, false otherwise
   */
  static async deleteOne(userId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<boolean> {
    const reaction = await ReactionModel.deleteOne({userId, freetId});
    return reaction !== null;
  }

  /**
   * Delete all the reactions by the given user
   *
   * @param {string} userId - The id of user of reactions
   */
  static async deleteMany(userId: Types.ObjectId | string): Promise<void> {
    await ReactionModel.deleteMany({userId});
  }
}

export default ReactionCollection;
