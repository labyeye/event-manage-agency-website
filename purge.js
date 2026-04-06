    import { PurgeCSS } from "purgecss";
import fs from "fs";

async function runPurge() {
  const purgeCSSResult = await new PurgeCSS().purge({
    content: ["./*.html", "./*.js"],
    css: [
      "./styles-premium.css",
      "./components.css",
      "./pages.css",
      "./layout.css"
    ],
    safelist: [/^active/, /^show/, /^open/, /^fade/]
  });

  
  if (!fs.existsSync("purged-css")) {
    fs.mkdirSync("purged-css");
  }

  purgeCSSResult.forEach((file) => {
    const fileName = file.file.split("/").pop();
    fs.writeFileSync(`purged-css/${fileName}`, file.css);
  });

  console.log("✅ PurgeCSS completed successfully!");
}

runPurge();