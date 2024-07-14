import { Router } from "express";
import isAuthenticated, {
    authorizeRoles,
} from "../middlewares/auth.middleware.js";
import {
    addTag,
    delTag, getTags,
    updateTags
} from "../controllers/tag.controller.js";

export const tagRouter = Router();

tagRouter.post(
  "/add-tag",
  isAuthenticated,
  authorizeRoles("admin"),
  addTag
);

tagRouter.get(
  "/get-tags",
  isAuthenticated,
  authorizeRoles("admin"),
  getTags
);

tagRouter.patch(
  "/update-tag",
  isAuthenticated,
  authorizeRoles("admin"),
  updateTags
);

tagRouter.delete(
  "/delete-tag/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  delTag
);
