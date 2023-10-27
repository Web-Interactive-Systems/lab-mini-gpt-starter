import express from "express";
import { createServer } from "node:http";
import { join } from "node:path";
import { Server } from "socket.io";
import { Pipeline } from "./gpt.js";

const app = express();
const server = createServer(app);
const io = new Server(server);

let pipe = await Pipeline.getInstance((x) => {
  //   console.log("Pipeline ... ", x);
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("chat", async ({ prompt }) => {
    console.log("receiving prompt", prompt);

    pipe(prompt, {
      max_new_tokens: 256,
      callback_function: (x) => {
        const output = pipe.tokenizer.decode(x[0].output_token_ids, {
          skip_special_tokens: true,
        });

        console.log("sub out", output);

        socket.emit("chat", {
          output: output,
          status: "update",
        });
      },
    });
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
