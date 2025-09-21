import express from "express";
import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/rank", async (req, res) => {
  const { store, keyword } = req.query;

  if (!store || !keyword) {
    return res.status(400).json({ error: "store와 keyword는 필수입니다." });
  }

  try {
    // ✅ Vercel 환경용 Puppeteer 실행
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath:
        process.env.AWS_EXECUTION_ENV ? await chromium.executablePath : undefined,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    const searchURL = `https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=${encodeURIComponent(
      keyword
    )}`;

    await page.goto(searchURL, { waitUntil: "domcontentloaded" });

    // ✅ 네이버 플레이스 선택자
    const places = await page.$$eval(
      ".place_section_content .place_bluelink",
      (elements) => elements.map((el) => el.textContent.trim())
    );

    await browser.close();

    // 순위 찾기
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
