import { Request, Response, NextFunction } from 'express';

export const checkPassword = (req: Request, res: Response, next: NextFunction) => {
  const { password } = req.body;

  if (typeof password != 'string') {
    return res.status(404).send('Invalid type of parameters on request');
  }
  
  next();
};
