import "./App.css";
import ListNFTs from "./components/listNFTs";
import { Header } from "./components/header";
import Providers from "./providers";
import Moralis from "moralis";

Moralis.start({ apiKey: import.meta.env.VITE_MORALIS_API_KEY });

function App() {
  return (
    <Providers initialState={{} as any}>
      <Header />
      <ListNFTs />
    </Providers>
  );
}

export default App;
