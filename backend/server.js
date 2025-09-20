import express from "express";
import puppeteer from "puppeteer";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/rank", async (req, res) => {
  const { store, keyword } = req.query;
  if (!store || !keyword) {
    return res.status(400).json({ error: "store, keyword 파라미터 필요" });
  }

  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();
    const url = `https://search.naver.com/search.naver?query=${encodeURIComponent(keyword)}`;
    await page.goto(url, { waitUntil: "domcontentloaded" });

    const results = await page.evaluate(() => {
      const items = [];
      document.querySelectorAll(".place_section_content .place_bluelink").forEach((el, idx) => {
        items.push({ rank: idx + 1, name: el.textContent.trim() });
      });
      return items;
    });

    await browser.close();

    const match = results.find(r => r.name.includes(store));
    if (match) {
      res.json({ store, keyword, rank: match.rank });
    } else {
      res.json({ store, keyword, rank: null });
    }
  } catch (e) {
    res.status(500).json({ error: "크롤링 실패", details: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
