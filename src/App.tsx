import { useConnection } from "ethylene/hooks";
import { useTheme } from "hooks/useTheme";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setTheme } from "store/slicers/theme";

function App() {
  const { connect } = useConnection();
  const { theme, toggleTheme } = useTheme();
  const dispatch = useDispatch();

  useEffect(() => {
    const localStorageTheme = localStorage.getItem("theme");
    if (localStorageTheme === "light") {
      dispatch(setTheme("light"));
      document.body.classList.remove("dark");
      document.body.classList.add("light");
    } else {
      dispatch(setTheme("dark"));
      document.body.classList.remove("light");
      document.body.classList.add("dark");
    }
  }, []);

  return (
    <div>
      <button style={{ color: `var(--text)` }} onClick={connect}>
        Connect Ethereum
      </button>
      <div>{theme}</div>
      <button onClick={toggleTheme}>toggle</button>
    </div>
  );
}

export default App;
