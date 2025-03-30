import express from "express";
import shortid from "shortid";
const app = express();

app.use(express.json());

const urlDatabase = {}; // Lưu trữ các shortUrl và original_url

// POST: /api/shorturl
app.post("/api/shorturl", (req, res) => {
  const { url } = req.body;

  // Kiểm tra tính hợp lệ của URL
  const regex = /^(https?:\/\/)(www\.)?[\w-]+\.[a-z]{2,6}(\.[a-z]{2,})?$/i;

  if (!regex.test(url)) {
    return res.status(400).json({ error: "invalid url" });
  }

  // Tạo short URL mới
  const shortUrl = shortid.generate();

  // Lưu shortUrl vào map (urlDatabase)
  urlDatabase[shortUrl] = url;

  // Trả về JSON chứa original_url và short_url
  return res.status(201).json({
    original_url: url,
    short_url: shortUrl,
  });
});

// GET: /api/shorturl/:short_url
app.get("/api/shorturl/:short_url", (req, res) => {
  const { short_url } = req.params;

  // Kiểm tra xem short_url có tồn tại trong map không
  if (!urlDatabase[short_url]) {
    return res.status(404).json({ error: "invalid url" });
  }

  // Lấy original_url từ map và thực hiện redirect
  const originalUrl = urlDatabase[short_url];
  return res.redirect(originalUrl); // Chuyển hướng đến original URL
});

// Endpoint để xuất toàn bộ dữ liệu của urlDatabase
app.get("/api/urls", (req, res) => {
  // Trả về toàn bộ dữ liệu của urlDatabase
  return res.status(200).json(urlDatabase);
});

// Chạy server trên cổng 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app; // Xuất mặc định
