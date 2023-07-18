import { useState, useEffect } from "react";

import nftAbi from "../../constants/BasicNft.json";

import nftMarketplaceAbi from "../../constants/NftMarketplace.json";
import networkMapping from "@/constants/networkMapping.json";
import { ethers } from "ethers";
// import UpdateListingModal from "./UpdateListingModal";
import contractAddresses from "@/constants/networkMapping.json";
import { useAccount } from "wagmi";
import { toast } from "react-toastify";
import Moralis from "moralis";
import { UpdateListingModal } from "../layout/modals/UpdateListingModal";
import { useWeb3Context } from "@/providers/web3";

export const truncateStr = (fullStr: string, strLen: number) => {
  if (fullStr.length <= strLen) return fullStr;

  const separator = "...";
  const seperatorLength = separator.length;
  const charsToShow = strLen - seperatorLength;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);
  return fullStr.substring(0, frontChars) + separator + fullStr.substring(fullStr.length - backChars);
};

export default function NFTBox({ price, nftAddress, tokenId, seller: ownerAddress }: any) {
  const [isModal, setIsModal] = useState(false);
  const { address, chainId } = useAccount();

  const [imageURI, setImageURI] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenDescription, setTokenDescription] = useState("");

  const isOwnedByUser = ownerAddress === address;
  const formattedownerAddressAddress = isOwnedByUser ? "you" : truncateStr(ownerAddress || "", 15);
  const nftMarketplaceAddress =
    chainId == 31337 || chainId == 11155111 ? contractAddresses[chainId]["NftMarketplace"][0] : "31337";

  const { nftContract, marketplaceContract } = useWeb3Context();

  const handleBuy = async () => {
    if (!marketplaceContract) return;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const adresses = networkMapping["11155111"]?.NftMarketplace;
      const nftMarketplaceAddress = adresses.length ? adresses[adresses.length - 1] : "";
      const contract: any = new ethers.Contract(nftMarketplaceAddress, nftMarketplaceAbi, signer);

      const transaction = await contract.buyItem(nftAddress, tokenId, { value: price });
      toast("Item bought!");
      console.log("Transaction successful:", transaction);
    } catch (error) {
      toast("Error while buying nft");
      console.error("Error purchasing item:", error);
    }
  };

  const getToken = async (tokenId: string) => {
    if (!nftContract) return;
    try {
      const data = await Moralis.EvmApi.nft.getContractNFTs({
        chain: Moralis.EvmUtils.EvmChain.SEPOLIA,
        address: nftAddress,
      });

      return data.raw.result.find((item) => item.token_id == tokenId);
    } catch (error) {
      console.log("Error while updating: ", error);
    }
  };

  const getTokenURI = async () => {
    if (!nftContract) return;
    try {
      const data = await Moralis.EvmApi.utils.runContractFunction({
        abi: nftAbi,
        chain: Moralis.EvmUtils.EvmChain.SEPOLIA,
        address: nftAddress,
        functionName: "tokenURI",
        params: {
          tokenId: tokenId,
        },
      });
      console.log(data.raw);
      return data.raw;
    } catch (error) {
      console.log("Error while updating: ", error);
    }
  };

  async function updateUI() {
    const tokenURI = await getTokenURI();

    if (tokenURI) {
      const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
      const tokenURIResponse = await (await fetch(requestURL)).json();
      const imageURI = tokenURIResponse.image;
      const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/");
      setImageURI(imageURIURL);
      setTokenName(tokenURIResponse.name);
      setTokenDescription(tokenURIResponse.description);
    }
  }

  // async function updateUI() {
  //   const token = await getToken(tokenId);

  //   if (token?.metadata) {
  //     const metadata = JSON.parse(token.metadata);

  //     setImageURI(metadata.image);
  //     setTokenName(metadata.name);
  //     setTokenDescription(metadata.description);
  //   }
  // }

  useEffect(() => {
    updateUI();
  }, []);

  const handleCardClick = () => {
    isOwnedByUser && setIsModal(true);
  };

  return (
    <div className="min-w-[300px] w-1/4 p-2 cursor-pointer" onClick={handleCardClick}>
      <UpdateListingModal
        currentPrice={price}
        imageURI={imageURI}
        isVisible={isModal}
        tokenId={tokenId}
        marketplaceAddress={nftMarketplaceAddress}
        nftAddress={nftAddress}
        onClose={() => {
          setIsModal(false);
        }}
      />
      <div className="flex flex-col items-center h-[400px] gap-2 relative bg-slate-400/25 rounded-2xl p-3">
        <div>#{tokenId}</div>
        <div>
          <span> {tokenName}</span>
          {tokenDescription && <span> - {tokenDescription}</span>}
        </div>
        <img alt="nft" src={imageURI} width="200" className="z-0 h-[200px]" />
        <div className="italic text-sm ">Owned by {formattedownerAddressAddress}</div>
        <div className="font-bold">{ethers.formatUnits(price, "ether")} ETH</div>
        {!isOwnedByUser && (
          <button
            onClick={handleBuy}
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Buy
          </button>
        )}
      </div>
    </div>
  );
}
