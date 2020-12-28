const express = require("express");
const { user } = require("../models");
const router = express.Router();
const translate = require("../config/translate");
const auth = require("../middleware/auth");


router.post("/partnerVerificationCode/:userId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null || usr == "" || req.body.partnerCode == null || req.body.partnerCode == "") {
    return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  }
  let str = req.body.partnerCode;
  //let code = str.substring(3, str.length);
  let userId = parseInt(str.substring(4, str.length - 2)) / 3;
  let checkSum = parseInt(str.substring(str.length - 2, str.length)) - 3;

  if ((userId.toString() + checkSum.toString()) % 77 != 1 || userId == req.params.userId) {
    return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  }

  let usrPartner = await user.findByPk(userId);
  if (usrPartner == null || usrPartner == "") return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  await usr.setUser(usrPartner);

  return res.status(200).json({ message: await translate("SUCCESSFUL", "fa") });
})
router.get("/partnerVerificationCode/:userId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  console.log("useeeer", usr == null);
  if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  let checkSum = (78 - ((usr.id * 100) % 77)) % 77;
  let partnerCode = "PRT-" + (usr.id * 3) + (checkSum + 3);
  return res.status(200).json({ data: { partnerCode: partnerCode } });
})
router.put("/versionType/:userId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null || req.body.type == "" || req.body.type == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  if (usr.version_type != "Teenager" || req.body.type != "Main") return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  await usr.update({ version_type: req.body.type });
  return res
    .status(200)
    .json({ message: await translate("SUCCESSFUL", req.params.lang) });
})
router.post("/versionType/:userId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null || req.body.type == "" || req.body.type == null) {
    return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  }
  if (req.body.type != "Main" && req.body.type != "Partner" && req.body.type != "Teenager") {
    return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  }
  await usr.update({ version_type: req.body.type });
  return res
    .status(200)
    .json({ message: await translate("SUCCESSFUL", req.params.lang) });
})
router.get("/versionType/:userId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  return res
    .status(200)
    .json({ data: { type: usr.version_type } });
})


module.exports = router;
