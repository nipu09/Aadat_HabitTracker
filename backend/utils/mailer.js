const nodemailer = require("nodemailer");
const env = require("../config/env");

let transporter;

function getTransporter() {
  if (!env.SMTP_HOST) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
    });
  }
  return transporter;
}

async function sendMail({ to, subject, text, html }) {
  const t = getTransporter();
  if (!t) {
    // Development only: env validation makes SMTP mandatory in production.
    console.log(`\n[mail:dev] To: ${to}\nSubject: ${subject}\n${text}\n`);
    return;
  }
  await t.sendMail({ from: env.MAIL_FROM, to, subject, text, html });
}

const wrap = (title, body) => `
<div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:24px;color:#2a2742">
  <h2 style="margin:0 0 12px">${title}</h2>
  ${body}
  <p style="color:#8b87a5;font-size:12px;margin-top:24px">If you didn't request this, you can ignore this email.</p>
</div>`;

const codeBlock = (code) =>
  `<p style="font-size:32px;letter-spacing:8px;font-weight:700;margin:16px 0">${code}</p>`;

function sendVerificationEmail(to, name, code) {
  return sendMail({
    to,
    subject: "Verify your Aadat account",
    text: `Hi ${name}, your Aadat verification code is ${code}. It expires in 10 minutes.`,
    html: wrap(
      "Verify your email",
      `<p>Hi ${escapeHtml(name)}, use this code to finish creating your account:</p>${codeBlock(code)}<p>It expires in 10 minutes.</p>`,
    ),
  });
}

function sendResetEmail(to, name, code) {
  return sendMail({
    to,
    subject: "Reset your Aadat password",
    text: `Hi ${name}, your Aadat password reset code is ${code}. It expires in 10 minutes.`,
    html: wrap(
      "Reset your password",
      `<p>Hi ${escapeHtml(name)}, use this code to choose a new password:</p>${codeBlock(code)}<p>It expires in 10 minutes.</p>`,
    ),
  });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

module.exports = { sendVerificationEmail, sendResetEmail };
