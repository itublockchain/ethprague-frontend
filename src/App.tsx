import { useConnection } from "ethylene/hooks";

function App() {
  const { connect } = useConnection();

  return (
    <div>
      <button onClick={connect}>Connect Ethereum</button>
    </div>
  );
}

export default App;
