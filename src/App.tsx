import { PATHS } from "constants/paths";
import { useInitialTheme, useRightStarknetNetwork, useTheme } from "hooks";
import { Home, Swap } from "pages";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Main = () => {
  useRightStarknetNetwork();
  useInitialTheme();
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
      </Routes>
      <ToastContainer pauseOnHover={false} theme={theme} />
    </BrowserRouter>
  );
}

export default App;
