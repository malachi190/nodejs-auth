const Image = require("../models/Image");
const { uploadImageToCloudinary } = require("../helpers/cloudinaryHelper");

const uploadImage = async (req, res) => {
  try {
    // check if file exists in the request
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File does not exist in the request",
      });
    }

    // Upload image to cloudinary
    const { url, public_id } = await uploadImageToCloudinary(req.file.path);

    // store image details in mongo db
    const newImage = new Image({
      url: url,
      publicId: public_id,
      uploadedBy: req.userInfo.userId,
    });

    await newImage.save();

    res.status(201).json({
      success: true,
      message: "Image uploaded successfully.",
      data: newImage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong, please try again.",
    });
  }
};

const fetchImages = async (req, res) => {
  try {
    // handle pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const totalImages = await Image.countDocuments();
    const totalPages = Math.ceil(totalImages / limit);
    const sortObj = {};
    sortObj[sortBy] = sortOrder;
    const images = await Image.find().sort(sortObj).skip(skip).limit(limit);

    if (images.length > 0) {
      res.status(200).json({
        success: true,
        message: "Images fetched successfully.",
        data: images,
        currentPage: page,
        totalPages: totalPages,
        totalImages: totalImages,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong, please try again.",
    });
  }
};

module.exports = {
  uploadImage,
  fetchImages,
};
