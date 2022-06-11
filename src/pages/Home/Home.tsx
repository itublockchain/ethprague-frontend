import { Navbar } from "components";
import styles from "./Home.module.scss";

const Home = () => {
  return (
    <div className={styles.wrapper}>
      <Navbar />
    </div>
  );
};

export { Home };
