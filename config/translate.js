const { language, translation_key, translation_text } = require("../models");

module.exports = async function (translationKey, lang) {
    const lg = await language.findOne({
        where: { name: lang }
    });
    const key = await translation_key.findOne({
        where: { key: translationKey }
    });
    const tr = await translation_text.findOne({
        attributes: ['text'],
        where: {
            key_id: key.id,
            language_id: lg.id
        }
    });
    return tr.text;
}