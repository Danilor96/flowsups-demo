import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { MainLi } from './mainLi/MainLi';
import { modalWindowStore } from '@/store/adminDashboard';
import { useCan } from '@/hooks/permissions';

export function TabNavigation({
  renderedElements,
  optionDescription,
  canByPosition,
}: {
  renderedElements: React.ReactNode[];
  optionDescription: string[];
  canByPosition?: number[][];
}) {
  // ----- global states -----

  const { currentScrollTop } = modalWindowStore();

  const { can } = useCan();

  // ----- local states -----

  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [direction, setDirection] = useState({ in: 'right', out: 'left' });
  const [itemsToRender, setItemsToRender] = useState<typeof renderedElements>();
  const [descriptionsToRender, setDescriptionsToRender] = useState<typeof optionDescription>();

  const handleTabSelected = (indexSelected: number) => {
    if (index !== indexSelected) {
      setIndex(indexSelected);
    }
  };

  useEffect(() => {
    if (index > prevIndex) {
      setDirection({
        in: 'right',
        out: 'left',
      });
    }

    if (index < prevIndex) {
      setDirection({
        in: 'left',
        out: 'right',
      });
    }

    setPrevIndex(index);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const transitionThreshold = 139;
  const isScrolled = currentScrollTop >= transitionThreshold;

  useEffect(() => {
    if (canByPosition) {
      const indexForDescriptions: number[] = [];

      const filteredItemsWithCan = renderedElements.filter((el, ind) => {
        const permissions = canByPosition[ind];

        if (permissions) {
          if (can(permissions)) {
            indexForDescriptions.push(ind);

            return el;
          }
        } else {
          indexForDescriptions.push(ind);

          return el;
        }
      });

      const filteredDescriptions = optionDescription.filter((el, ind) =>
        indexForDescriptions.includes(ind),
      );

      setDescriptionsToRender(filteredDescriptions);

      setItemsToRender(filteredItemsWithCan);
    } else {
      setDescriptionsToRender([...optionDescription]);

      setItemsToRender([...renderedElements]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canByPosition, renderedElements, optionDescription]);

  return (
    <>
      <motion.ul
        initial={{
          opacity: 0,
          scale: 0,
        }}
        whileInView={{ opacity: 1, scale: 1 }}
        className="w-fit h-fit flex flex-row mx-auto mt-[2.45vh] border-b-2 border-primaryColor"
      >
        {itemsToRender &&
          itemsToRender.length > 1 &&
          itemsToRender.map((el, ind) => (
            <MainLi
              key={`navikey---${ind + 48}`}
              description={descriptionsToRender ? descriptionsToRender[ind] || '' : ''}
              directionIn={direction.in}
              directionOut={direction.out}
              ind={ind}
              index={index}
              descriptionLeft={false}
              noRoundedTop={false}
              onClick={() => handleTabSelected(ind)}
            />
          ))}
      </motion.ul>
      <AnimatePresence>
        {isScrolled && (
          <motion.ul
            initial={{
              opacity: 0,
              scale: 0,
              top: transitionThreshold,
            }}
            animate={{
              top: isScrolled ? currentScrollTop + 50 : undefined,
              opacity: isScrolled ? 1 : 0,
              scale: isScrolled ? 1 : 0,
            }}
            exit={{
              opacity: 0,
              scale: 0,
            }}
            className="absolute left-[100.2%] z-10 w-fit h-fit flex flex-col mx-auto mt-[2.45vh] rounded-t-md bg-white"
          >
            {itemsToRender &&
              itemsToRender.length > 1 &&
              itemsToRender.map((el, ind) => (
                <MainLi
                  key={`navikey---${ind + 48}`}
                  description={descriptionsToRender ? descriptionsToRender[ind] || '' : ''}
                  directionIn={direction.in}
                  directionOut={direction.out}
                  ind={ind}
                  index={index}
                  descriptionLeft={true}
                  noRoundedTop={ind != 0}
                  onClick={() => handleTabSelected(ind)}
                />
              ))}
          </motion.ul>
        )}
      </AnimatePresence>
      {itemsToRender?.map((el, ind) => {
        if (index === ind) {
          return el;
        }
      })}
    </>
  );
}
