import Jwt from "jsonwebtoken";

const signToken = (email, expiry) =>
  Jwt.sign({ email }, process.env.TOKEN_SECRET, {
    expiresIn: expiry,
  });

export default signToken;
