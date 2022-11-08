import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import ReactionCollection from './collection';

const SymbolType = new Set<string>(['heart', 'like', 'dislike']);

/**
 * Checks if a reaction with reactionId is req.params exists
 */
const isReactionExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.reactionId);
  const reaction = validFormat ? await ReactionCollection.findOne(req.params.reactionId) : '';
  if (!reaction) {
    res.status(404).json({
      error: {
        reactionNotFound: `Reaction with reaction ID ${req.params.reactionId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the type of the symbol in req.body is valid option
 */
const isValidSymbolType = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body.symbol);
  const symbol = req.body.symbol as string;
  if (!SymbolType.has(symbol.toLowerCase())) {
    res.status(406).json({
      error: 'Reaction symbol type must be either `heart`, `like`, `dislike`.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the user of the reaction whose reactionId is in req.params
 */
const isUsersReactionExists = async (req: Request, res: Response, next: NextFunction) => {
  const reaction = await ReactionCollection.findOneByUserAndFreet(req.session.userId._id, req.params.freetId);

  if (!reaction) {
    res.status(404).json({
      error: {
        reactionNotFound: `You do not have a reaction on freet with freet ID ${req.params.freetId}.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the current user has already reacted to tweet
 */
const isSingleReaction = async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.params.freetId);
  const reaction = await ReactionCollection.findOneByUserAndFreet(req.session.userId._id, req.params.freetId);
  if (reaction) {
    res.status(403).json({
      error: 'Cannot have more than one reaction per Freet per user. Please modify your reaction.'
    });
    return;
  }

  next();
};

export {
  isValidSymbolType,
  isReactionExists,
  isSingleReaction,
  isUsersReactionExists
};
