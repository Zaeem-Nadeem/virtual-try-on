import PropTypes from "prop-types";

const DynamicButton = ({
  key,
  text = "Click Me",
  paddingX,
  paddingY,
  Icon,
  iconPosition = "left",
  iconStyle = "stroke-2 w-5 h-5",
  showIcon = true,
  showText = true,
  onClick = () => {},
  styles = {},
  disabled = false,
}) => {
  return (
    <button
      key={key}
      onClick={onClick}
      disabled={disabled}
      className={`flex cursor-pointer items-center justify-center gap-2 
    ${paddingX || "px-4"} ${paddingY || "py-2"} rounded-lg transition-all 
    ${styles.base || "bg-blue-500 text-white"}
    ${disabled ? styles.disabled || "opacity-50 cursor-not-allowed" : ""}
    hover:${styles.hover || "bg-blue-600"}
    active:${styles.active || "bg-blue-700"}
    ${styles.outline ? `border ${styles.outline}` : ""}
  `}
    >
      {showIcon && iconPosition === "left" && Icon && <Icon className={iconStyle} />}
      {showText && <span>{text}</span>}
      {showIcon && iconPosition === "right" && Icon && <Icon className={iconStyle} />}
    </button>
  );
};

DynamicButton.propTypes = {
  key: PropTypes.number,
  text: PropTypes.string,
  Icon: PropTypes.elementType,
  iconPosition: PropTypes.oneOf(["left", "right"]),
  iconStyle: PropTypes.string,
  showIcon: PropTypes.bool,
  showText: PropTypes.bool,
  onClick: PropTypes.func,
  styles: PropTypes.shape({
    base: PropTypes.string,
    hover: PropTypes.string,
    active: PropTypes.string,
    outline: PropTypes.string,
  }),
  disabled: PropTypes.bool,
  paddingX: PropTypes.string,
  paddingY: PropTypes.string,
};

export default DynamicButton;
