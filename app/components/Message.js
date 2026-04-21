import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const Message = ({ message, isUser }) => {
  if (!message) return null;

  return (
    <div
      className={`flex mb-4 items-end gap-x-2 ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar */}
      <div className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full shadow-sm ${
        isUser 
          ? "bg-zinc-800 text-gray-300" 
          : "bg-surface border border-gray-700/50"
      }`}>
        <span className="text-sm" role="img" aria-label={isUser ? "User" : "Llama"}>
          {isUser ? "👤" : "🦙"}
        </span>
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-zinc-800 text-gray-200 rounded-br-sm shadow-sm"
            : "bg-transparent text-gray-200"
        }`}
      >
        <div className="prose prose-sm prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default Message;
