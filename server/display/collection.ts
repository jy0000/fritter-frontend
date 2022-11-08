import type {HydratedDocument, Types} from 'mongoose';
import type {Display} from './model';
import DisplayModel from './model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore Displays
 * stored in MongoDB, including adding, finding, updating, and deleting Displays.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Display> is the output of the DisplayModel() constructor,
 * and contains all the information in Display. https://mongoosejs.com/docs/typescript.html
 */
class DisplayCollection {
  /**
   * Add a Display to the collection
   *
   * @param {string} authorId - The id of the author of the Display
   * @param {string} displayType - The id of the displayType of the Display
   * @return {Promise<HydratedDocument<Display>>} - The newly created Display
   */
  static async addOne(authorId: Types.ObjectId | string): Promise<HydratedDocument<Display>> {
    const date = new Date();
    const display = new DisplayModel({
      authorId,
      displayType: 'default',
      dateModified: date
    });
    await display.save(); // Saves display to MongoDB
    console.log('Display successfully created');
    return display.populate('authorId');
  }

  /**
   * Find a display by displayId
   *
   * @param {string} displayId - The id of the display to find
   * @return {Promise<HydratedDocument<Display>> | Promise<null> } - The display with the given displayId, if any
   */
  static async findOne(displayId: Types.ObjectId | string): Promise<HydratedDocument<Display>> {
    return DisplayModel.findOne({_id: displayId}).populate('authorId');
  }

  /**
   * Get all the displays in the database
   *
   * @return {Promise<HydratedDocument<Display>[]>} - An array of all of the displays
   */
  static async findAll(): Promise<Array<HydratedDocument<Display>>> {
    // Retrieves displays and sorts them from most to least recent
    return DisplayModel.find({}).sort({dateModified: -1}).populate('authorId');
  }

  /**
   * Get all the displays in by given author
   *
   * @param {string} username - The username of author of the displays
   * @return {Promise<HydratedDocument<Display>>} - An array of all of the displays
   */
  static async findAllByUsername(username: string): Promise<HydratedDocument<Display>> {
    const author = await UserCollection.findOneByUsername(username);
    return DisplayModel.findOne({authorId: author._id}).populate('authorId');
  }

  /**
   * Update a display with the new displayType
   *
   * @param {string} displayId - The id of the display to be updated
   * @param {string} displayType - The new displayType of the display
   * @return {Promise<HydratedDocument<Display>>} - The newly updated display
   */
  static async updateOne(displayId: Types.ObjectId | string, displayType: string): Promise<HydratedDocument<Display>> {
    const display = await DisplayModel.findOne({_id: displayId});
    display.displayType = displayType.toLowerCase();
    display.dateModified = new Date();
    await display.save();
    return display.populate('authorId');
  }

  /**
   * Delete a display from the collection.
   *
   * @param {string} userId - The userId of user to delete
   * @return {Promise<Boolean>} - true if the user has been deleted, false otherwise
   */
  static async deleteOne(userId: Types.ObjectId | string): Promise<boolean> {
    const user = await DisplayModel.deleteOne({_id: userId});
    return user !== null;
  }
}

export default DisplayCollection;
