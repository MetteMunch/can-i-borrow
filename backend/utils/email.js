import nodemailer from 'nodemailer';

export async function sendResetEmail(toEmail) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // din Gmail
      pass: process.env.EMAIL_PASS, // app password!
    },
  });

  const mailOptions = {
    from: `"Mit System" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Nulstil password',
    html: `
            <h2>Nulstil dit password</h2>
            <p>Klik på linket herunder for at nulstille dit password (demo-link):</p>
            <a href="http://localhost:5173/reset-demo">Nulstil password</a>
            <br/><br/>
            <p>(Dette er kun en demo – password ændres ikke)</p>
        `,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('Mail sendt:', info.messageId);
}
