import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import ProfileCollection from './collection';
import * as userValidator from '../user/middleware';
import * as profileValidator from '../profile/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the profiles
 *
 * @name GET /api/profiles
 *
 * @return {ProfileResponse[]} - A list of all the profiles sorted in descending
 *                      order by date modified
 */
/**
 * Get profiles by user.
 *
 * @name GET /api/profiles?userId=id
 *
 * @return {ProfileResponse[]} - An array of profiles created by user with id, userId
 * @throws {400} - If userId is not given
 * @throws {404} - If no user has given userId
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if userId query parameter was supplied
    if (req.query.user !== undefined) {
      next();
      return;
    }

    const allProfiles = await ProfileCollection.findAll();
    const response = allProfiles.map(util.constructProfileResponse);
    res.status(200).json(response);
  },
  [
    userValidator.isUserExists
  ],
  async (req: Request, res: Response) => {
    const userProfiles = await ProfileCollection.findAllByUsername(req.query.user as string);
    const response = userProfiles.map(util.constructProfileResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new profile.
 *
 * @name POST /api/profiles
 *
 * @param {string} content - The content of the profile
 * @return {ProfileResponse} - The created profile
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the profile content is empty or a stream of empty spaces
 * @throws {413} - If the profile content is more than 140 characters long
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    profileValidator.isValidProfileHandle,
    profileValidator.isValidProfileType
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const profile = await ProfileCollection.addOne(userId, req.body.handle, req.body.type, req.body.bio);

    res.status(201).json({
      message: 'Your profile was created successfully.',
      profile: util.constructProfileResponse(profile)
    });
  }
);

/**
 * Delete a profile
 *
 * @name DELETE /api/profiles/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the user of
 *                 the profile
 * @throws {404} - If the profileId is not valid
 */
router.delete(
  '/:profileId?',
  [
    userValidator.isUserLoggedIn,
    profileValidator.isProfileExists,
    profileValidator.isValidProfileModifier
  ],
  async (req: Request, res: Response) => {
    await ProfileCollection.deleteOne(req.params.profileId);
    res.status(200).json({
      message: 'Your profile was deleted successfully.'
    });
  }
);

/**
 * Modify a profile
 *
 * @name PUT /api/profiles/:old_handle
 *
 * @param {string} content - the new content for the profile
 * @return {ProfileResponse} - the updated profile
 * @throws {403} - if the user is not logged in or not the user of
 *                 of the profile
 * @throws {404} - If the profileId is not valid
 * @throws {400} - If the profile content is empty or a stream of empty spaces
 * @throws {413} - If the profile content is more than 140 characters long
 */
router.put(
  '/:old_handle?',
  [
    userValidator.isUserLoggedIn,
    profileValidator.isHandleExists,
    profileValidator.isValidProfileModifier,
    profileValidator.isValidProfileHandle // ,
    // profileValidator.isValidProfileBio
  ],
  async (req: Request, res: Response) => {
    const old_profile = await ProfileCollection.findOneByProfileHandle(req.params.old_handle);
    const profile = await ProfileCollection.updateOne(old_profile._id, req.body.handle, req.body.bio);
    res.status(200).json({
      message: 'Your profile was updated successfully.',
      profile: util.constructProfileResponse(profile)
    });
  }
);

export {router as profileRouter};
