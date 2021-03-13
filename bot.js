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

    // not using .forEach index parameter due to conditional timeouts
    data.posts.forEach((post) => {
      if (!postsShown.includes(post)) {
        const timeoutID = setTimeout(() => {
          msg.reply(
            `${post.price} - ${post.title} - ${post.date} - ${post.url}`
          );
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
