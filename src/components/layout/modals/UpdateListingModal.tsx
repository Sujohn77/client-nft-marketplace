import { useState } from "react";
import { ethers } from "ethers";
import Moralis from "moralis";
import { toast } from "react-toastify";

import nftMarketplaceAbi from "@/constants/NftMarketplace.json";
import { useAccount } from "wagmi";
import networkMapping from "@/constants/networkMapping.json";

export interface UpdateListingModalProps {
  isVisible: boolean;
  onClose: () => void;
  marketplaceAddress: string;
  nftAddress: string;
  tokenId: string;
  imageURI: string | undefined;
  currentPrice: number | undefined;
}

export const UpdateListingModal = ({
  isVisible,
  onClose,
  // marketplaceAddress,
  nftAddress,
  tokenId,
  imageURI,
  currentPrice,
}: UpdateListingModalProps) => {
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isLoadingCancel, setIsLoadingCancel] = useState(false);
  const { chainId } = useAccount();
  const [priceToUpdateListingWith, setPriceToUpdateListingWith] = useState<string>("");

  const cancelListing = async () => {
    try {
      setIsLoadingCancel(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const nftMarketplaceAddress =
        chainId == 31337 || chainId == 11155111 ? networkMapping[chainId].NftMarketplace[0] : "";

      const contract: any = new ethers.Contract(nftMarketplaceAddress, nftMarketplaceAbi, signer);
      const newPrice = ethers.parseEther(priceToUpdateListingWith?.toString() || "0").toString();

      const tx = await contract.cancelListing(nftAddress, tokenId);

      await tx.wait(1);
      setIsLoadingCancel(false);
      toast("Listing canceled successfully");
      onClose && onClose();
    } catch (error) {
      console.log("Error while canceling nft: ", error);
    }
  };

  const updateListing = async () => {
    try {
      setIsLoadingUpdate(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const nftMarketplaceAddress =
        chainId == 31337 || chainId == 11155111 ? networkMapping[chainId].NftMarketplace[0] : "";

      const contract: any = new ethers.Contract(nftMarketplaceAddress, nftMarketplaceAbi, signer);
      const newPrice = ethers.parseEther(priceToUpdateListingWith?.toString() || "0").toString();

      const tx = await contract.updateListing(nftAddress, tokenId, newPrice);

      await tx.wait(1);
      setIsLoadingUpdate(false);
      toast("Listing updated successfully");
      onClose && onClose();
      setPriceToUpdateListingWith("0");
    } catch (error: any) {
      if (error.data) {
        try {
          const iface = new ethers.Interface(nftMarketplaceAbi);
          const decodedError = iface.parseError(error.data);
          decodedError && console.error("Decoded Error:", decodedError.name, decodedError.args);
        } catch (decodeErr) {
          console.error("Unable to decode error:", decodeErr);
        }
      } else {
        console.error("Error:", error);
      }
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <>
      <input type="checkbox" id="my_modal_7" className="modal-toggle " hidden />
      <div className=" z-10 absolute top-[50%] right-[50%] translate-x-[50%] translate-y-[-50%]" role="dialog">
        <div
          className="modal-box rounded-3xl p-2 text-white bg-gray-500 shadow hover:shadow-lg w-[500px] relative"
          style={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose && onClose();
            }}
            className="before:content-['\00d7'] before:text-3xl inline-block absolute right-5 top-1"
          ></button>
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col items-center  gap-2 border-solid  rounded p-2 w-fit">
              <div className="text-center">Update NFT token price</div>
              {imageURI ? <img src={imageURI} height="200" width="200" /> : <div className="skeleton h-32 w-32"></div>}
              <div className="font-bold">Current price: {ethers.formatEther(currentPrice || 0)} ETH</div>
            </div>
            <input
              type="number"
              className="bg-transparent w-full max-w-xs outline-none p-1 rounded-lg text-white border border-solid border-gray-600"
              placeholder="Update listing price in L1 Currency (ETH)"
              name="New listing price"
              value={priceToUpdateListingWith}
              onChange={(event) => {
                setPriceToUpdateListingWith(event.target.value);
              }}
            />
            <div className="flex gap-2 items-center">
              <button className="btn border p-2 rounded-xl w-[120px]" onClick={updateListing}>
                {isLoadingUpdate ? <div className="loading loading-spinner text-primary" /> : "Submit"}
              </button>

              <button className="btn border  p-2 rounded-xl w-[120px]" onClick={cancelListing}>
                {isLoadingCancel ? <div className="loading loading-spinner text-primary" /> : "Cancel Listing"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
