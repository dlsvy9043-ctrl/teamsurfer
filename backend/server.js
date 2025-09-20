import express from "express";
import puppeteer from "puppeteer";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/rank", async (req, res) => {
  const { store, keyword } = req.query;

  if (!store || !keyword) {
    return res.status(400).json({ error: "store와 keyword가 필요합니다." });
  }

  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    const searchUrl = `https://search.naver.com/search.naver?sm=tab_hty.top&query=${encodeURIComponent(
      keyword
    )}`;
    await page.goto(searchUrl, { waitUntil: "domcontentloaded" });

    // ✅ 플레이스 상호명 가져오기
    const places = await page.$$eval(
      ".place_section_content .place_bluelink",
      (elements) => elements.map((el) => el.textContent.trim())
    );

    await browser.close();

    // ✅ 문자열 정규화 함수
    const normalize = (str) =>
      str.toLowerCase().replace(/\s+/g, "").replace(/\[.*?\]/g, "");

    const target = normalize(store);
    const normalizedPlaces = places.map(normalize);

    // ✅ 순위 찾기
    const rank =
      normalizedPlaces.findIndex(
        (name) => name.includes(target) || target.includes(name)
      ) + 1;

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
