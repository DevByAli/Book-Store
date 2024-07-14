import bcrypt from "bcrypt";
import { configDotenv } from "dotenv";
import Jwt from 'jsonwebtoken'

import createActivationCode from "./createActivationCode.js";

configDotenv("dotenv");

export const createActivationToken = async (user) => {
  // create a random acitivation code
  const activationCode = createActivationCode();

  const hashedActivationCode = await bcrypt.hash(activationCode, 10);

  // data of the token that will use be use for checking either the use correct activation code
  const tokenData = { user, activationCode: hashedActivationCode };

  const token = Jwt.sign(tokenData, process.env.ACTIVATION_TOKEN_SECRET, {
    expiresIn: "2m",
  });

  return { token, activationCode };
};
