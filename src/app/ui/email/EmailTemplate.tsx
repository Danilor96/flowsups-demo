import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';

export function EmailTemplate({ resetLink }: { resetLink: string }) {
  return (
    <div>
      <Paragraph>{`Your reset link is: ${resetLink}`}</Paragraph>
    </div>
  );
}
