import env from "@/env";
import hbs from "nodemailer-express-handlebars";
const nodemailer = require("nodemailer");

// create transporter using gmail
export const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: false,
  auth: {
    user: env.GMAIL_USER,
    pass: env.GMAIL_APP_PASSWORD,
  },
});

// configure handlebars
transporter.use(
  "compile",
  hbs({
    viewEngine: {
      extname: ".hbs",
      layoutsDir: "src/lib/view/layout/",
      defaultLayout: "main",
    },
    viewPath: "src/lib/view",
    extName: ".hbs",
  }),
);