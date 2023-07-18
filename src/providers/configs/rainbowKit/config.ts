import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, sepolia, hardhat } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "doge-next-marketplace",
  projectId: "0b160aa7a1d0bfdfe31c86cebf36712c",
  chains: [mainnet, sepolia, hardhat],
  ssr: true,
});
