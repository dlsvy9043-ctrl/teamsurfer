import express from "express";
import puppeteer from "puppeteer";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/rank", async (req, res) => {
  const { store, keyword } = req.query;

  if (!store || !keyword) {
    return res.status(400).json({ error: "store와 keyword는 필수입니다." });
  }

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--single-process",
        "--disable-gpu",
      ],
    });

    const page = await browser.newPage();
    const searchUrl = `https://search.naver.com/search.naver?query=${encodeURIComponent(keyword)}`;

    await page.goto(searchUrl, { waitUntil: "domcontentloaded" });

    // 플레이스 영역에서 매장명 가져오기
    const places = await page.$$eval(
      ".place_section_content .place_bluelink",
      (elements) => elements.map((el) => el.textContent.trim())
    );

    await browser.close();

    const rank = places.findIndex((name) => name.includes(store)) + 1;

    if (rank > 0) {
      res.json({ store, keyword, rank });
    } else {
      res.json({ store, keyword, rank: null, message: "순위 없음" });
    }
  } catch (err) {
    console.error("크롤링 오류:", err);
    res.status(500).json({ error: "크롤링 실패", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
