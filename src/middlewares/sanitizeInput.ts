import { Request, Response, NextFunction } from 'express';
import sanitizeHtml from 'sanitize-html';

const sanitize = (obj: any): void => {
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      obj[key] = sanitizeHtml(obj[key], {
        allowedTags: [],
        allowedAttributes: {},
      });
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      sanitize(obj[key]); // تعقيم العناصر المتداخلة
    }
  }
};

const sanitizeInputMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  if (req.params) sanitize(req.params);
  next();
};

export default sanitizeInputMiddleware;
