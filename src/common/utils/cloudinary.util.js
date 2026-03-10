const cloudinary = require("../../config/cloudinary.config");

exports.uploadImage = (buffer) => {
  return new Promise((resolve, reject) => {

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "pos-menu",
      },
      (error, result) => {
        if (error) return reject(error);

        resolve({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    stream.end(buffer);
  });
};

exports.deleteImage = async (publicId) => {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId);
};
