import React, { useEffect, useState } from "react";
import "./App.css";
import client from "./client";
import Chat, { ChatMessages } from "./Chat";
import Links from "./Links";
import { usePostHog } from "posthog-js/react";
import ReactStars from "react-rating-stars-component";

function createSlug(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD") // Az 'NFD' az "Normalized Form Decomposed"-re utal, ami szétválasztja az ékezetes karaktereket az alapjukká és az ékezetükre.
    .replace(/[\u0300-\u036f]/g, "") // Ez eltávolítja az ékezeteket.
    .replace(/\s+/g, "-") // Ez cseréli le a szóközöket kötőjelekre.
    .replace(/[^a-z0-9-]/g, "") // Ez eltávolítja az összes olyan karaktert, amely nem alfanumerikus és nem kötőjel.
    .replace(/^-+|-+$/g, ""); // Ez eltávolítja a kötőjeleket a szöveg elejéről és végéről.
}

function App() {
  const [chat, setChat] = useState<ChatMessages>([
    {
      role: "bot",
      text: "Üdvözöllek a Jószakin. Miben segíthetek?",
    },
  ]);
  const [links, setLinks] = useState<string[]>([]);
  const [text, setText] = useState("");
  const postHog = usePostHog();

  const sendScore = (score: number) => {
    if (postHog) {
      postHog.capture("ChatGptPage review", { score, chat });
    }
  };

  useEffect(() => {
    if (postHog) {
      postHog.capture("ChatGptPage pageview");
    }
  }, [postHog]);

  const sendMessage = async () => {
    if (!text) {
      return;
    }
    const newChat: ChatMessages = [...chat, { role: "user", text }];
    setChat(newChat);
    setText("");
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);

    const response = await client
      .service("chat")
      .create({ chat: newChat, model: params.get("model") || undefined });
    console.log("response", response);
    setChat((chat) => [...newChat, response.chatMessage]);
    if (response.linkSuggestions?.szakmalista) {
      setLinks(
        response.linkSuggestions.szakmalista.map(
          (profession: string) =>
            `https://joszaki.hu/szakemberek/${createSlug(profession)}/${
              response.linkSuggestions.Varosok.length
                ? createSlug(response.linkSuggestions.Varosok[0])
                : ""
            }`
        )
      );
    }
  };

  return (
    // <SocketContext.Provider value={{}}>
    <div className="App">
      <header className="App-header">
        <div>
          <img
            className="App-logo"
            width="113"
            height="28"
            alt="JóSzaki"
            src="https://joszaki.hu/_nuxt/img/joszaki-logo.fb09721.svg"
          />
          <h2>Mesterség és Intelligencia</h2>
        </div>
      </header>
      <div className="App-main">
        <div className="App-chat">
          <Chat chat={chat} hasLinks={!!links?.length} />
          <section className="content">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={"Írja be a kérdését..."}
            />
            <button onClick={sendMessage}>Küldés</button>
          </section>
          <div className="App-chat-review">
            Értékeld a Jószaki mesterséges intelligencia tanácsadót:
            <ReactStars
              count={5}
              onChange={sendScore}
              size={24}
              activeColor="#ffd700"
              className="stars"
            />
          </div>
        </div>
        <Links links={links} />
      </div>
    </div>
    // </SocketContext.Provider>
  );
}

export default App;
