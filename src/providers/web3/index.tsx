import { ethers } from "ethers";
import { createContext, useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";

import nftMarketplaceAbi from "../../constants/NftMarketplace.json";
import nftAbi from "../../constants/BasicNft.json";
import networkMapping from "@/constants/networkMapping.json";

type TContext = {
  marketplaceContract: ethers.Contract | null;
  nftContract: ethers.Contract | null;
  // nftAddress: string | null;
  // marketplaceAddress: string | null;
};
const Web3Context = createContext<TContext>({
  marketplaceContract: null,
  nftContract: null,
});

const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  // const { chainId } = useAccount();
  const [marketplaceContract, setMarketplaceContract] = useState<ethers.Contract | null>(null);
  const [nftContract, setNftContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    console.log("mount");
    const initWeb3 = async () => {
      try {
        if (!window.ethereum) {
          throw new Error("Ethereum provider not found. Please install MetaMask.");
        }

        // const chainAddreses =
        //   chainId == 31337 || chainId == 11155111 ? networkMapping[chainId] : networkMapping[11155111];
        const { BasicNft, NftMarketplace } = networkMapping[11155111];
        const provider = new ethers.JsonRpcProvider(
          `https://mainnet.infura.io/v3/${import.meta.env.VITE_INFURA_PUBLIC_KEY}`
        );

        const marketplaceContract = new ethers.Contract(NftMarketplace[0], nftMarketplaceAbi, provider);
        const nftContract = new ethers.Contract(BasicNft[0], nftAbi, provider);

        setMarketplaceContract(marketplaceContract);
        setNftContract(nftContract);
      } catch (err) {
        console.log(err);
      }
    };
    initWeb3();
  }, []);

  return <Web3Context.Provider value={{ marketplaceContract, nftContract }}>{children}</Web3Context.Provider>;
};

export const useWeb3Context = () => useContext(Web3Context);

export default Web3Provider;
