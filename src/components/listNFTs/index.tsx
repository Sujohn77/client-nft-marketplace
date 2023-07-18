import contractAddresses from "@/constants/networkMapping.json";

const NftMarketplaceAddress = (contractAddresses as any)[11155111]["NftMarketplace"][0];

import NFTBox from "../nftBox";

import { SERVER_URL } from "../../constants";
// import { useQuery } from "@tanstack/react-query";
import { GET_ACTIVE_ITEMS } from "@/graphql/activeItem";
import { useQuery } from "@apollo/client";

const ListNFTs = () => {
  const { error, data } = useQuery<{ activeItems: any[] }>(GET_ACTIVE_ITEMS);
  // const { data: nfts } = useQuery<any[]>({
  //   queryKey: ["nfts"],
  //   queryFn: async () => {
  //     const res = await fetch(SERVER_URL + "moralis/" + NftMarketplaceAddress);
  //     const data = await res.json();
  //     return data;
  //   },
  // });

  if (!data) {
    return null;
  }

  return (
    <div className="flex flex-wrap ">
      {data.activeItems.map((item: any, index: number) => {
        return <NFTBox key={`nft-${index}`} {...item} />;
      })}
    </div>
  );
};

export default ListNFTs;
