const crypto = require("crypto");
const { User } = require("../Modules/User");
const generateUserCode = () => {
    return `SL-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
};

const generateUniqueUserCode = async () => {
  let userCode;
  let exists = true;

  while (exists) {
    userCode = generateUserCode();
    exists = await User.exists({ userCode });
  }

  return userCode;
};

module.exports = generateUniqueUserCode;
