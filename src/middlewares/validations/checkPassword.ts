import { Request, Response, NextFunction } from 'express';

export const checkPassword = (req: Request, res: Response, next: NextFunction) => {
  console.log('here');
  
  const { password } = req.body;
  console.log("🚀 ~ file: checkPassword.ts:5 ~ checkPassword ~ password:", password)

  if (typeof password != 'string') {
    return res.status(400).send('Invalid type of parameters on request');
  }
  
  next();
};
