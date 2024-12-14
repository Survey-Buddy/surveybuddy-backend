require("dotenv").config({ path: ".env.test" });

const { dbConnect } = require("./src/functions/dbFunctions");

beforeAll(async () => {
  await dbConnect();
});
