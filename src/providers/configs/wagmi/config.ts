import { http, createConfig, createStorage, cookieStorage } from "wagmi";
import { mainnet, sepolia, hardhat } from "wagmi/chains";

export const config = createConfig({
  chains: [mainnet, sepolia],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [hardhat.id]: http(),
  },
});
