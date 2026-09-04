import { config } from '../config';

export function formatQuote(text: string): string {
  return `<blockquote>${text}</blockquote>`;
}

export function formatBold(text: string): string {
  return `<b>${text}</b>`;
}

export function formatItalic(text: string): string {
  return `<i>${text}</i>`;
}

export function formatCode(text: string): string {
  return `<code>${text}</code>`;
}

// ✅ CORRIGÉ - config est maintenant importé
export function formatWithLogo(text: string): string {
  return `<a href="${config.LOGO_URL}">&#8205;</a>\n${text}`;
}

export function formatAdminMessage(text: string): string {
  return `${formatQuote(text)}\n\n👑 <b>${config.BOT_NAME}</b>`;
}
