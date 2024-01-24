// token.js

const jwt = require('jsonwebtoken');

function createAccessToken(user) {
  const secretKey = 'Rj2S?RVe9[]8-dCS6A**&b5Tsg$gwbg~Bd{*QTK';

  const accessToken = jwt.sign(user, secretKey);
  return accessToken;
}

module.exports = {
  createAccessToken,
};
