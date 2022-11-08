import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Incognito, PopulatedIncognito} from '../incognito/model';

// Update this if you add a property to the Incognito type!
type IncognitoResponse = {
  _id: string;
  userId: string;
};

/**
 * Transform a raw Incognito object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Incognito>} incognito - A incognito
 * @returns {IncognitoResponse} - The incognito object formatted for the frontend
 */
const constructIncognitoResponse = (incognito: HydratedDocument<Incognito>): IncognitoResponse => {
  const incognitoCopy: PopulatedIncognito = {
    ...incognito.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {_id} = incognitoCopy.userId;
  delete incognitoCopy.userId;
  return {
    ...incognitoCopy,
    _id: incognitoCopy._id.toString(),
    userId: _id.toString()
  };
};

export {
  constructIncognitoResponse
};
