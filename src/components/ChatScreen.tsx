import type { ChatItem } from "../types/chat";
import ChatMessage from "./ChatMessage";

type Props = {
  history: ChatItem[];
  onRedoLastAssistant?: () => void;
};

export default function ChatScreen({ history, onRedoLastAssistant }: Props) {
  const assistantIndices = history
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => item.role === "assistant" && !item.isLoading);

  const lastAssistantIndex =
    assistantIndices.length > 0
      ? assistantIndices[assistantIndices.length - 1].index
      : undefined;

  return (
    <section className="mx-auto w-full max-w-[1080px] px-4 pb-[280px] pt-6 md:px-6 md:pb-[320px]">
      <div className="grid gap-7">
        {history.map((item, index) => (
          <ChatMessage
            key={item.id}
            item={item}
            isLast={index === history.length - 1}
            onRedo={
              index === lastAssistantIndex ? onRedoLastAssistant : undefined
            }
          />
        ))}
      </div>
    </section>
  );
}
