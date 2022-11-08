import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import ReactionCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as reactionValidator from './middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the reactions
 *
 * @name GET /api/reactions
 *
 * @return {ReactionResponse[]} - A list of all the reactions sorted in descending
 *                      order by date modified
 */
/**
 * Get reactions by user.
 *
 * @name GET /api/reactions?freetId=freetId
 *
 * @return {ReactionResponse[]} - An array of reactions created by user with id, userId
 * @throws {400} - If userId is not given
 * @throws {404} - If no user has given userId
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if userId query parameter was supplied
    if (req.query.freetId !== undefined) {
      next();
      return;
    }

    const allReactions = await ReactionCollection.findAll();
    const response = allReactions.map(util.constructReactionResponse);
    res.status(200).json(response);
  },
  [
    freetValidator.isFreetQueryExists
  ],
  async (req: Request, res: Response) => {
    const userReactions = await ReactionCollection.findAllByFreet(req.query.freetId as string);
    const response = userReactions.map(util.constructReactionResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new reaction.
 *
 * @name POST /api/reactions
 *
 * @param {string} symbol - The symbol of the reaction
 * @return {ReactionResponse} - The created reaction
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the reaction symbol is empty or a stream of empty spaces
 * @throws {413} - If the reaction symbol is more than 140 characters long
 */
router.post(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    reactionValidator.isValidSymbolType,
    reactionValidator.isSingleReaction
  ],
  async (req: Request, res: Response) => {
    console.log('Hi');
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const reaction = await ReactionCollection.addOne(userId, req.params.freetId, req.body.symbol);

    res.status(201).json({
      message: 'Your reaction was created successfully.',
      reaction: util.constructReactionResponse(reaction)
    });
  }
);

/**
 * Delete a reaction
 *
 * @name DELETE /api/reactions/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the user of
 *                 the reaction
 * @throws {404} - If the reactionId is not valid
 */
router.delete(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    reactionValidator.isUsersReactionExists
  ],
  async (req: Request, res: Response) => {
    await ReactionCollection.deleteOne(req.session.userId._id, req.params.freetId);
    res.status(200).json({
      message: 'Your reaction was deleted successfully.'
    });
  }
);

/**
 * Modify a reaction
 *
 * @name PUT /api/reactions/:id
 *
 * @param {string} symbol - the new symbol for the reaction
 * @return {ReactionResponse} - the updated reaction
 * @throws {403} - if the user is not logged in or not the user of
 *                 of the reaction
 * @throws {404} - If the reactionId is not valid
 * @throws {400} - If the reaction symbol is empty or a stream of empty spaces
 * @throws {413} - If the reaction symbol is more than 140 characters long
 */
router.put(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    reactionValidator.isUsersReactionExists,
    reactionValidator.isValidSymbolType
  ],
  async (req: Request, res: Response) => {
    const reaction = await ReactionCollection.updateOne(req.session.userId._id, req.params.freetId, req.body.symbol);
    res.status(200).json({
      message: 'Your reaction was updated successfully.',
      reaction: util.constructReactionResponse(reaction)
    });
  }
);

export {router as reactionRouter};
