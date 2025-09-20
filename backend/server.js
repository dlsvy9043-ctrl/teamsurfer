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
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    const searchUrl = `https://search.naver.com/search.naver?where=nexearch&sm=top_hty&ie=utf8&query=${encodeURIComponent(
      keyword
    )}`;
    await page.goto(searchUrl, { waitUntil: "domcontentloaded" });

    // 광고 제외한 플레이스 정보 가져오기
    const places = await page.$$eval(".place_app_common .place_bluelink", els =>
      els.map(el => ({
        text: el.textContent.trim(),
      }))
    );

    await browser.close();

    // 매장명 포함 여부로 순위 검색 (띄어쓰기 무시)
    const normalizedStore = store.replace(/\s+/g, "");
    const index = places.findIndex(place =>
      place.text.replace(/\s+/g, "").includes(normalizedStore)
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
