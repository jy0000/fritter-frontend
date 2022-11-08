import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import DisplayCollection from '../display/collection';

const DisplayType = new Set<string>(['default', 'dark', 'accessible']);
/**
 * Checks if a display with displayId is req.params exists
 */
const isDisplayExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.displayId);
  const display = validFormat ? await DisplayCollection.findOne(req.params.displayId) : '';
  if (!display) {
    res.status(404).json({
      error: {
        displayNotFound: `Display with display ID ${req.params.displayId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the displayType of the display in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
const isValidDisplayContent = (req: Request, res: Response, next: NextFunction) => {
  const {displayType} = req.body as {displayType: string};
  if (!DisplayType.has(displayType.toLowerCase())) {
    res.status(406).json({
      error: 'Display displayType must be either `default`, `dark`, `accessible`.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the display whose displayId is in req.params
 */
const isValidDisplayModifier = async (req: Request, res: Response, next: NextFunction) => {
  const display = await DisplayCollection.findOne(req.params.displayId);
  const userId = display.authorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' displays.'
    });
    return;
  }

  next();
};

export {
  isValidDisplayContent,
  isDisplayExists,
  isValidDisplayModifier
};
