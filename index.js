import express from "express"; // Use import instead of require
import cors from "cors";
import shortid from "shortid";

const app = express();

// Enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
app.use(cors({ optionsSuccessStatus: 200 })); // Some legacy browsers choke on 204

// Serve static files
app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Nếu muốn hỗ trợ form-urlencoded

// Your routes
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

const urlDatabase = {};

app.post("/api/shorturl", (req, res) => {
  console.log(`body:${0}`, req.body);
  const { url } = req.body;
  //http://www.example.com
  //var regex = /^\d{4}-\d{2}-\d{2}$/;
  //const regex = /^(https?:\/\/)(www\.)?[\w-]+\.[a-z]{2,6}(\.[a-z]{2})?$/i;
  const regex = /^(https:\/\/)(www\.)?[\w-]+\.[a-z]{2,6}(\.[a-z]{2,})?$/i;

  console.log(`url:${url}`);

  let valid = regex.test(url);
  console.log(`regex.test(url):${valid}`);

  if (!valid) {
    return res.status(400).json({ error: "invalid url" });
  }

  const shortUrl = shortid.generate();
  console.log(`shortUrl:${0}`, shortUrl);
  console.log(`originalUrl:${0}`, url);

  const response = {
    original_url: url,
    short_url: shortUrl,
  };
  //save key to map
  urlDatabase[shortUrl] = url;

  return res.status(201).json(response);
});

app.get("/api/shorturl/:short_url?", (req, res) => {
  console.log(`short_param:${0}`, req.params);

  let short_url = req.params.short_url;
  console.log(`short_url: ${short_url}`); //
  //const shortUrl = shortid.generate();
  if (!urlDatabase[short_url]) {
    //{ error: 'invalid url' }
    return res.status(404).json({ error: "invalid url" });
  }

  const originalUrl = urlDatabase[short_url];

  // console.log(`shortUrl:${short_url}`);
  // console.log(`originalUrl:${originalUrl}`);

  return res.redirect(originalUrl);
});

app.get("/api/whoami", function (req, res) {
  const ipaddress = req.ip || req.headers["x-forwarded-for"] || "IP not found";
  const language = req.headers["accept-language"] || "Language not found";
  const software = req.headers["user-agent"] || "Software not found";

  const response = {
    ipaddress,
    language,
    software,
  };

  res.json(response);
});

// Export the app
export default app;
