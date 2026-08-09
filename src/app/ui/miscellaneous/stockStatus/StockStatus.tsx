import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';

export function StockStatus({ status }: { status: number }) {
  return (
    <div
      className="w-fit h-fit flex justify-center items-center px-[0.6vw] py-[0.6vh] rounded-[0.82vw]"
      style={{
        backgroundColor: `${
          status === 1
            ? '#C9EBE6'
            : status === 2
            ? '#ec4a4a'
            : status === 3
            ? '#FED979'
            : status === 4
            ? '#1962B0'
            : ''
        }`,
      }}
    >
      <Paragraph
        color={status === 1 ? '#00A78B' : status === 3 ? '#A87900' : '#FFF'}
        fontWeight={500}
      >
        {status === 1
          ? 'In stock'
          : status === 2
          ? 'Out of stock'
          : status === 3
          ? 'Sold'
          : status === 4
          ? 'Awaiting repair'
          : ''}
      </Paragraph>
    </div>
  );
}
