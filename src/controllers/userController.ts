import { User } from "../modules/userModule";
import { factoryController } from "./factoryController";

// ---------- Get All Users -----------
export const getAllUsers = factoryController(User).getAll;
// ---------- Create User -----------
export const createUser = factoryController(User).createOne;
// ---------- Get User -----------
export const getUser = factoryController(User).getOne;
// ---------- Delete User -----------
export const deleteUser = factoryController(User).deleteOne;
// ---------- Update User -----------
export const updateUser = factoryController(User).updateOne;
