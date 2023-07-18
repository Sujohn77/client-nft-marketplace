import ListNFTs from "@/components/listNFTs";
import React from "react";

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return <ListNFTs />;
}
