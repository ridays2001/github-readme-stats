require('dotenv').config();

const { renderError, parseBoolean } = require('../src/common/utils');
const fetchRepo = require('../src/fetchers/repo-fetcher');
const renderRepoCard = require('../src/cards/repo-card');

module.exports = async (req, res) => {
	const {
		username,
		repo,
		title_color,
		icon_color,
		text_color,
		bg_color,
		theme,
		show_owner
	} = req.query;

	let repoData;

	res.setHeader('Content-Type', 'image/svg+xml');

	try {
		repoData = await fetchRepo(username, repo);

		if (username === 'ridays2001') res.setHeader('Cache-Control', `public, max-age=1800`);
		else res.setHeader('Cache-Control', `public, max-age=86400`);

		return res.send(
			renderRepoCard(repoData, {
				title_color,
				icon_color,
				text_color,
				bg_color,
				theme,
				show_owner: parseBoolean(show_owner),
			})
		);
	} catch (err) {
		return res.send(renderError(err.message, err.secondaryMessage));
	}
};
