import dotenv from "dotenv";
dotenv.config();
import fetch from "node-fetch";
import { mockPosts } from "./devData.js";

import Discord from "discord.js";
const client = new Discord.Client();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", async (msg) => {
  if (msg.content === "!cars") {
    // const res = await fetch("http://localhost:2000/sfbay");
    // const data = await res.json();
    const data = mockPosts;
    data.posts.forEach((post, idx) => {
      setTimeout(() => {
        msg.reply(`${post.price} - ${post.title} - ${post.date} - ${post.url}`);
      }, 3000 * idx);
    });
  }
});

client.login(process.env.DISCORD_TOKEN);
