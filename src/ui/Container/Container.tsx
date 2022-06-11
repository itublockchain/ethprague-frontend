import { ComponentPropsWithoutRef, ReactNode } from "react";
import { clsnm } from "utils/clsnm";
import styles from "./Container.module.scss";

interface ContainerProps extends ComponentPropsWithoutRef<"div"> {
  className?: string;
  children: ReactNode;
}

const Container = ({ children, className, ...props }: ContainerProps) => {
  return (
    <div className={clsnm(styles.container, className)} {...props}>
      {children}
    </div>
  );
};

export { Container };
