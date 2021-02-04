require('dotenv').config();
const {
  renderError,
  parseBoolean,
  CONSTANTS,
  isLocaleAvailable,
} = require('../src/common/utils');
const { fetchLast7Days } = require('../src/fetchers/wakatime-fetcher');
const wakatimeCard = require('../src/cards/wakatime-card');

module.exports = async (req, res) => {
  const {
    username,
    title_color,
    icon_color,
    hide_border,
    line_height,
    text_color,
    bg_color,
    theme,
    hide_title,
    hide_progress,
    custom_title,
    locale,
    layout,
    api_domain,
  } = req.query;

  res.setHeader('Content-Type', 'image/svg+xml');

  if (locale && !isLocaleAvailable(locale)) {
    return res.send(renderError('Something went wrong', 'Language not found'));
  }

  try {
    const last7Days = await fetchLast7Days({ username, api_domain });

    if (username === 'ridays2001') res.setHeader('Cache-Control', 'public, max-age=900');
    else res.setHeader('Cache-Control', `public, max-age=${CONSTANTS.ONE_DAY}`);

    return res.send(
      wakatimeCard(last7Days, {
        custom_title,
        hide_title: parseBoolean(hide_title),
        hide_border: parseBoolean(hide_border),
        line_height,
        title_color,
        icon_color,
        text_color,
        bg_color,
        theme,
        hide_progress,
        locale: locale ? locale.toLowerCase() : null,
        layout,
      }),
    );
  } catch (err) {
    return res.send(renderError(err.message, err.secondaryMessage));
  }
};
