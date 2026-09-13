import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Le service worker est désactivé pour l'instant : en phase de mises à jour
// fréquentes, il servait une version mise en cache avant la nouvelle. On
// désinscrit toute installation précédente pour que chacun retrouve la
// dernière version immédiatement. On pourra le réactiver une fois le projet
// stabilisé (avec une meilleure stratégie de mise à jour).
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => registration.unregister());
  });
  if ("caches" in window) {
    caches.keys().then((names) => names.forEach((name) => caches.delete(name)));
  }
}
