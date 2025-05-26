
import {MailtrapClient} from "mailtrap";
import "dotenv/config";

const TOKEN = process.env.MAILTRAP_TOKEN;
console.log("Mailtrap Token:", TOKEN);

export const mailtrapClient = new MailtrapClient({
  token: TOKEN,
  
});

export const sender = {
  email: "hello@demomailtrap.co",
  name: "Triggers",
};


