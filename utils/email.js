const nodemailer = require("nodemailer");
const MailGen = require("mailgen");
const { EMAIL, PASSWORD } = require("../utils/env");

exports.signUpEmail = (email, name, intro, subject, action) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL,
      pass: PASSWORD,
    },
  });

  let MailGenerator = new MailGen({
    theme: "default",
    product: {
      name: "CAR-HAWA",
      link: "https://mailgen.js",
    },
  });

  let response = {
    body: {
      name: name,
      intro: intro,
      action: action,
      outro: "Enjoy your online shopping with us.",
    },
  };

  let mail = MailGenerator.generate(response);

  let message = {
    from: EMAIL,
    to: email,
    subject: subject,
    html: mail,
  };

  transporter
    .sendMail(message)
    .then(() => {
      return console.log("Email sent.");
    })
    .catch((err) => {
      console.log(err);
    });
};
