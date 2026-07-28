// Polyfill for crypto.randomUUID for browser extension compatibility
// Some extensions (password managers, Grammarly, etc.) rely on crypto.randomUUID()
// which is only available in secure contexts (HTTPS/localhost).
// This polyfill ensures it works even in non-secure contexts.
if (typeof crypto !== "undefined" && !crypto.randomUUID) {
  crypto.randomUUID = function () {
    // Generate a UUID v4 using crypto.getRandomValues
    const hex = Array.from(crypto.getRandomValues(new Uint8Array(16)), (byte: number) =>
      byte.toString(16).padStart(2, "0")
    );
    // Insert UUID format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
    hex[6] = ((parseInt(hex[6], 16) & 0x0f) | 0x40).toString(16);
    hex[8] = ((parseInt(hex[8], 16) & 0x3f) | 0x80).toString(16);
    return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex.slice(6, 8).join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10).join("")}`;
  };
}

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
