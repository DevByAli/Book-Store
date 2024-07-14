const createActivationCode = () => {
  const characters = "0123456789";
  let activationCode = "";
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    activationCode += characters[randomIndex];
  }
  return activationCode;
};

export default createActivationCode;
