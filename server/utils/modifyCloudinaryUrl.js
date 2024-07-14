export function modifyCloudinaryUrl(url, width, height) {
  // Define the width and height parameters
  const sizeParams = `w_${width},h_${height}`;

  // Find the position to insert the size parameters (after "upload/")
  const uploadIndex = url.indexOf("/upload/") + "/upload/".length;

  // Insert the size parameters into the URL
  const modifiedUrl =
    url.slice(0, uploadIndex) + sizeParams + "/" + url.slice(uploadIndex);

  return modifiedUrl;
}
