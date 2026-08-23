import mongoose from "mongoose";
import { HomePageSettingsModel } from "./src/models/HomePageSettings";
import { CareerModel } from "./src/models/Career";
import dotenv from "dotenv";

dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  
  const homeSettings = await HomePageSettingsModel.findOne();
  if (homeSettings) {
    console.log("Home Hero image:", homeSettings.hero.image);
    // If it's a broken internal path, clear it so fallback triggers
    if (homeSettings.hero.image === "/src/assets/hero-water.jpg") {
      homeSettings.hero.image = "";
      await homeSettings.save();
      console.log("Cleared broken hero image from CMS.");
    }

    console.log("Careers Title in HomeSettings:", homeSettings.careers.title);
    if (homeSettings.careers.title === "TEST CAREERS TITLE MUTATION") {
      homeSettings.careers.title = "Help Build India’s Water Intelligence Network";
      await homeSettings.save();
      console.log("Reverted Careers Title in HomeSettings.");
    }
  }

  const careers = await CareerModel.find();
  for (const career of careers) {
    console.log("Career Title:", career.title);
  }

  process.exit(0);
}

run();
