// factoryController.ts
import { Request, Response, NextFunction } from "express";
import { Model, Document } from "mongoose";
import { ApiFeatures } from "../utils/ApiFeatures";

type CrudController<T extends Document> = {
  getAll: (req: Request, res: Response, next: NextFunction) => Promise<any>;
  getOne: (req: Request, res: Response, next: NextFunction) => Promise<any>;
  createOne: (req: Request, res: Response, next: NextFunction) => Promise<any>;
  updateOne: (req: Request, res: Response, next: NextFunction) => Promise<any>;
  deleteOne: (req: Request, res: Response, next: NextFunction) => Promise<any>;
};

export const factoryController = <T extends Document>(
  Model: Model<T>
): CrudController<T> => {
  return {
    getAll: async (req, res, next) => {
      try {
        const features = new ApiFeatures(Model.find(), req.query as any)
          .filter()
          .sort()
          .fields()
          .paginate();
        const docs = await features.getQuery();
        res
          .status(200)
          .json({ status: "success", results: docs.length, data: docs });
      } catch (err) {
        next(err);
      }
    },

    getOne: async (req, res, next) => {
      try {
        const doc = await Model.findById(req.params.id);
        if (!doc) {
          return res.status(404).json({ status: "fail", message: "Not found" });
        }
        res.status(200).json({ status: "success", data: doc });
      } catch (err) {
        next(err);
      }
    },

    createOne: async (req, res, next) => {
      try {
        const newDoc = await Model.create(req.body);
        res.status(201).json({ status: "success", data: newDoc });
      } catch (err) {
        next(err);
      }
    },

    updateOne: async (req, res, next) => {
      try {
      const { password } = req.body;
      console.log("Password====>", password);
      if (password) {
        return res.status(400).json({
          status: "fail",
          message: "You cannot update password here",
        });
      }
        const updated = await Model.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!updated) {
          return res.status(404).json({ status: "fail", message: "Not found" });
        }
        res.status(200).json({ status: "success", data: updated });
      } catch (err) {
        next(err);
      }
    },

    deleteOne: async (req, res, next) => {
      try {
        const deleted = await Model.findByIdAndDelete(req.params.id);
        if (!deleted) {
          return res.status(404).json({ status: "fail", message: "Not found" });
        }
        res.status(204).json({ status: "success", data: null });
      } catch (err) {
        next(err);
      }
    },
  };
};
