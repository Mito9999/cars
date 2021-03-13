import puppeteer from "puppeteer";
import express from "express";

const app = express();

const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);

    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const month = date.getMonth();
    const day = date.getDay();
    const year = date.getFullYear();

    return `${hours}:${minutes} ${month}/${day}/${year}`;
  } catch {
    console.log("Invalid Date passed to formatDate()");
    return dateString;
  }
};

app.get("/:location", async (req, res) => {
  const browser = await puppeteer.launch();
  try {
    const { location } = req.params || "sfbay";
    const page = await browser.newPage();

    await page.goto(
      `https://${location}.craigslist.org/d/cars-trucks-by-owner/search/cto`
    );

    try {
      const posts = await page.evaluate(() => {
        let elements = Array.from(document.querySelectorAll(".rows > *"));
        return elements.map((post) => ({
          url: post.children[0].href,
          date: post.children[1].children[1].attributes.datetime.value,
          title: post.children[1].children[2].children[0].innerText,
          price: post.children[1].children[3].children[0].innerText,
        }));
      });
      res.json({
        message: "Successfully retrieved posts",
        posts,
      });
    } catch {
      res.status(404).json({
        message: "Failed to evaluate posts",
        posts: [],
      });
    }
  } catch {
    res.status(500).json({
      message: "An unknown server error occured",
      posts: [],
    });
  }

  await browser.close();
});

app.listen(2000, () => console.log(`http://localhost:2000/`));
