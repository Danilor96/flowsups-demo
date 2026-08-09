'use client';

import useUiHandler from '@/hooks/closeComponentsHandler';
import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingPortal,
  offset,
  Placement,
  shift,
  useDismiss,
  useFloating,
  useInteractions,
  useClick,
} from '@floating-ui/react';
import { useRef, useCallback, ReactNode, useState } from 'react';
import { SelectDropIcon } from '../../icons/Icons';

interface Props<T> {
  items: T[];
  loading: boolean;
  hasMore: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  onLoadMore: () => void;
  renderItem: (item: T) => ReactNode;
  selectedRenderItem?: ReactNode;
  keyExtractor: (item: T) => string | number;
  onSelect: (item: T) => void | boolean;
  placeholder?: string;
  enableFloating?: boolean;
  isSelectedFn?: (item: T) => boolean;
  height?: string | number;
}

export default function InfiniteSelector<T>({
  items,
  loading,
  hasMore,
  search,
  onSearchChange,
  onLoadMore,
  renderItem,
  selectedRenderItem,
  keyExtractor,
  onSelect,
  placeholder = 'Search...',
  enableFloating,
  isSelectedFn,
  height,
}: Props<T>) {
  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, onLoadMore],
  );

  const { isOpen, ref, toggleOpen, setIsOpen } = useUiHandler();

  const [currentPlacement, setCurrentPlacement] = useState<Placement>('bottom-start');

  const {
    x,
    y,
    strategy,
    refs,
    context,
    placement: computedPlacement,
  } = useFloating({
    open: isOpen,
    onOpenChange: (open) => {
      setIsOpen(open);
      if (!open) {
        setCurrentPlacement('bottom-start');
      }
    },
    middleware: [offset(10), flip({ fallbackAxisSideDirection: 'end' }), shift()],
    whileElementsMounted: autoUpdate,
    placement: currentPlacement,
  });

  const click = useClick(context, { enabled: !!enableFloating });
  const dismiss = useDismiss(context, { enabled: !!enableFloating });
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

  const handleItemClick = (e: React.MouseEvent, item: T) => {
    e.preventDefault();
    e.stopPropagation();
    const next = onSelect(item);

    if (!next) {
      setIsOpen(false);
    }
  };

  return (
    <div ref={ref} className="">
      <button
        type="button"
        onClick={toggleOpen}
        ref={enableFloating ? refs.setReference : undefined}
        {...(enableFloating ? getReferenceProps() : {})}
        className={`w-full max-w-md flex flex-row justify-between items-center py-[0.35rem] px-3 border rounded-xl shadow-sm bg-white ${isOpen ? 'border-teal-500 ring-2 ring-teal-100 shadow-teal-100' : 'border-slate-200 hover:border-teal-300'}`}
        style={{
          height: height,
        }}
      >
        {selectedRenderItem ? (
          selectedRenderItem
        ) : (
          <p className="w-fit text-slate-400 text-sm font-medium">{placeholder}</p>
        )}
        <div className="flex items-center text-slate-400 pl-2 border-l border-slate-300 ml-1 h-6">
          <div
            className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-teal-600' : ''}`}
          >
            <SelectDropIcon color={isOpen ? '#14b8a6' : undefined} />
          </div>
        </div>
      </button>
      {isOpen && (
        <>
          {enableFloating ? (
            <FloatingPortal>
              <FloatingFocusManager context={context} modal={false}>
                <div
                  ref={refs.setFloating}
                  style={{
                    position: strategy,
                    top: y ?? 0,
                    left: x ?? 0,
                    width: 'max-content',
                    minWidth: '340px',
                    maxWidth: '600px',
                    zIndex: 9999,
                  }}
                  {...getFloatingProps()}
                  className="bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden"
                >
                  <div className="p-2 border-b">
                    <input
                      type="text"
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-teal-500 outline-none text-black"
                      placeholder={placeholder}
                      value={search}
                      onChange={(e) => onSearchChange(e.target.value)}
                    />
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {items.map((item, index) => (
                      <div
                        key={keyExtractor(item)}
                        ref={index === items.length - 1 ? lastElementRef : null}
                        onMouseDown={(e) => handleItemClick(e, item)}
                        className={`p-3 hover:bg-gray-50 border-b last:border-0 cursor-pointer text-md text-black ${isSelectedFn && isSelectedFn(item) ? 'bg-gray-50' : ''}`}
                      >
                        {renderItem(item)}
                      </div>
                    ))}

                    {loading && (
                      <div className="p-4 text-center text-sm text-gray-500 animate-pulse">
                        Loading...
                      </div>
                    )}

                    {!hasMore && items.length > 0 && (
                      <div className="p-2 text-center text-xs text-gray-400">No more results</div>
                    )}
                  </div>
                </div>
              </FloatingFocusManager>
            </FloatingPortal>
          ) : (
            <div className="mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden">
              <div className="p-2 border-b">
                <input
                  type="text"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-teal-500 outline-none text-black"
                  placeholder={placeholder}
                  value={search}
                  onChange={(e) => onSearchChange(e.target.value)}
                />
              </div>
              <div className="max-h-60 overflow-y-auto">
                {items.map((item, index) => (
                  <div
                    key={keyExtractor(item)}
                    ref={index === items.length - 1 ? lastElementRef : null}
                    onMouseDown={(e) => handleItemClick(e, item)}
                    className="p-3 hover:bg-gray-50 border-b last:border-0 cursor-pointer text-black"
                  >
                    {renderItem(item)}
                  </div>
                ))}

                {loading && (
                  <div className="p-4 text-center text-sm text-gray-500 animate-pulse">
                    Loading...
                  </div>
                )}

                {!hasMore && items.length > 0 && (
                  <div className="p-2 text-center text-xs text-gray-400">No more results</div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
