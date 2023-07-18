import { ethers } from "ethers";
import nftAbi from "@/constants/BasicNft.json";
import nftMarketplaceAbi from "@/constants/NftMarketplace.json";
import networkMapping from "@/constants/networkMapping.json";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import Moralis from "moralis";
import { toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
  tokenId: number;
  nftAddress: string;
  price: number;
};

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sell/")({
  component: Sell,
});

export default function Sell() {
  const { address: account, chainId, isConnected } = useAccount();

  const chainString = chainId ? (chainId.toString() as "11155111") : "11155111";
  const marketplaceAddress = networkMapping[chainString]?.NftMarketplace[0];
  const basicNftAddress = networkMapping[chainString]?.BasicNft[0];
  const [proceeds, setProceeds] = useState("0");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => approveAndList(data);

  async function approveAndList(data: any) {
    console.log("Approving...");
    try {
      const nftAddress = data.nftAddress;
      const tokenId = data.tokenId;
      const price = ethers.parseUnits(data.price.toString());
      console.log("price", price);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      console.log("basicNftAddress", basicNftAddress);
      console.log("marketplaceAddress", marketplaceAddress);
      const nftContract: any = new ethers.Contract(basicNftAddress, nftAbi, signer);
      const to = marketplaceAddress;

      const txApprove = await nftContract.approve(marketplaceAddress, tokenId);
      await txApprove.wait();
      const nftMarketplaceContract: any = new ethers.Contract(marketplaceAddress, nftMarketplaceAbi, signer);
      await nftMarketplaceContract.listItem(nftAddress, tokenId, price);

      toast("Item listed successfully!");
    } catch (error) {
      console.log(error);
    }
  }

  async function setupUI() {
    // const returnedProceeds = await Moralis.EvmApi.utils.runContractFunction({
    //   abi: nftMarketplaceAbi,
    //   address: marketplaceAddress,
    //   functionName: "getProceeds",
    //   params: {
    //     seller: account,
    //   },
    // });
    // if (returnedProceeds) {
    //   setProceeds(returnedProceeds.toString());
    // }
  }

  useEffect(() => {
    if (isConnected) {
      setupUI();
    }
  }, [proceeds, account, isConnected, chainId]);

  return (
    <div className="px-3 container mx-auto flex flex-col items-center">
      <h2 className="text-xl mt-3 mb-1">Sell your NFT</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <input
          type="text"
          maxLength={42}
          defaultValue=""
          {...register("nftAddress")}
          placeholder="Minted Nft address"
          className="input input-bordered w-[300px] flex items-center gap-2"
        />
        <input
          type="number"
          max={9999}
          min={0}
          defaultValue=""
          {...register("tokenId")}
          placeholder="Token id"
          className="input w-[300px] input-bordered flex items-center gap-2"
        />
        <input
          type="text"
          defaultValue=""
          {...register("price")}
          placeholder="Price (in ETH)"
          className="input w-[300px] input-bordered flex items-center gap-2"
        />
        <button type="submit" className="btn  text-lg font-medium h-[20px]">
          List NFT
        </button>
      </form>

      {/* <div className="mt-5">Withdraw {proceeds} proceeds</div>
      {proceeds != "0" ? (
        <button
          type="submit"
          className="btn"
          onClick={async () => {
            await Moralis.EvmApi.utils.runContractFunction({
              abi: nftMarketplaceAbi,
              address: marketplaceAddress,
              functionName: "withdrawProceeds",
              params: {},
            });
          }}
        />
      ) : (
        <div>No proceeds detected</div>
      )} */}
    </div>
  );
}
