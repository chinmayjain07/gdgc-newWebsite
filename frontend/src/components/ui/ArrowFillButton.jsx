import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import "./ArrowFillButton.css";

export function ArrowFillButton({
  btnText = "Get Started",
  to,
  href,
  onClick,
  className = "",
  size = "md",
  bgColor = "#4285F4",
  textColor = "#ffffff",
  fillBgColor = "#ffffff",
  fillTextColor = "#1a73e8",
  hoverFillBgColor = "#ffffff",
  hoverFillTextColor = "#1a73e8",
  arrowColor = "#4285F4",
  hoverArrowColor = "#1a73e8",
  transparent = false,
  borderColor,
  ...props
}) {
  const [isPressed, setIsPressed] = useState(false);

  const classes = [
    "arrow-fill-btn",
    size === "sm" ? "arrow-fill-btn--sm" : "",
    transparent ? "arrow-fill-btn--transparent" : "",
    className,
  ].filter(Boolean).join(" ");

  const inlineStyles = {
    "--btn-bg": transparent ? "transparent" : bgColor,
    "--btn-text": transparent ? "inherit" : textColor,
    "--btn-fill-bg": fillBgColor,
    "--btn-fill-text": fillTextColor,
    "--btn-fill-bg-hover": hoverFillBgColor,
    "--btn-fill-text-hover": hoverFillTextColor,
    "--btn-arrow": arrowColor,
    "--btn-arrow-hover": hoverArrowColor,
    borderColor: borderColor || (transparent ? undefined : bgColor),
  };

  const innerContent = (
    <>
      <span className="arrow-fill-btn__text">{btnText}</span>
      <div aria-hidden="true" className="arrow-fill-btn__fill" />
      <div aria-hidden="true" className="arrow-fill-btn__overlay">
        <span className="arrow-fill-btn__overlay-text">{btnText}</span>
      </div>
      <span aria-hidden="true" className="arrow-fill-btn__icon">
        <ArrowRight className="arrow-fill-btn__arrow" strokeWidth={2.2} />
      </span>
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        className={classes}
        style={inlineStyles}
        data-pressed={isPressed ? "true" : "false"}
        onPointerDown={() => setIsPressed(true)}
        onPointerUp={() => setIsPressed(false)}
        onClick={onClick}
        {...props}
      >
        {innerContent}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        style={inlineStyles}
        data-pressed={isPressed ? "true" : "false"}
        onPointerDown={() => setIsPressed(true)}
        onPointerUp={() => setIsPressed(false)}
        onClick={onClick}
        {...props}
      >
        {innerContent}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      style={inlineStyles}
      data-pressed={isPressed ? "true" : "false"}
      onPointerDown={() => setIsPressed(true)}
      onPointerUp={() => setIsPressed(false)}
      onClick={onClick}
      {...props}
    >
      {innerContent}
    </button>
  );
}

export default ArrowFillButton;
