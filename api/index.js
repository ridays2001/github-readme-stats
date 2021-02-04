require('dotenv').config();
const {
  renderError,
  parseBoolean,
  parseArray,
  CONSTANTS,
} = require('../src/common/utils');
const fetchStats = require('../src/fetchers/stats-fetcher');
const renderStatsCard = require('../src/cards/stats-card');
const blacklist = require('../src/common/blacklist');
const { isLocaleAvailable } = require('../src/translations');

module.exports = async (req, res) => {
  const {
    username,
    hide,
    hide_title,
    hide_border,
    hide_rank,
    show_icons,
    count_private,
    include_all_commits,
    line_height,
    title_color,
    icon_color,
    text_color,
    bg_color,
    theme,
    custom_title,
    locale,
    disable_animations,
  } = req.query;
  let stats;

  res.setHeader('Content-Type', 'image/svg+xml');

  if (blacklist.includes(username)) {
    return res.send(renderError('DENIED'));
  }

  if (locale && !isLocaleAvailable(locale)) {
    return res.send(renderError('Something went wrong', 'Language not found'));
  }

  try {
    stats = await fetchStats(
      username,
      parseBoolean(count_private),
      parseBoolean(include_all_commits),
    );

    if (username === 'ridays2001') res.setHeader('Cache-Control', 'public, max-age=900')
    else res.setHeader('Cache-Control', `public, max-age=${CONSTANTS.ONE_DAY}`);

    return res.send(
      renderStatsCard(stats, {
        hide: parseArray(hide),
        show_icons: parseBoolean(show_icons),
        hide_title: parseBoolean(hide_title),
        hide_border: parseBoolean(hide_border),
        hide_rank: parseBoolean(hide_rank),
        include_all_commits: parseBoolean(include_all_commits),
        line_height,
        title_color,
        icon_color,
        text_color,
        bg_color,
        theme,
        custom_title,
        locale: locale ? locale.toLowerCase() : null,
        disable_animations: parseBoolean(disable_animations),
      }),
    );
  } catch (err) {
    return res.send(renderError(err.message, err.secondaryMessage));
  }
};
