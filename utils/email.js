const nodemailer = require("nodemailer");
const MailGen = require("mailgen");
const { EMAIL, PASSWORD } = require("../utils/env");
const Mailgen = require("mailgen");

exports.signUpEmail = (email,name) => {
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
      intro: "You have successfully created an account with us.",
      outro: "Enjoy your online shopping with us.",
    },
  };

  let mail = MailGenerator.generate(response);

  let message = {
    from: EMAIL,
    to: email,
    subject: "ACCOUNT CREATION WAS SUCCESSFUL.",
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
