import { Router } from "express";
import {
  getEarnings,
  getMostSellingBookTags,
  getMostSellingBooks,
  getTopCountriesByBookSales,
} from "../controllers/stats.controller.js";
import isAuthenticated, {
  authorizeRoles,
} from "../middlewares/auth.middleware.js";

export const statsRouter = Router();

statsRouter.get(
  "/get-total-earning",
  isAuthenticated,
  // authorizeRoles("admin"),
  getEarnings
);

statsRouter.get(
  "/most-selling-books",
  isAuthenticated,
  // authorizeRoles("admin"),
  getMostSellingBooks
);

statsRouter.get(
  "/most-buying-country",
  isAuthenticated,
  // authorizeRoles("admin"),
  getTopCountriesByBookSales
);

statsRouter.get(
  "/most-selling-books-category",
  isAuthenticated,
  // authorizeRoles("admin"),
  getMostSellingBookTags
);
