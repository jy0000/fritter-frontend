import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Reaction, PopulatedReaction} from './model';

// Update this if you add a property to the Reaction type!
type ReactionResponse = {
  _id: string;
  user: string;
  dateCreated: string;
  symbol: string;
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
 * Transform a raw Reaction object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Reaction>} reaction - A reaction
 * @returns {ReactionResponse} - The reaction object formatted for the frontend
 */
const constructReactionResponse = (reaction: HydratedDocument<Reaction>): ReactionResponse => {
  const reactionCopy: PopulatedReaction = {
    ...reaction.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = reactionCopy.userId;
  delete reactionCopy.userId;
  return {
    ...reactionCopy,
    _id: reactionCopy._id.toString(),
    user: username,
    dateCreated: formatDate(reaction.dateCreated),
    dateModified: formatDate(reaction.dateModified)
  };
};

export {
  constructReactionResponse
};
