import { Request, Response, NextFunction } from "express";

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = (req as any).user;
    console.log(user);
    if (!user) {
      res.status(401).json({ message: "Unauthorized" }); // ✅ return
      return;
    }
    if (user.role !== "admin") {
      res.status(403).json({ message: "Admins only." }); // ✅ return
      return;
    }

    next(); // ✅ يُستدعى فقط إذا لم يتم الرد
  } catch (error) {
    next(error);
  }
};
