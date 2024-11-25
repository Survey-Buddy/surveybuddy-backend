const bcrypt = require("bcrypt");

async function hashPassword(password) {
  const saltRounds = 10;

  try {
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    console.error("Error hashing password:", error);
    throw new Error("Password hashing failed.");
  }
}

async function comparePasswords(originalPassword, hashedPassword) {
  try {
    return await bcrypt.compare(originalPassword, hashedPassword);
  } catch (error) {
    console.error("Error comparing passwords:", error);
    throw new Error("Password comparison failed.");
  }
}

moduleexports = {
  hashPassword,
  comparePasswords,
};
