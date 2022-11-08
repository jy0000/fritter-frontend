import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import ProfileCollection from '../profile/collection';

const ProfileType = new Set<string>(['business', 'personal', 'private']);
/**
 * Checks if a profile with profileId is req.params exists
 */
const isProfileExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.profileId);
  const profile = validFormat ? await ProfileCollection.findOne(req.params.profileId) : '';
  if (!profile) {
    res.status(404).json({
      error: {
        profileNotFound: `Profile with profile ID ${req.params.profileId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a profile with old_handle in req.params exists
 */
const isHandleExists = async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.params.old_handle);
  console.log(req.params);
  const profile = await ProfileCollection.findOneByProfileHandle(req.params.old_handle);
  if (!profile) {
    res.status(404).json({
      error: {
        profileNotFound: `Profile with handle ${req.params.old_handle} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the handle of the profile in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
const isValidProfileHandle = (req: Request, res: Response, next: NextFunction) => {
  const {handle} = req.body as {handle: string};
  if (!handle.trim()) {
    res.status(400).json({
      error: 'Profile handle must be at least one character long.'
    });
    return;
  }

  if (handle.length > 140) {
    res.status(413).json({
      error: 'Profile handle must be no more than 140 characters.'
    });
    return;
  }

  next();
};

/**
 * Checks if the type of the profile in req.body is valid option
 */
const isValidProfileType = (req: Request, res: Response, next: NextFunction) => {
  const {type} = req.body as {type: string};
  if (!ProfileType.has(type.toLowerCase())) {
    res.status(406).json({
      error: 'Profile type must be either `business`, `personal`, `private`.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the user of the profile whose profileId is in req.params
 */
const isValidProfileModifier = async (req: Request, res: Response, next: NextFunction) => {
  console.log('VALID PROFILE MODIFIER');
  const profile = await ProfileCollection.findOneByProfileHandle(req.params.old_handle);
  console.log(profile);
  console.log(profile.userId._id);
  const userId = profile.userId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' profiles.'
    });
    return;
  }

  next();
};

export {
  isValidProfileHandle,
  isProfileExists,
  isValidProfileModifier,
  isValidProfileType,
  isHandleExists
};
