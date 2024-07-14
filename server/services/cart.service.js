import Cart from "../models/cart.model.js";

export const clearCart = async (userId) => {
  await Cart.findOneAndUpdate({ user: userId }, { $set: { items: [] } });
};

export const createCart = async (userId) => {
  await Cart.create({ user: userId, items: [] });
};
