import { useTheme } from "hooks";
import { ComponentPropsWithoutRef } from "react";
import { clsnm } from "utils/clsnm";
import styles from "./Button.module.scss";

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  color?: "blue" | "neutral" | "pink" | "ghost";
  textPosition?: "center" | "left" | "right";
  height?: string;
  width?: string;
  fullwidth?: boolean;
}

const Button = ({
  className,
  children,
  color = "blue",
  textPosition = "center",
  height,
  width,
  fullwidth,
  ...props
}: ButtonProps) => {
  const { theme } = useTheme();

  return (
    <button
      style={{ height: height, width: width ? width : undefined }}
      className={clsnm(
        styles.wrapper,
        styles[color],
        styles[textPosition],
        styles[theme],
        className
      )}
      {...props}
    >
      <span
        className={clsnm(
          styles.text,
          styles[color],
          styles[textPosition],
          fullwidth && styles["fullwidth"]
        )}
      >
        {children}
      </span>
    </button>
  );
};

export { Button };
