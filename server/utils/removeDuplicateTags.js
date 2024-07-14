const removeDuplicateTags = (tags) => {
  const lowerCaseTags = tags.map((tag) => tag.toLowerCase());
  return [...new Set(lowerCaseTags)];
};

export default removeDuplicateTags;
