import { type ReactNode, FC } from "react";

// import { config } from "./configs/wagmi/config";
import { type State, WagmiProvider } from "wagmi";
import { ToastContainer } from "react-toastify";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
// import "react-toastify/dist/ReactToastify.css";
// import "@rainbow-me/rainbowkit/styles.css";
import { config } from "./configs/rainbowKit/config";
import Web3Provider from "./web3";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

type Props = {
  children: ReactNode;
  initialState?: State | undefined;
};

const client = new QueryClient();
const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  uri: import.meta.env.VITE_PUBLIC_SUBGRAPH_URL,
});
const Providers: FC<Props> = ({ children, initialState = {} }) => {
  return (
    <Web3Provider>
      <WagmiProvider config={config}>
        <ApolloProvider client={apolloClient}>
          <QueryClientProvider client={client}>
            <RainbowKitProvider>{children} </RainbowKitProvider>
            <ToastContainer />
          </QueryClientProvider>
        </ApolloProvider>
      </WagmiProvider>
    </Web3Provider>
  );
};

export default Providers;
