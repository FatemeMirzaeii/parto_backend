const User = require("../../models/User");
const jwt = require("jsonwebtoken");

describe("user.generateAuthToken", () => {
  it("should return a valid JWT", () => {
    const user = new User({ id: 1 });
    const token = user.generateAuthToken();
    const decoded = jwt.verify(token, "parto_secret");
    expect(decoded).toMatch({ id: 1 });
  });
});
