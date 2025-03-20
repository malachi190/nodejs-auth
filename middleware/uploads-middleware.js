const multer = require("multer");
const path = require("path");
const fs = require("fs");

// check if directory exists
if (!fs.existsSync("uploads/")) {
  fs.mkdirSync("uploads/");
}

// set our multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// file filter function
const checkFileFilter = (req, file, cb) => {
  if (file.mimetype?.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Error: Only images are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: checkFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// export file as a multer middleware
module.exports = upload;
