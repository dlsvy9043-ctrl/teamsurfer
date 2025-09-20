import express from "express";
import puppeteer from "puppeteer";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/rank", async (req, res) => {
  const { store, keyword } = req.query;

  if (!store || !keyword) {
    return res.status(400).json({ error: "store와 keyword를 입력하세요." });
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
    "--disable-gpu"
  ]
});
    const page = await browser.newPage();

    const searchUrl = `https://search.naver.com/search.naver?where=nexearch&sm=top_hty&ie=utf8&query=${encodeURIComponent(
      keyword
    )}`;
    await page.goto(searchUrl, { waitUntil: "domcontentloaded" });

    // 플레이스 상호명 가져오기 (광고 제외)
    const places = await page.$$eval(
      ".place_section_content .place_bluelink",
      els => els.map(el => el.textContent.trim())
    );

    await browser.close();

    // 공백 제거 후 비교 (포함 여부)
    const normalizedStore = store.replace(/\s+/g, "");
    const index = places.findIndex(text =>
      text.replace(/\s+/g, "").includes(normalizedStore)
    );

    if (index !== -1) {
      return res.json({ store, keyword, rank: index + 1 });
    } else {
      return res.json({ store, keyword, rank: null });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "크롤링 실패", details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
