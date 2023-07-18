"use client";

import { useAccount } from "wagmi";
import { Account } from "../account";
import { WalletOptions } from "../walletOptions";
import { useIsMounted } from "@/hooks/useIsMounted";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const ConnectWallet = () => {
  const { isConnected } = useAccount();

  // if (isConnected) return <Account />;
  return (
    <ConnectButton
      showBalance
      accountStatus={{
        smallScreen: "avatar",
        largeScreen: "full",
      }}
    />
  );
};

export default ConnectWallet;
