const express = require("express");
const { user } = require("../models");
const bcrypt = require("bcrypt");
const router = express.Router();
const translate = require("../config/translate");

/**
 * @swagger
 * /signUp:
 *   post:
 *     tags:
 *       - Users
 *     name:sign up
 *     summary: sign up in a user
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: body
 *       - email: body
 *       - password: body
 *         schema:
 *           $ref: '#/definitions/User'
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             password:
 *               type: string
 *             email:
 *               type: string  
 *         required:
 *           - email
 *      responses:
 *       '200':
 *         description: User found and logged in successfully
 *       '401':
 *         description: Bad username, not found in db
 *       '403':
 *         description: Username and password don't match
 */

router.post("/signUp/:lang", async (req, res) => {
  const exists = await user.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (exists) return res.status(400).json({ message: await translate("EMAILEXISTS", req.params.lang) });
  const hash = await bcrypt.hash(req.body.password, 10);
  const usr = await user.create({
    name: req.body.name,
    email: req.body.email,
    password: hash,
  });
  const token = usr.generateAuthToken();
  res.header("x-auth-token", token).status(200).json({ data: { id: usr.id } });
});

//
module.exports = router;
