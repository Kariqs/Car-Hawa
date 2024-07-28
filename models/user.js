const mongoose = require("mongoose");
const product = require("./product");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
  resetToken: String,
  resetTokenExpiration: Date,
});

userSchema.methods.addToCart = function (product) {
  //find the index of the product in the cart.
  const cartProductIndex = this.cart.items.findIndex((cp) => {
    return cp.productId.toString() === product._id.toString();
  });

  let newQuantity = 1;
  //create a copy of the cart Items
  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    // If the product is already in the cart, increment the quantity
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    // If the product is not in the cart, add it with quantity 1
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity,
    });
  }

  // Update the cart with the new items
  const updatedCart = {
    items: updatedCartItems,
  };

  // Assign the updated cart to the user's cart and save
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.removeFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter((item) => {
    return item.productId.toString() !== productId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
};
module.exports = mongoose.model("User", userSchema);
