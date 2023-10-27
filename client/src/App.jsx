import { useEffect, useState } from "react";
import { TextField, Button, Flex, Box, Heading } from "@radix-ui/themes";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { io } from "socket.io-client";

import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

const URL = "http://localhost:3000/";

const socket = io(URL, {
  transports: ["websocket"],
});

function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  useEffect(() => {
    socket.on(
      "connect",
      () => {
        console.log(`connect ${socket.id}`);

        socket.on("chat", ({ output, status }) => {
          console.log("status, output", status, output);
          setResponse(output);
        });

        socket.on("connect_error", (err) => {
          console.log(`connect_error due to ${err}`);
        });

        socket.on("disconnect", (reason) => {
          console.log(`disconnect due to ${reason}`);
        });
      },
      []
    );
  }, []);

  const onSubmit = () => {
    socket.emit("chat", {
      prompt: prompt,
    });
  };

  return (
    <Flex direction="column" gap="3">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <Heading>Local-first ChatGPT</Heading>

      <Flex align="center" justify="center" width="100%">
        <TextField.Root>
          <TextField.Input
            style={{
              width: "60vw",
            }}
            size="3"
            placeholder="Write your prompt…"
            onChange={(e) => setPrompt(e.target.value)}
          />
          <TextField.Slot>
            <Button onClick={onSubmit}>
              <PaperPlaneIcon />
              Submit
            </Button>
          </TextField.Slot>
        </TextField.Root>
      </Flex>

      <p>{response}</p>
    </Flex>
  );
}

export default App;
