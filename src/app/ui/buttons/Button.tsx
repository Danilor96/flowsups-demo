import { motion } from 'framer-motion';
import { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // Añadimos una prop para las props de interacción de Floating UI
  otherProps?: { [key: string]: any }; 
  buttonIcon?: React.ReactNode;
  ref?: any;
  positionFixed?: boolean;
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  width?: number;
  height?: number;
  backgroundColor: string;
  textColor: string;
  buttonText?: string;
  buttonTextSize?: number;
  iconTextGap?: number;
  positionAbsolute?: boolean;
  iconRight?: boolean;
  iconAbove?: boolean;
  border?: number;
  borderColor?: string;
  identity: string;
  fontWeight?: number;
  verticalCenter?: boolean;
  value?: string | number;
  borderRadius?: number;
  disabled?: boolean;
  iconTextSpaceBetween?: boolean;
  widthFitContent?: boolean;
  heightFitContent?: boolean;
  marginInlineAuto?: boolean;
  heightVw?: boolean;
  dropShadow?: boolean;
  gridColumn?: number;
  name?: string;
  lineHeight?: number;
  disabledSameColor?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ buttonIcon, otherProps, 
      width,
  height,
  backgroundColor,
  textColor,
  buttonText,
  buttonTextSize,
  iconTextGap,
  iconRight,
  iconAbove,
  border,
  borderColor,
  verticalCenter,
  identity,
  value,
  borderRadius,
  positionFixed,
  bottom,
  left,
  right,
  top,
  disabled,
  fontWeight,
  iconTextSpaceBetween,
  positionAbsolute,
  widthFitContent,
  heightFitContent,
  marginInlineAuto,
  heightVw,
  gridColumn,
  dropShadow,
  lineHeight,
  name,
  disabledSameColor,
  onClick,
  }, ref) => {
      return (
    <motion.button
      ref={ref}
      name={name}
      whileHover={!disabled ? { scale: 1.1 } : undefined}
      whileTap={!disabled ? { scale: 0.9 } : undefined}
      className={`flex items-center px-[0.5vw] transition-colors ease-in-out outline-none leading-none !max-lg:min-w-[5rem] max-lg:min-h-9 !max-lg:text-sm max-lg:px-3 ${
        dropShadow && 'shadow-crmFormShadow'
      }`}
      style={{
        width: widthFitContent
          ? 'fit-content'
          : width === 0
          ? '100%'
          : width
          ? `${width}vw`
          : '6.25vw',
        height: heightFitContent
          ? 'fit-content'
          : height
          ? heightVw
            ? `${height}vw`
            : `${height}vh`
          : '5.277778vh',
        backgroundColor: !disabled
          ? `${backgroundColor}`
          : disabledSameColor
          ? `${backgroundColor}`
          : `${backgroundColor}50`,
        borderRadius: borderRadius ? `${borderRadius}vw` : '0.653646vw',
        color: `${textColor}`,
        borderWidth: `${border}vw`,
        borderColor: `${borderColor}`,
        gap: `${iconTextGap}vw`,
        justifyContent: iconTextSpaceBetween ? 'space-between' : 'center',
        fontWeight: fontWeight ? fontWeight : 600,
        flexDirection: `${iconRight ? 'row-reverse' : iconAbove ? 'column' : 'row'}`,
        fontSize: `${buttonTextSize ? `${buttonTextSize}vh` : '1.626852vh'}`,
        marginTop: verticalCenter ? 'auto' : '',
        marginBottom: verticalCenter ? 'auto' : '',
        position: positionFixed ? 'fixed' : positionAbsolute ? 'absolute' : 'static',
        top: `${top}vh`,
        right: `${right}vw`,
        bottom: `${bottom}vh`,
        left: `${left}vw`,
        marginInline: marginInlineAuto ? 'auto' : '',
        gridColumn: gridColumn ? `span ${gridColumn}` : 'auto',
      }}
      data-identity={identity}
      value={value}
      onClick={onClick ? onClick : undefined}
      disabled={disabled}
      {...otherProps}
    >
      {buttonIcon}
      <p
        style={{
          lineHeight: lineHeight ? `${lineHeight}rem` : '',
        }}
      >
        {buttonText}
      </p>
    </motion.button>
  );
  }
)

Button.displayName = 'Button';