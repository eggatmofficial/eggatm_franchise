const Menu = require("./menu.model");
const {
  uploadImage,
  deleteImage,
} = require("../../common/utils/cloudinary.util");

class MenuService {

  /* CREATE MENU */
async create(payload, file, franchiseId) {

    console.log("payload",payload);
    console.log("file",file);
    
  /* ===== PRICE VALIDATION ===== */
  if (!payload.price && payload.price !== 0) {
    throw new Error("Price is required");
  }

  const priceNumber = Number(payload.price);

  if (isNaN(priceNumber)) {
    throw new Error("Price must be a number");
  }

  payload.price = priceNumber;

  /* ===== BOOLEAN FIX ===== */
  payload.isAvailable =
    payload.isAvailable === "true" ||
    payload.isAvailable === true;

  let imageData = {};

  if (file) {
    imageData = await uploadImage(file.buffer);
  }

  return Menu.create({
    ...payload,
    franchiseId,
    image: imageData.url,
    imagePublicId: imageData.public_id,
  });
}



  /* GET ALL */
  async getAll(franchiseId) {
    return Menu.find({ franchiseId }).sort({ createdAt: -1 });
  }

  /* UPDATE MENU */
async update(id, payload, file) {

  if (payload.price !== undefined) {
    payload.price = Number(payload.price);
  }

  if (payload.isAvailable !== undefined) {
    payload.isAvailable =
      payload.isAvailable === "true" ||
      payload.isAvailable === true;
  }

  const existing = await Menu.findById(id);
  if (!existing) throw new Error("Menu not found");

  if (file) {
    await deleteImage(existing.imagePublicId);

    const imageData = await uploadImage(file.buffer);

    payload.image = imageData.url;
    payload.imagePublicId = imageData.public_id;
  }

  return Menu.findByIdAndUpdate(
    id,
    payload,
    { returnDocument: "after" }
  );
}


  /* DELETE MENU */
  async delete(id) {

    const menu = await Menu.findById(id);
    if (!menu) return;

    await deleteImage(menu.imagePublicId);

    await Menu.findByIdAndDelete(id);
  }
}

module.exports = new MenuService();
