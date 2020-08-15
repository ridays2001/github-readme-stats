require('dotenv').config();

const { renderError, parseBoolean, parseArray } = require('../src/common/utils');
const fetchStats = require('../src/fetchers/stats-fetcher');
const renderStatsCard = require('../src/cards/stats-card');

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
	theme
  } = req.query;
  let stats;

  try {
	stats = await fetchStats(
	  username,
	  parseBoolean(count_private),
	  parseBoolean(include_all_commits)
	);

	if (username === 'ridays2001') res.setHeader('Cache-Control', 'public, max-age=900');
	else res.setHeader('Cache-Control', `public, max-age=86400`);

	res.setHeader('Content-Type', 'image/svg+xml');

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
	  })
	);
  } catch (err) {
	return res.send(renderError(err.message, err.secondaryMessage));
  }
};
