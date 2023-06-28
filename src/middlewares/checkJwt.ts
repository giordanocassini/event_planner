import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  const token = <any>req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).send('Not logged.');
  }

  let jwtPayLoad;

  try {
    jwtPayLoad = <any>jwt.verify(token, process.env.JWT_SECRET ?? '');
    console.log('🚀 ~ file: checkJwt.ts:15 ~ checkJwt ~ jwtPayLoad:', jwtPayLoad);
    res.locals.jwtPayLoad = jwtPayLoad;
  } catch (error: any) {
    return res.status(401).send();
  }

  const { id } = jwtPayLoad;
  
  const newToken = jwt.sign({ id }, process.env.JWT_SECRET ?? '', {
    expiresIn: '1h',
  });

  res.setHeader('Authorization', 'Bearer ' + newToken);

  next();
};
