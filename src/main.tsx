import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "react-toastify/dist/ReactToastify.css";
import "@rainbow-me/rainbowkit/styles.css";
import App from "./App.tsx";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import Moralis from "moralis";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import Providers from "./providers/index.tsx";
import "./index.css";
Moralis.start({ apiKey: import.meta.env.VITE_MORALIS_API_KEY });

const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  );
}
