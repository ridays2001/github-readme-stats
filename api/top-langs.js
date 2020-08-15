require('dotenv').config();

const { renderError, parseBoolean, parseArray } = require('../src/common/utils');
const fetchTopLanguages = require('../src/fetchers/top-languages-fetcher');
const renderTopLanguages = require('../src/cards/top-languages-card');

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

	try {
		topLangs = await fetchTopLanguages(username);

		if (username === 'ridays2001') res.setHeader('Cache-Control', 'public, max-age=900')
		else res.setHeader('Cache-Control', `public, max-age=86400`);

		res.setHeader('Content-Type', 'image/svg+xml');

		return res.send(
			renderTopLanguages(topLangs, {
				hide_title: parseBoolean(hide_title),
				hide_border: parseBoolean(hide_border),
				card_width: parseInt(card_width, 10),
				hide: parseArray(hide),
				title_color,
				text_color,
				bg_color,
				theme,
				layout,
			})
		);
	} catch (err) {
		return res.send(renderError(err.message, err.secondaryMessage));
	}
};
