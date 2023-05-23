// component to show chat messages
// Path: src/Chat.tsx

import React, { useEffect } from "react";
import "./Chat.css";

export type ChatMessages = {
  role: "user" | "bot";
  text: string;
}[];

const Chat = ({
  chat,
  hasLinks,
}: {
  chat: ChatMessages;
  hasLinks: boolean;
}) => {
  useEffect(() => {
    const element = document.querySelector(".chat");
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }, [chat]);
  return (
    <section className="chat">
      {chat.map((message, i) => (
        <div key={i} className={`message ${message.role}`}>
          {message.text}
        </div>
      ))}
      {chat[chat.length - 1].role === "user" && (
        <div className={`message bot waiting`} />
      )}
      {hasLinks && (
        <div className="calltoaction">
          Kérj konkrét ajánlatot a jobb oldalon felsorolt megbízható szakiktól.
          Akár többtől is!
        </div>
      )}
    </section>
  );
};

export default Chat;
