import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Profile, PopulatedProfile} from '../profile/model';

// Update this if you add a property to the Profile type!
type ProfileResponse = {
  _id: string;
  userId: string;
  handle: string;
  type: string;
  bio: string;
  dateCreated: string;
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
 * Transform a raw Profile object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Profile>} profile - A profile
 * @returns {ProfileResponse} - The profile object formatted for the frontend
 */
const constructProfileResponse = (profile: HydratedDocument<Profile>): ProfileResponse => {
  const profileCopy: PopulatedProfile = {
    ...profile.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = profileCopy.userId;
  const {handle} = profileCopy;
  const {type} = profileCopy;
  const {bio} = profileCopy;
  delete profileCopy.userId;
  delete profileCopy.handle;
  delete profileCopy.type;
  delete profileCopy.bio;
  return {
    ...profileCopy,
    _id: profileCopy._id.toString(),
    userId: username,
    handle,
    type,
    bio,
    dateCreated: formatDate(profile.dateCreated),
    dateModified: formatDate(profile.dateModified)
  };
};

export {
  constructProfileResponse
};
