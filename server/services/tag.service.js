import Tag from "../models/tag.model.js";
import removeDuplicateTags from "../utils/removeDuplicateTags.js";

export const addTags = async (tag) => {
  const isTagPresent = await Tag.findOne({ tag });

  if (isTagPresent) {
    return [];
  }

  return await Tag.create({ tag });
};

export const getAllTags = async () => {
  return await Tag.find();
};

export const updateTag = async (tagId, tag) => {
  return await Tag.findOneAndUpdate(
    { _id: tagId },
    { $set: { tag } },
    { new: true }
  );
};

export const deleteTag = async (tagId) => {
  return await Tag.findOneAndDelete({ _id: tagId });
};
