import { VERIFICATION_TOKEN } from "../utils/constants.js";

const setVerificationCookie = (token, res) => {
  const twoMinutes = 2 * 60 * 1000;

  res.cookie(VERIFICATION_TOKEN, token, {
    expires: new Date(Date.now() + twoMinutes),
    maxAge: twoMinutes,
  });
};

export default setVerificationCookie;
