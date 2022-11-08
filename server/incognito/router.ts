import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import IncognitoCollection from './collection';
import * as userValidator from '../user/middleware';
import * as incognitoValidator from '../incognito/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the incognitos
 *
 * @name GET /api/incognitos
 * @return {IncognitoResponse[]} - An array of incognitos created by session user
 * @throws {403} - If user not logged in
 *
 */
router.get(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const userIncognitos = await IncognitoCollection.findAllByUserId(req.session.userId as string);
    const response = userIncognitos.map(util.constructIncognitoResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new incognito.
 *
 * @name POST /api/incognitos
 *
 * @return {IncognitoResponse} - The created incognito
 * @throws {403} - If the user is not logged in
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    console.log('TEST');
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const incognito = await IncognitoCollection.addOne(userId);

    res.status(201).json({
      message: 'Your incognito was created successfully.',
      incognito: util.constructIncognitoResponse(incognito)
    });
  }
);

/**
 * Delete all incognito sessions
 *
 * @name DELETE /api/incognitos/
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 */
/**
 * Delete a incognito
 *
 * @name DELETE /api/incognitos/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the user of
 *                 the incognito
 * @throws {404} - If the incognitoId is not valid
 */
router.delete(
  '/',
  [
    userValidator.isUserLoggedIn,
    incognitoValidator.isUserIncognitoExists
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if incognitoId query parameter was supplied
    if (req.query.id !== undefined) {
      next();
      return;
    }

    await IncognitoCollection.deleteMany(req.session.userId);
    res.status(200).json({
      message: 'Your incognito was deleted successfully.'
    });
  },
  [
    userValidator.isUserLoggedIn,
    incognitoValidator.isIncognitoExists,
    incognitoValidator.isValidIncognitoModifier
  ],
  async (req: Request, res: Response) => {
    await IncognitoCollection.deleteOne(req.query.id as string);
    res.status(200).json({
      message: 'Your incognitos were deleted successfully.'
    });
  }
);

export {router as incognitoRouter};
