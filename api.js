import puppeteer from "puppeteer";
import express from "express";

const app = express();

let allPosts = [];

app.get("/:location", async (req, res) => {
  const browser = await puppeteer.launch();
  try {
    const { location } = req.params || { location: "sfbay" };
    const pagination = req.query.pagination || 0;
    const page = await browser.newPage();

    await page.goto(
      `https://${location}.craigslist.org/d/cars-trucks-by-owner/search/cto?s=${pagination}`
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

      allPosts = [...allPosts, ...posts];

      res.json({
        message: "Successfully retrieved posts",
        posts: allPosts,
      });
    } catch {
      res.status(404).json({
        message: "Failed to evaluate posts",
        posts: allPosts,
      });
    }
  } catch {
    res.status(500).json({
      message: "An unknown server error occured",
      posts: allPosts,
    });
  }

  await browser.close();
});

app.listen(2000, () => console.log(`http://localhost:2000/`));
