export function LastMessageContainer({
  lastMessage,
  file,
}: {
  lastMessage: string;
  file?: boolean;
}) {
  // ----- global states -----

  // ----- local states -----

  const handleTextLength = (text: string) => {
    let newText = text;

    if (newText.length > 55) {
      newText = `${text.slice(0, 55)}...`;
    }

    if (newText.length === 0 && file) {
      newText = 'Image';
    }

    return newText;
  };

  return (
    <section className="w-fit h-fit flex justify-center items-center px-[1.979167vw] py-[1.851852vh] bg-[#FFFFFF21] rounded-[1.5625vw]">
      <p className="text-[1.851852vh] text-[#FFF]">{handleTextLength(lastMessage)}</p>
    </section>
  );
}
