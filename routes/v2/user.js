const express = require("express");
const { user, user_log, user_profile, user_tracking_option, pregnancy, user_answer_survey,note , user_tracking_category} = require("../../models");
const router = express.Router();
const translate = require("../../config/translate");
const auth = require("../../middleware/auth");

router.put("/:userId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  await user_tracking_option.destroy({
    where: {
      user_id: req.params.userId,
    }
  })
  await user_tracking_category.destroy({
    where: {
      user_id: req.params.userId,
    }
  })
  await pregnancy.destroy({
    where: {
      user_id: req.params.userId,
    }
  })

  await note.destroy({
    where: {
      user_id: req.params.userId,
    }
  })

  await user_profile.update({
    birthdate: null,
    height: null,
    weight: null,
    avg_sleeping_hour: null,
    blood_type: null,
    locked: null,
    avg_cycle_length: 28,
    avg_period_length: 7,
    pms_length: null,
    pregnant: 0,
    pregnancy_try: 0,
    last_period_date: null,
    ovulation_prediction: null,
    period_prediction: null,
    red_days: null
  }, {
    where: {
      user_id: req.params.userId
    }
  })
  return res.status(200).json({ message: await translate("SUCCESSFUL", req.params.lang) });
})
router.delete("/:userId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });

  await user_tracking_option.destroy({
    where: {
      user_id: req.params.userId,
    }
  })
  await user_tracking_category.destroy({
    where: {
      user_id: req.params.userId,
    }
  })
  await pregnancy.destroy({
    where: {
      user_id: req.params.userId,
    }
  })
  
  await user_profile.destroy({
    where: {
      user_id: req.params.userId
    }
  })

  await note.destroy({
    where: {
      user_id: req.params.userId
    }
  })

  await user_answer_survey.destroy({
    where: {
      userId: req.params.userId
    }
  })
  
  await user_log.destroy({
    where: {
      user_id: req.params.userId
    }
  })
  
  await usr.destroy();

  return res.status(200).json({ message: await translate("SUCCESSFUL", req.params.lang) });
})

module.exports = router;
