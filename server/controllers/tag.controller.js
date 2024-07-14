import { StatusCodes } from "http-status-codes";
import {
  addTags,
  deleteTag,
  getAllTags,
  updateTag,
} from "../services/tag.service.js";
import {
  AddTagsValidator,
  DeleteTagValidtor,
  UpdateTagValidator,
} from "../validators/tag.validator.js";
import asyncMiddleware from "../middlewares/async.middleware.js";

export const addTag = asyncMiddleware(async (req, res) => {
  await AddTagsValidator.validateAsync(req.body);

  const { tag } = await addTags(req.body.tag);

  res.status(StatusCodes.OK).json({ success: true, tag });
});

export const getTags = asyncMiddleware(async (req, res) => {
  const tags = await getAllTags();

  res.status(StatusCodes.OK).json({ sucess: true, tags });
});

export const updateTags = asyncMiddleware(async (req, res) => {
  await UpdateTagValidator.validateAsync(req.body);

  const { tagId, tag } = req.body;

  const updatedTag = await updateTag(tagId, tag);
  res.status(StatusCodes.OK).json({ success: true, tag: updatedTag });
});

export const delTag = asyncMiddleware(async (req, res) => {
  await DeleteTagValidtor.validateAsync(req.params);

  await deleteTag(req.params.id);

  res.status(StatusCodes.NO_CONTENT).json({
    success: true,
    msg: "Tag deleted successfully.",
  });
});
