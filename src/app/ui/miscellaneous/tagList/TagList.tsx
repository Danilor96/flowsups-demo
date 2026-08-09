import { motion } from 'framer-motion';
import { TagListCancelIcon } from '&/icons/Icons';
import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';
import { Loader } from '../loader/Loader';
import { useEffect, useState } from 'react';
import { CategoryComponent } from './categoryComponent/CategoryComponent';
import { SearchableComponent } from './searchableComponent/SearchableComponent';

export function TagList({
  width,
  backgroundColor,
  marginTop,
  height,
  items,
  onClick,
  identity,
  buttonItems,
  buttonItemIdentity,
  overflowYScroll,
  itemButtonNoCancelIcon,
  itemsBackgroundColor,
  itemsNameColor,
  rowGap,
  loading,
  setCategories,
  allCategoriesBtn,
  searchableItems,
  title,
}: {
  width?: number;
  height: number;
  backgroundColor?: string;
  marginTop?: number;
  overflowYScroll?: boolean;
  items?: {
    id: number | undefined;
    name: string | undefined;
    bgColor?: string;
    nameColor?: string;
    cancelBtnColor?: string;
    category?: number | null;
  }[];
  buttonItems?: {
    id: number | undefined;
    name: string | undefined;
    bgColor?: string;
    nameColor?: string;
    cancelBtnColor?: string;
    category?: number | null;
  }[];
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  identity?: string;
  itemsBackgroundColor?: string;
  itemsNameColor?: string;
  buttonItemIdentity?: string;
  itemButtonNoCancelIcon?: boolean;
  rowGap?: number;
  loading?: boolean;
  setCategories?: { category: string; value: number }[];
  allCategoriesBtn?: boolean;
  searchableItems?: boolean;
  title?: string;
}) {
  // ----- global states -----

  // ----- local states -----

  const [categorySelected, setCategorySelected] = useState<number | null>(null);

  const [searchValue, setSearchValue] = useState('');

  const [itemsFiltered, setItemsFiltered] = useState<typeof items>(undefined);
  const [buttonItemsFiltered, setButtonItemsFiltered] = useState<typeof buttonItems>(undefined);

  useEffect(() => {
    if (items && items.length > 0) {
      let currentItems = [...items];

      if (searchValue) {
        currentItems = currentItems.filter((el) => {
          const searchValueArrayFormatted = searchValue.toLowerCase().split(' ');
          const itemNameFormatted = el.name?.toLowerCase();

          return searchValueArrayFormatted.every((word) => itemNameFormatted?.includes(word));
        });
      }

      setItemsFiltered(currentItems);
    } else {
      setItemsFiltered(undefined);
    }

    if (buttonItems && buttonItems.length > 0) {
      let currentButtonItems = [...buttonItems];

      if (searchValue) {
        currentButtonItems = currentButtonItems.filter((el) => {
          const searchValueArrayFormatted = searchValue.toLowerCase().split(' ');
          const itemNameFormatted = el.name?.toLowerCase();

          return searchValueArrayFormatted.every((word) => itemNameFormatted?.includes(word));
        });
      }

      setButtonItemsFiltered(currentButtonItems);
    } else {
      setButtonItemsFiltered(undefined);
    }
  }, [searchValue, items, buttonItems]);

  return (
    <section>
      {setCategories && setCategories.length > 0 && (
        <>
          {title && (
            <Paragraph color="#00a78b" fontSize={2} fontWeight={600}>
              {title}
            </Paragraph>
          )}
          <div className="flex flex-row justify-between">
            <CategoryComponent
              categories={setCategories}
              onClick={setCategorySelected}
              selected={categorySelected}
              allCategoriesBtn={allCategoriesBtn}
            />
            {searchableItems && (
              <SearchableComponent onClick={setSearchValue} value={searchValue} />
            )}
          </div>
        </>
      )}
      {!setCategories && title && (
        <div className="flex flex-row justify-between">
          <Paragraph color="#00a78b" fontSize={2} fontWeight={600}>
            {title}
          </Paragraph>
          {searchableItems && <SearchableComponent onClick={setSearchValue} value={searchValue} />}
        </div>
      )}
      {!setCategories && !title && searchableItems && (
        <SearchableComponent onClick={setSearchValue} value={searchValue} />
      )}

      <div
        className="relative flex flex-wrap content-start gap-y-[2vh] gap-x-[1vw] px-[1.25vw] py-[2.222222vh]"
        style={{
          width: width ? `${width}vw` : '100%',
          backgroundColor: backgroundColor ? backgroundColor : '#F4F4F4',
          marginTop: marginTop && `${marginTop}vh`,
          height: height && `${height}vh`,
          overflowY: overflowYScroll ? 'scroll' : 'auto',
          // rowGap: `${rowGap}vh`,
          borderTopRightRadius: '0.520833vw',
          borderBottomRightRadius: '0.520833vw',
          borderBottomLeftRadius: '0.520833vw',
          borderTopLeftRadius: setCategories && setCategories.length > 0 ? '' : '0.520833vw',
        }}
      >
        {itemsFiltered && itemsFiltered.length > 0 ? (
          itemsFiltered.map((el) => {
            if (el.category && categorySelected) {
              if (el.category !== categorySelected) {
                return null;
              }
            }

            return (
              <article
                key={el.id}
                className="w-fit h-fit flex flex-row gap-[0.729167vw] px-[0.520833vw] py-[1.111111vh] rounded-[1.041667vw]"
                style={{
                  backgroundColor: el.bgColor
                    ? el.bgColor
                    : itemsBackgroundColor
                    ? itemsBackgroundColor
                    : '#C9EBE6',
                }}
              >
                <p
                  className="text-[2vh]"
                  style={{
                    color: el.nameColor
                      ? el.nameColor
                      : itemsNameColor
                      ? itemsNameColor
                      : '#00A78B',
                  }}
                >
                  {el.name}
                </p>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-fit h-fit"
                  data-id={el.id}
                  data-identity={identity}
                  onClick={onClick}
                >
                  <TagListCancelIcon />
                </motion.button>
              </article>
            );
          })
        ) : buttonItemsFiltered && buttonItemsFiltered.length > 0 ? (
          buttonItemsFiltered.map((el) => {
            if (el.category && categorySelected) {
              if (el.category !== categorySelected) {
                return null;
              }
            }

            return (
              <motion.button
                key={el.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                data-id={el.id}
                data-buttonitemidentity={buttonItemIdentity}
                onClick={onClick}
                className="w-fit h-fit flex flex-row gap-[0.729167vw] px-[0.520833vw] py-[1.111111vh] rounded-[1.041667vw] outline-none"
                style={{
                  backgroundColor: el.bgColor
                    ? el.bgColor
                    : itemsBackgroundColor
                    ? itemsBackgroundColor
                    : '#C9EBE6',
                }}
              >
                <p
                  className="text-[2vh]"
                  style={{
                    color: el.nameColor
                      ? el.nameColor
                      : itemsNameColor
                      ? itemsNameColor
                      : '#00A78B',
                  }}
                >
                  {el.name}
                </p>
                {itemButtonNoCancelIcon ? null : (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-fit h-fit"
                    data-id={el.id}
                    data-identity={identity}
                    onClick={(e) => {
                      onClick(e);

                      e.stopPropagation();
                    }}
                  >
                    <TagListCancelIcon color={el?.cancelBtnColor} />
                  </motion.button>
                )}
              </motion.button>
            );
          })
        ) : (
          <Paragraph>Add...</Paragraph>
        )}
        {loading && (
          <Loader
            props={{
              style: {
                backgroundColor: '#0003',
              },
            }}
          />
        )}
      </div>
    </section>
  );
}
