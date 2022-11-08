import type {HydratedDocument, Types} from 'mongoose';
import type {Incognito} from './model';
import IncognitoModel from './model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore incognitos
 * stored in MongoDB, including adding, finding, updating, and deleting incognitos.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Incognito> is the output of the IncognitoModel() constructor,
 * and contains all the information in Incognito. https://mongoosejs.com/docs/typescript.html
 */
class IncognitoCollection {
  /**
   * Add a incognito to the collection
   *
   * @param {string} userId - The id of the user of the incognito
   * @return {Promise<HydratedDocument<Incognito>>} - The newly created incognito
   */
  static async addOne(userId: Types.ObjectId | string): Promise<HydratedDocument<Incognito>> {
    const incognito = new IncognitoModel({
      userId
    });
    await incognito.save(); // Saves incognito to MongoDB
    return incognito.populate('userId');
  }

  /**
   * Find a incognito by incognitoId
   *
   * @param {string} incognitoId - The id of the incognito to find
   * @return {Promise<HydratedDocument<Incognito>> | Promise<null> } - The incognito with the given incognitoId, if any
   */
  static async findOne(incognitoId: Types.ObjectId | string): Promise<HydratedDocument<Incognito>> {
    return IncognitoModel.findOne({_id: incognitoId}).populate('userId');
  }

  /**
   * Get all the incognitos in the database
   *
   * @return {Promise<HydratedDocument<Incognito>[]>} - An array of all of the incognito session
   */
  static async findAll(): Promise<Array<HydratedDocument<Incognito>>> {
    // Retrieves incognitos and sorts them from most to least recent
    return IncognitoModel.find({}).populate('userId');
  }

  /**
   * Get all the incognito sessions in by given user
   *
   * @param {string} _userId - The username of user of the incognitos
   * @return {Promise<HydratedDocument<Incognito>[]>} - An array of all of the incognitos
   */
  static async findAllByUserId(_userId: string): Promise<Array<HydratedDocument<Incognito>>> {
    // Const user = await UserCollection.findOneByUserId(userId);
    return IncognitoModel.find({userId: _userId}).populate('userId');
  }

  /**
   * Delete a incognito with given incognitoId.
   *
   * @param {string} incognitoId - The incognitoId of incognito to delete
   * @return {Promise<Boolean>} - true if the incognito has been deleted, false otherwise
   */
  static async deleteOne(incognitoId: Types.ObjectId | string): Promise<boolean> {
    const incognito = await IncognitoModel.deleteOne({_id: incognitoId});
    return incognito !== null;
  }

  /**
   * Delete all the incognitos by the given user
   *
   * @param {string} userId - The id of user of incognitos
   */
  static async deleteMany(userId: Types.ObjectId | string): Promise<void> {
    await IncognitoModel.deleteMany({userId});
  }
}

export default IncognitoCollection;
