import { ethers } from "ethers";
import { useAccount, useBalance, useDisconnect } from "wagmi";

export function Account() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  const { data, isError, isLoading } = useBalance({
    address: "0xA0Cf798816D4b9b9866b5330EEa46a18382f251e",
  });
  console.log(data);
  return (
    <div className="flex items-center gap-2">
      {address && (
        <div>
          {data
            ? `${Number(ethers.formatEther(data.value.toString())).toFixed(5)} (${address})`
            : address.slice(0, 4) + "..." + address.slice(address.length - 4, address.length)}
        </div>
      )}
      <button onClick={() => disconnect()} className="bg-slate-300/30 px-4 py-1.5 rounded-3xl">
        Disconnect
      </button>
    </div>
  );
}
