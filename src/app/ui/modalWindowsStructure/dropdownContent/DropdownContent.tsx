import React, { useState } from 'react';
import { Header } from './header/Header';
import { Content } from './content/Content';
import { AnimatePresence } from 'framer-motion';

export function DropdownContent({
  children,
  title,
  height,
  itemsCenter,
  buttonComponent,
  overflowVisible,
  overflowScroll,
  loading,
}: {
  children: React.ReactNode;
  title: string;
  height?: number;
  itemsCenter?: boolean;
  buttonComponent?: React.ReactNode;
  overflowVisible?: boolean;
  overflowScroll?: boolean;
  loading?: boolean;
}) {
  // ----- global states -----

  // ----- local states -----

  const [showContent, setShowContent] = useState(false);

  const handleShowContent = (e: React.MouseEvent<HTMLElement>) => {
    setShowContent(!showContent);
  };

  return (
    <div className="overflow-visible">
      <Header showContent={showContent} onClick={handleShowContent}>
        {title}
      </Header>
      <AnimatePresence>
        {showContent && (
          <Content
            height={height}
            itemsCenter={itemsCenter}
            overflowVisible={overflowVisible}
            overflowScroll={overflowScroll}
            loading={loading}
          >
            {children}
          </Content>
        )}
      </AnimatePresence>
      {showContent && buttonComponent}
    </div>
  );
}
