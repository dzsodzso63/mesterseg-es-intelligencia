// Links component:
// to show links

// Path: src/Links.tsx

import React from "react";
import "./Links.css";

const Links = ({ links }: { links: string[] }) => {
  return (
    <div className="links">
      {/* <textarea
        value={linkPrompt}
        onChange={(e) => setLinkPrompt(e.target.value)}
        placeholder={"Írja be a kérdését..."}
        style={{ width: 500, height: 200 }}
      /> */}
      {links.length > 0 && <header>Link ajánló</header>}
      {links.map((link, i) => (
        <div key={i} className={`link`}>
          <a href={link} target="_blank" rel="noreferrer" className="link">
            {link}
          </a>
        </div>
      ))}
      {links.length > 0 && (
        <iframe src={links[0]} title="listaoldal" className="listaoldal" />
      )}
    </div>
  );
};

export default Links;
