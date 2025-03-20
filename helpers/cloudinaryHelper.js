const cloudinary = require("../config/cloudinary");

// create helper functions
const uploadImageToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath);

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error("An error occured while uploading ==>", error);
    throw new Error(error);
  }
};

module.exports = {
  uploadImageToCloudinary,
};
