require('dotenv').config();
const {
  renderError,
  parseBoolean,
  parseArray,
  CONSTANTS,
} = require('../src/common/utils');
const fetchTopLanguages = require('../src/fetchers/top-languages-fetcher');
const renderTopLanguages = require('../src/cards/top-languages-card');
const blacklist = require('../src/common/blacklist');
const { isLocaleAvailable } = require('../src/translations');

module.exports = async (req, res) => {
  const {
    username,
    hide,
    hide_title,
    hide_border,
    card_width,
    title_color,
    text_color,
    bg_color,
    theme,
    layout
  } = req.query;
  let topLangs;

  if (blacklist.includes(username)) {
    return res.send(renderError('DENIED'));
  }

  if (locale && !isLocaleAvailable(locale)) {
    return res.send(renderError('Something went wrong', 'Language not found'));
  }

  try {
    topLangs = await fetchTopLanguages(
      username,
      langs_count,
      parseArray(exclude_repo),
    );

    if (username === 'ridays2001') res.setHeader('Cache-Control', 'public, max-age=900');
    else res.setHeader('Cache-Control', `public, max-age=${CONSTANTS.ONE_DAY}`);

    return res.send(
      renderTopLanguages(topLangs, {
        custom_title,
        hide_title: parseBoolean(hide_title),
        hide_border: parseBoolean(hide_border),
        card_width: parseInt(card_width, 10),
        hide: parseArray(hide),
        title_color,
        text_color,
        bg_color,
        theme,
        layout,
        locale: locale ? locale.toLowerCase() : null,
      }),
    );
  } catch (err) {
    return res.send(renderError(err.message, err.secondaryMessage));
  }
}