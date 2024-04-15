require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
import App from "./src/app";

async function bootstrap() {
  try {
    const app = new App();
    await app.start();
  } catch (e) {
    throw Error(e as string);
  }
}

bootstrap()
  .then(() => {
    console.log(`
    <.......................>
      Application Started
    <.......................>
    `);
  })
  .catch((e) => {
    console.log(e);
  });
