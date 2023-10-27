import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { pipe } from "./gpt.js";

const app = express();
const server = createServer(app);
const io = new Server(server);

const GPT = async (prompt, options) =>
  await pipe(prompt, {
    max_new_tokens: 256,
    ...options,
  });

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("chat", async ({ prompt }) => {
    console.log("receiving prompt", prompt);

    // const output = await GPT(prompt);

    // socket.emit("chat", {
    //   output: output,
    //   status: "update",
    // });

    GPT(prompt, {
      max_new_tokens: 256,
      callback_function: (x) => {
        const output = pipe.tokenizer.decode(x[0].output_token_ids, {
          skip_special_tokens: true,
        });

        socket.emit("chat", {
          output: output,
          status: "update",
        });

        console.log("sub out", output);
      },
    });
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
