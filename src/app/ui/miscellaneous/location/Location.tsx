import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';

export function Location({ location }: { location: string }) {
  return (
    <div>
      <Paragraph color="#FFF">{location}</Paragraph>
    </div>
  );
}
