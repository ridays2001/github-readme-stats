require('dotenv').config();
const {
  renderError,
  parseBoolean,
  CONSTANTS,
} = require('../src/common/utils');
const fetchRepo = require('../src/fetchers/repo-fetcher');
const renderRepoCard = require('../src/cards/repo-card');
const blacklist = require('../src/common/blacklist');
const { isLocaleAvailable } = require('../src/translations');

module.exports = async (req, res) => {
  const {
    username,
    repo,
    hide_border,
    title_color,
    icon_color,
    text_color,
    bg_color,
    theme,
    show_owner,
    locale,
  } = req.query;

  let repoData;

  res.setHeader('Content-Type', 'image/svg+xml');

  if (blacklist.includes(username)) {
    return res.send(renderError('DENIED'));
  }

  if (locale && !isLocaleAvailable(locale)) {
    return res.send(renderError('Something went wrong', 'Language not found'));
  }

  try {
    repoData = await fetchRepo(username, repo);

    if (username === 'ridays2001') res.setHeader('Cache-Control', 'public, max-age=900');
    else res.setHeader('Cache-Control', `public, max-age=${CONSTANTS.ONE_DAY}`);

    return res.send(
      renderRepoCard(repoData, {
        hide_border,
        title_color,
        icon_color,
        text_color,
        bg_color,
        theme,
        show_owner: parseBoolean(show_owner),
        locale: locale ? locale.toLowerCase() : null,
      }),
    );
  } catch (err) {
    return res.send(renderError(err.message, err.secondaryMessage));
  }
};
