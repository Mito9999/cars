import dotenv from "dotenv";
dotenv.config();
import fetch from "node-fetch";
import cron from "node-cron";
import { mockPosts } from "./devData.js";

import Discord from "discord.js";
const client = new Discord.Client();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);

  const data = { ...mockPosts };
  const postsShown = [];
  const channel = client.channels.cache.get("820419455405260830");
  let timeoutIDs = [];

  cron.schedule("*/15 * * * *", () => {
    timeoutIDs.forEach((id) => clearTimeout(id));
    timeoutIDs = [];

    let i = 0;
    data.posts.forEach((post) => {
      if (!postsShown.includes(post)) {
        const timeoutID = setTimeout(() => {
          const exampleEmbed = new Discord.MessageEmbed()
            .setColor("#0099ff")
            .setTitle(post.title)
            .setURL(post.url)
            .addFields({ name: "Price", value: post.price })
            .setImage(post.image)
            .setTimestamp(new Date(post.date));

          channel.send(exampleEmbed);

          postsShown.push(post);
        }, 3000 * i);

        i++;
        timeoutIDs.push(timeoutID);
      }
    });
  });
});

client.login(process.env.DISCORD_TOKEN);
