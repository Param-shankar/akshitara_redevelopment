const { oauth2client } = require("../utils/googleConfig");
const axios = require("axios");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const Wishlist = require("../models/wishlist.model");
const Cart = require("../models/cart.model");

const googleLogin = async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res
        .status(400)
        .json({ message: "Authorization code not provided" });
    }
    console.log("Received code:", code);

    const googleRes = await oauth2client.getToken(code);
    oauth2client.setCredentials(googleRes.tokens);
    console.log("Google tokens:", googleRes.tokens);

    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    );

    const { email, name, picture } = userRes.data;
    const uname = name;
    console.log("User info from Google:", { email, uname, picture });

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        username: name,
        email,
        image: picture,
      });
    }

    const { _id } = user;

    const newCart = new Cart({
      user_id: _id,
      created_at: new Date(),
      updated_at: new Date(),
    });
    await newCart.save();

    const newWishlist = new Wishlist({
      user_id: _id,
      created_at: new Date(),
    });
    await newWishlist.save();

    const token = jwt.sign({ _id, name, email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_TIMEOUT,
    });

    console.log("Generated JWT token:", token);

    return res.status(200).json({
      message: "Success",
      token,
      user: {
        user_id: _id,
        name: uname,
        email: user.email,
        image: user.image,
      },
    });
  } catch (err) {
    console.error("Error during Google OAuth2 process:", err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  googleLogin,
};
