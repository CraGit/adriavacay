import nodemailer from "nodemailer";

const account = await nodemailer.createTestAccount();

console.log("Ethereal test account created. Add these to .env.local:\n");
console.log(`MAIL_HOST=smtp.ethereal.email
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=${account.user}
MAIL_PASSWORD=${account.pass}
MAIL_FROM=AdriaVacay <${account.user}>
MAIL_TO=owner@example.com
`);
console.log(`Inbox: https://ethereal.email/login`);
console.log(`User: ${account.user}`);
console.log(`Pass: ${account.pass}`);
console.log("\nAccounts expire after ~24h. Re-run: npm run mail:ethereal");
