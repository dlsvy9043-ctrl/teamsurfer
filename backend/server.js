import express from "express";
import cors from "cors";
import puppeteer from "puppeteer";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get("/rank", async (req, res) => {
  const { store, keyword } = req.query;

  if (!store || !keyword) {
    return res.status(400).json({ error: "store와 keyword를 보내주세요" });
  }

  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();

    const searchUrl = `https://search.naver.com/search.naver?where=nexearch&sm=top_hty&query=${encodeURIComponent(
      keyword
    )}`;

    await page.goto(searchUrl, { waitUntil: "domcontentloaded" });

    const places = await page.$$eval(
      ".place_section_content .place_bluelink",
      (elements) => elements.map((el) => el.textContent.trim())
    );

    await browser.close();

    const rank =
      places.findIndex((name) => name.includes(store)) + 1;

    if (rank > 0) {
      res.json({ store, keyword, rank });
    } else {
      res.json({ store, keyword, rank: null, message: "순위 없음" });
    }
  } catch (err) {
    console.error("크롤링 오류:", err.message);
    res.status(500).json({ error: "크롤링 실패", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
