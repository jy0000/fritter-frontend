import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Display, PopulatedDisplay} from '../display/model';

// Update this if you add a property to the Display type!
type DisplayResponse = {
  _id: string;
  author: string;
  displayType: string;
  dateModified: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Display object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Display>} display - A display
 * @returns {DisplayResponse} - The display object formatted for the frontend
 */
const constructDisplayResponse = (display: HydratedDocument<Display>): DisplayResponse => {
  const displayCopy: PopulatedDisplay = {
    ...display.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  console.log(displayCopy);
  const {username} = displayCopy.authorId;
  delete displayCopy.authorId;
  return {
    ...displayCopy,
    _id: displayCopy._id.toString(),
    author: username,
    dateModified: formatDate(display.dateModified)
  };
};

export {
  constructDisplayResponse
};
