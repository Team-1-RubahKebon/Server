const { OAuth2Client } = require("google-auth-library");
const credential = require("../arctic-plasma-377908-7bbfda6bfa06.json");

const googleAuth = new OAuth2Client(credential.client_id);

module.exports = googleAuth