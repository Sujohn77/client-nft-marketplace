import ConnectWallet from "../web3/connectButton";

type Props = {};
export const Header = ({}: Props) => {
  return (
    <nav className="p-5 border-b-2 flex justify-between items-center">
      <h1 className="text-2xl">NFT Marketplace</h1>
      <div className="flex justify-center items-center gap-3 mr-3">
        <a href="/">Nft marketplace</a>
        <a href="/sell">Sell page</a> |
        <ConnectWallet />
      </div>
    </nav>
  );
};
