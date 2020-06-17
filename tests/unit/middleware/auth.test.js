const { user } = require("../../../models");
const jwt = require("jsonwebtoken");
const auth=require('../../../middleware/auth');
var fs = require("fs");
const secret = fs.readFileSync("../private.key", "utf8");

describe("user.generateAuthToken", () => {
  it("should return a valid JWT", async() => {
    // const User =await user.create({name:"zahra", email:"zazzand55za@gmail.com"});
    // const token = User.generateAuthToken();
    // const decoded = await jwt.verify(token, secret);
    // console.log(decoded);
    // //const decoded = await jwt.verify(token, secret);
    // console.log(User.id);
      
    // const req = {
    //   header: jest.fn().mockReturnValue("")
    // };
    // const res = {};
    // const next = jest.fn();
    
    // await auth(req, res, next);
    // console.log(req.user);
    // expect(req.user).toMatchObject(decoded);
    // user.destroy();
  });
});
