import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import IncognitoCollection from '../incognito/collection';

/**
 * Checks if a incognito with incognito id is req.params exists
 */
const isIncognitoExists = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.query.id) {
    res.status(400).json({
      error: 'Provided incognito username must be nonempty.'
    });
    return;
  }

  const incognito = await IncognitoCollection.findOne(req.query.id as string);
  if (!incognito) {
    res.status(404).json({
      error: {
        incognitoNotFound: `Incognito with incognito ID ${req.query.id as string} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a incognito with incognitoId is req.params exists
 */
const isUserIncognitoExists = async (req: Request, res: Response, next: NextFunction) => {
  const incognito = await IncognitoCollection.findAllByUserId(req.session.userId);
  if (!incognito) {
    res.status(404).json({
      error: {
        incognitoNotFound: 'You do not have any open incognito sessions.'
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the user of the incognito session whose incognitoId is in req.params
 */
const isValidIncognitoModifier = async (req: Request, res: Response, next: NextFunction) => {
  const incognito = await IncognitoCollection.findOne(req.query.id as string);
  const userId = incognito.userId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' incognito sessions.'
    });
    return;
  }

  next();
};

export {
  isIncognitoExists,
  isValidIncognitoModifier,
  isUserIncognitoExists
};
