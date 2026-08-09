export function LastMessageBubble({ lastMessage }: { lastMessage: string }) {
  // ----- global states -----

  // ----- local states -----

  const handleMessageLength = (message: string) => {
    let newMessage = '';

    if (message.length > 23) {
      newMessage = `${message.slice(0, 23)}...`;
    } else {
      newMessage = message;
    }

    return newMessage;
  };

  return (
    <article className="w-fit h-fit flex justify-center items-center px-[1.2vw] py-[1vh] bg-[#FFFFFF21] rounded-[1.5625vw]">
      <p className="text-[1.851852vh] text-white">{handleMessageLength(lastMessage)}</p>
    </article>
  );
}
