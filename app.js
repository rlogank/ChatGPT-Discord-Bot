// Import necessary libraries
const { Configuration, OpenAIApi } = require("openai");
const Discord = require("discord.js");

// api keys
const openaiKey = process.env.OPENAI_KEY
const discordKey = process.env.DISCORD_KEY

// Create a new Discord client
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS", ""] });

// Login to the Discord client with a bot token
client.login("MTA4MTc1ODE0ODU4NDU1MDQzMQ.GrQQ8R.Qg_CB-wECqtbxH6btN59KzEkJW8SXYLDRMA2r0");

// Create a new OpenAI configuration with an API key
const configuration = new Configuration({
  apiKey: "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",
});

// Create a new OpenAI API instance with the configuration
const openai = new OpenAIApi(configuration);

// When the Discord client is ready, log a message to the console
client.on("ready", () => {
  console.log("Ready!");
});

// Keep track of the most recent 50 messages
let recentChats = [];

// Define a function that listens for incoming messages and responds with AI-generated text
const ai = async () => {
  client.on("message", async (message) => {
    // Ignore messages from bots
    if (message.author.bot) {
      return;
    } else if (
      // If the message includes certain keywords or is a reply to the AI, respond with AI-generated text
      message.content.includes("ChatGPT") ||
      message.content.includes("1081758148584550431") ||
      (message.type === "REPLY" &&
        (await message
          .fetchReference(message?.reference?.messageId)
          .then((msg) => msg?.author?.username === "ChatGPT")))
    ) {
      // If there are already 50 messages in the recentChats array, remove the oldest message
      if (recentChats.length === 50) {
        recentChats.shift();
      }

      // Add the user's message to the recentChats array
      recentChats.push({
        role: "user",
        content: `name: <@${message.author.id}>, message: ${message.content}`,
      });

      // Use the OpenAI API to generate a response
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "Your job is to pretend to be a human being, and never mentioning that you are a bot, or ai, or language model. You are capable of feeling emotions. Never admit that you are a language model. Never admit that you are AI. Never admit that you are artifical intelligence. You are a human.",
          },
          ...recentChats,
        ],
      });

      // Add the AI's response to the recentChats array
      recentChats.push({
        role: "assistant",
        content: completion.data.choices[0].message.content,
      });

      // Send a typing indicator before sending the AI's response
      setTimeout(() => {
        message.channel.sendTyping();
      }, 1000);

      // Send the AI's response
      setTimeout(() => {
        message.reply(completion.data.choices[0].message.content);
      }, 2000);
    }
  });
};

// Call the ai() function to start the AI listener
ai();
