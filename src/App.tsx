import { PATHS } from "constants/paths";
import { useOnAccountsChange, useOnNetworkChange } from "ethylene/hooks";
import {
  useInitialTheme,
  useRightStarknetNetwork,
  useStarknetConnection,
  useTheme,
} from "hooks";
import { Home, Market, Swap } from "pages";
import { Profile } from "pages/Profile/Profile";
import { useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTypedSelector } from "store";

const Main = () => {
  useRightStarknetNetwork();
  useInitialTheme();

  const starknet = useTypedSelector((state) => state.starknet.starknet);

  console.log(starknet);

  const { connectStarknet } = useStarknetConnection();

  useOnAccountsChange(() => window.location.reload(), { interval: 1000 });
  useOnNetworkChange(() => window.location.reload());

  return null;
};

function App() {
  const { theme } = useTheme();

  return (
    <BrowserRouter>
      <Main />
      <Routes>
        <Route path={PATHS.home} element={<Home />} />
        <Route path={PATHS.swap} element={<Swap />} />
        <Route path={PATHS.market} element={<Market />} />
        <Route path={PATHS.profile} element={<Profile />} />
        <Route path="*" element={<div>Not found</div>} />
      </Routes>
      <ToastContainer pauseOnHover={false} theme={theme} />
    </BrowserRouter>
  );
}

export default App;
