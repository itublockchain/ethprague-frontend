import { PATHS } from "constants/paths";
import { useInitialTheme, useRightStarknetNetwork } from "hooks";
import { Home, Swap } from "pages";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const Main = () => {
  useRightStarknetNetwork();
  useInitialTheme();
  return null;
};

function App() {
  return (
    <BrowserRouter>
      <Main />
      <Routes>
        <Route path={PATHS.home} element={<Home />} />
        <Route path={PATHS.swap} element={<Swap />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
