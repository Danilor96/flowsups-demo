import { Loader } from '&/miscellaneous/loader/Loader';
import { HTMLAttributes } from 'react';
import { ConfirmNotification } from '../notifications/Notification';

export function ModalContent({
  children,
  height,
  overflowY,
  flexbox,
  flexRow,
  flexCol,
  gap,
  widthFull,
  justify,
  alignItems,
  overflowVisible,
  minHeight,
  loading,
  positionStatic,
  decisionMessage,
  loadingConfirmation,
  props,
  paddingLeft,
  paddingTop,
  paddingRight,
  paddingBottom,
  onDecision,
}: {
  children: React.ReactNode;
  height?: number;
  overflowY?: boolean;
  overflowVisible?: boolean;
  flexbox?: boolean;
  flexRow?: boolean;
  flexCol?: boolean;
  gap?: number;
  widthFull?: boolean;
  justify?: string;
  alignItems?: string;
  loading?: boolean;
  minHeight?: number;
  positionStatic?: boolean;
  decisionMessage?: string;
  loadingConfirmation?: boolean;
  paddingLeft?: number;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  onDecision?: (decision: boolean) => void;
  props?: HTMLAttributes<HTMLDivElement>;
}) {
  return (
    <div
      className="px-[1.927083vw] py-[3.240741vh]"
      style={{
        position: positionStatic ? 'static' : 'relative',
        height: `${height ? `${height}vh` : 'fit-content'}`,
        overflowY: `${overflowY ? 'scroll' : overflowVisible ? 'visible' : 'hidden'}`,
        display: `${flexbox && 'flex'}`,
        flexDirection: flexRow ? 'row' : flexCol ? 'column' : 'initial',
        gap: `${flexRow ? `${gap}vw` : flexCol ? `${gap}vh` : ''}`,
        width: widthFull ? '100%' : '',
        justifyContent: justify,
        alignItems: alignItems,
        minHeight: minHeight && `${minHeight}vh`,
        paddingRight: paddingRight ? `${paddingRight}vw` : '',
        paddingLeft: paddingLeft ? `${paddingLeft}vw` : '',
        paddingTop: paddingTop ? `${paddingTop}vh` : '',
        paddingBottom: paddingBottom ? `${paddingBottom}vh` : '',
      }}
      {...props}
    >
      {loading && (
        <Loader
          zIndex={100}
          props={{
            style: {
              // width: '100%',
              // height: '100%',
              // borderRadius: '0.5vw',
              // position: 'static',
            },
          }}
        />
      )}
      {children}
      {/* {loading ? (
        <Loader
          props={{
            style: {
              // width: '100%',
              // height: '100%',
              // borderRadius: '0.5vw',
              // position: 'static',
            },
          }}
        />
      ) : (
        children
      )} */}
      {decisionMessage && onDecision && (
        <ConfirmNotification
          notiMessage={decisionMessage}
          onDecision={onDecision}
          loading={loadingConfirmation}
        />
      )}
    </div>
  );
}
