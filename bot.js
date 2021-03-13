import dotenv from "dotenv";
dotenv.config();
import fetch from "node-fetch";
import { mockPosts } from "./devData.js";

import Discord from "discord.js";
const client = new Discord.Client();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

const timeoutIDs = [];
const data = { ...mockPosts };
const postsShown = [];
let i = 0;

client.on("message", async (msg) => {
  if (msg.content === "!cars") {
    // const res = await fetch("http://localhost:2000/sfbay");
    // const data = await res.json();

    const channel = client.channels.cache.get("820419455405260830");

    // not using .forEach index parameter due to conditional timeouts
    data.posts.forEach((post) => {
      if (!postsShown.includes(post)) {
        // `${post.price} - ${post.title} - ${post.date} - ${post.url}`
        const timeoutID = setTimeout(() => {
          const exampleEmbed = new Discord.MessageEmbed()
            .setColor("#0099ff")
            .setTitle(post.title)
            .setURL(post.url)
            .addFields({ name: "Price", value: post.price })
            .setTimestamp(new Date(post.date));

          channel.send(exampleEmbed);
          postsShown.push(post);
        }, 3000 * i);
        i++;
        timeoutIDs.push(timeoutID);
      }
    });
  } else if (msg.content === "!stop") {
    i = 0;
    timeoutIDs.forEach((id) => clearTimeout(id));
  }
});

client.login(process.env.DISCORD_TOKEN);
