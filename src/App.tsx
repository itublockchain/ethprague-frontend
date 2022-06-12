import { PATHS } from "constants/paths";
import { useOnAccountsChange, useOnNetworkChange } from "ethylene/hooks";
import { useInitialTheme, useRightStarknetNetwork, useTheme } from "hooks";
import { Home, Market, Swap } from "pages";
import { Profile } from "pages/Profile/Profile";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Main = () => {
  useRightStarknetNetwork();
  useInitialTheme();
  useOnAccountsChange(() => window.location.reload(), { interval: 1000 });
  useOnNetworkChange(() => window.location.reload());
  return null;
};

function App() {
  const { theme } = useTheme();

  return (
    <>
      <Main />
      <BrowserRouter>
        <Routes>
          <Route path={PATHS.home} element={<Home />} />
          <Route path={PATHS.swap} element={<Swap />} />
          <Route path={PATHS.market} element={<Market />} />
          <Route path={PATHS.profile} element={<Profile />} />
          <Route path="*" element={<div>Not found</div>} />
        </Routes>
        <ToastContainer pauseOnHover={false} theme={theme} />
      </BrowserRouter>
    </>
  );
}

export default App;
