const config = require('../config');

function formatQuote(text) {
  return `<b>${text}</b>`;
}

function formatBold(text) {
  return `<b>${text}</b>`;
}

function formatItalic(text) {
  return `<i>${text}</i>`;
}

function formatCode(text) {
  return `<code>${text}</code>`;
}

function formatWithLogo(text) {
  return `<a href="${config.LOGO_URL}">&#8205;</a>\n${text}`;
}

function formatAdminMessage(text) {
  return `${formatQuote(text)}\n\n <b>${config.BOT_NAME}</b>`;
}

module.exports = {
  formatQuote,
  formatBold,
  formatItalic,
  formatCode,
  formatWithLogo,
  formatAdminMessage
};
