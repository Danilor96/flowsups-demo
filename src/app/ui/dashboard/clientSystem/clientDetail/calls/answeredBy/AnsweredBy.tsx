import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';

export function AnsweredBy({
  user,
  callDirectionId,
}: {
  user: {
    name: string | null;
    last_name: string | null;
  }[];
  callDirectionId: number;
}) {
  // ----- global states -----

  // ----- local states -----

  return (
    <aside className="flex flex-col">
      <Paragraph color="#00A78B" fontSize={2}>
        {callDirectionId === 1 ? 'Answered by:' : 'Made by:'}
      </Paragraph>
      <ul>
        {user.length > 0 ? (
          user.map((el, index) => (
            <li key={`${index * 10}...answered${index}1111`}>
              <Paragraph color="#959595" fontSize={2}>{`${el.name} ${el.last_name}`}</Paragraph>
            </li>
          ))
        ) : (
          <li>
            <Paragraph color="#959595" fontSize={2}>
              Unanswered
            </Paragraph>
          </li>
        )}
      </ul>
    </aside>
  );
}
