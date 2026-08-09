import { ButtonContainer } from '&/buttons/ButtonContainer';
import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';
import { HorizontalLine } from '&/miscellaneous/separators/HorizontalLine';
import { TextAndInfoButton } from '&/miscellaneous/textAndInfoButton/TextAndInfoButton';

export function TotalDisplay({
  totals,
}: {
  totals?: {
    total: number;
    vehiclePrice: number;
    water: number;
    potentialProfit: number;
  };
}) {
  // handling text and info buttons

  const textInfoBtn = [
    {
      key: 1,
      text: 'Vehicle Price',
      info: `Vehicle Price is based on Special Price, Advertising Price or Asking Price`,
      total: totals ? totals.vehiclePrice : 0,
    },
    {
      key: 2,
      text: 'Water',
      info: `Water is the negative equity on the car (Book Value minus Total Cost)`,
      total: totals ? totals.water : 0,
    },
    {
      key: 3,
      text: 'Potential Profit',
      info: `Potential profit is Vehicle Price minus Total Cost`,
      total: totals ? totals.potentialProfit : 0,
    },
  ];

  return (
    <section className="col-span-2">
      <HorizontalLine lineColor="#B3B3B3" />
      <ButtonContainer marginTop={2.314815} widthFull justify="space-between">
        <Paragraph fontSize={1.9} fontWeight={600} color="#00A78B">
          Total
        </Paragraph>
        <Paragraph fontSize={1.9} fontWeight={600} color="#00A78B">
          {totals ? `$${totals.total.toLocaleString('en-US')}` : '$0'}
        </Paragraph>
      </ButtonContainer>
      <HorizontalLine lineColor="#B3B3B3" marginTop={11.388889} />
      {textInfoBtn.map((el) => (
        <ButtonContainer key={el.key} marginTop={2} widthFull justify="space-between">
          <TextAndInfoButton text={el.text} info={el.info} />
          <Paragraph
            fontSize={1.9}
            fontWeight={600}
            color={
              el.key === 3
                ? totals && totals.total < totals.vehiclePrice
                  ? '#00A78B'
                  : '#F00'
                : el.key === 2
                ? totals && totals.water > 0
                  ? '#F00'
                  : '#999999'
                : '#999999'
            }
          >
            ${el.total.toLocaleString('en-US')}
          </Paragraph>
        </ButtonContainer>
      ))}
    </section>
  );
}
