import type { ChatItem } from "../types/chat";
import ChatMessage from "./ChatMessage";

type Props = {
  history: ChatItem[];
};

export default function ChatScreen({ history }: Props) {
  return (
    <section className="mx-auto w-full max-w-[1080px] px-4 md:px-6 pb-56 pt-6 md:pb-64">
      <div className="grid gap-7">
        {history.map((item, index) => (
          <ChatMessage
            key={item.id}
            item={item}
            isLast={index === history.length - 1}
          />
        ))}
      </div>
    </section>
  );
}
