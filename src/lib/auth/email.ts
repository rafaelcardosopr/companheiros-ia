import nodemailer from "nodemailer";

/**
 * Envia o link de login. Sem SMTP_URL, escreve o link no terminal
 * (e devolve false para a tela poder mostrá-lo em desenvolvimento).
 */
export async function sendLoginLink(email: string, url: string): Promise<boolean> {
  const smtp = process.env.SMTP_URL;
  if (!smtp) {
    console.log(`\n[login] Link para ${email}:\n${url}\n`);
    return false;
  }
  const transport = nodemailer.createTransport(smtp);
  await transport.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Seu link de acesso",
    text: `Use este link para entrar (vale por 15 minutos):\n\n${url}\n\nSe você não pediu, ignore este e-mail.`,
  });
  return true;
}
