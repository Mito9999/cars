const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(
    "https://norfolk.craigslist.org/d/cars-trucks-by-owner/search/cto"
  );

  const posts = await page.evaluate(() => {
    let elements = Array.from(document.querySelectorAll(".rows > *"));
    return elements.map((post) => ({
      url: post.children[0].href,
      date: post.children[1].children[1].attributes.datetime.value,
      title: post.children[1].children[2].children[0].innerText,
      price: post.children[1].children[3].children[0].innerText,
    }));
  });

  console.log(posts);

  await browser.close();
})();
