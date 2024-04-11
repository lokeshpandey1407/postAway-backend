import multer from "multer";
import path from "path";
import fs from "fs";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    const originalname = file.originalname;
    const filePath = path.join("public/images", originalname);

    // Check if file already exists
    if (fs.existsSync(filePath)) {
      // If file exists, use the original filename
      cb(null, originalname);
    } else {
      // If file doesn't exist, generate a unique filename
      const uniqueSuffix = Date.now() + "-" + originalname;
      cb(null, uniqueSuffix);
    }
  },
});

export const upload = multer({ storage: storage }).single("imageUrl");
