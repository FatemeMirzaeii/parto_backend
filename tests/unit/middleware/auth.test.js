const { user } = require("../../../models");
require('mysql2/node_modules/iconv-lite').encodingExists('foo');
const jwt = require("jsonwebtoken");
const auth=require('../../../middleware/auth');
var fs = require("fs");
const secret = fs.readFileSync("../private.key", "utf8");

describe("user.generateAuthToken", () => {
  it("should return a valid JWT", async() => {
    const User =await user.create({name:"zahra", email:"midle_auth@gmail.com"});
    const token = User.generateAuthToken();

    const req = {
      header: jest.fn().mockReturnValue(token),
      params:jest.fn().mockReturnValue(User.id)
    };
    const res = {};
    const next = jest.fn();
    
    await auth(req, res, next);
    const decoded = await jwt.verify(token, secret);
    
    expect(req.user).toMatchObject(decoded);
    
    await User.destroy();
  });
});
