import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import DisplayCollection from './collection';
import * as userValidator from '../user/middleware';
import * as displayValidator from '../display/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the displays
 *
 * @name GET /api/displays
 *
 * @return {DisplayResponse[]} - A list of all the displays sorted in descending
 *                      order by date modified
 */
/**
 * Get displays by author.
 *
 * @name GET /api/displays?authorId=id
 *
 * @return {DisplayResponse[]} - An array of displays created by user with id, authorId
 * @throws {400} - If authorId is not given
 * @throws {404} - If no user has given authorId
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if authorId query parameter was supplied
    if (req.query.author !== undefined) {
      console.log('Hi');
      next();
      return;
    }

    const allDisplays = await DisplayCollection.findAll();
    const response = allDisplays.map(util.constructDisplayResponse);
    res.status(200).json(response);
  },
  [
    userValidator.isAuthorExists
  ],
  async (req: Request, res: Response) => {
    const authorDisplays = await DisplayCollection.findAllByUsername(req.query.author as string);
    const response = util.constructDisplayResponse(authorDisplays);
    res.status(200).json(response);
  }
);

/**
 * Modify a display
 *
 * @name PUT /api/displays/:id
 *
 * @param {string} displayType - the new displayType for the display
 * @return {DisplayResponse} - the updated display
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the display
 * @throws {404} - If the displayId is not valid
 * @throws {400} - If the display displayType is empty or a stream of empty spaces
 * @throws {413} - If the display displayType is more than 140 characters long
 */
router.put(
  '/:displayId?',
  [
    userValidator.isUserLoggedIn,
    displayValidator.isDisplayExists,
    displayValidator.isValidDisplayModifier,
    displayValidator.isValidDisplayContent
  ],
  async (req: Request, res: Response) => {
    const display = await DisplayCollection.updateOne(req.params.displayId, req.body.displayType);
    res.status(200).json({
      message: 'Your display was updated successfully.',
      display: util.constructDisplayResponse(display)
    });
  }
);

export {router as displayRouter};
