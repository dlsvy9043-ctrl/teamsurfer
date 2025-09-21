import express from "express";
import puppeteer from "puppeteer";

const app = express();
const PORT = process.env.PORT || 10000;

app.get("/rank", async (req, res) => {
  const { store, keyword } = req.query;
  if (!store || !keyword) {
    return res.status(400).json({ error: "store와 keyword는 필수입니다." });
  }

  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    const searchURL = `https://search.naver.com/search.naver?query=${encodeURIComponent(keyword)}`;
    await page.goto(searchURL, { waitUntil: "domcontentloaded" });

    // 매장 이름 추출 (네이버 플레이스 구조)
    const places = await page.$$eval(".place_section_content .place_bluelink",
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
