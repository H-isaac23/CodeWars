const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const Account = require("../models/account");

loginRouter.post("/", async (request, response) => {
  const { username, password } = request.body;

  const account = await Account.findOne({ username });
  const passwordCorrect =
    account === null
      ? false
      : await bcrypt.compare(password, account.passwordHash);

  if (!(account && passwordCorrect)) {
    return response.status(401).json({
      error: "invalid username or password",
    });
  }

  const userForToken = {
    username,
  };

  const token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: 60 * 5,
  });

  response.status(200).send({
    username: account.username,
    email: account.email,
    stars: account.stars,
    token,
  });
});

module.exports = loginRouter;
