import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message, Role } from '../types';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === Role.USER;

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-5 py-4 shadow-sm ${
          isUser 
            ? 'bg-blue-600 text-white rounded-br-none' 
            : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
        }`}
      >
        <div className={`text-sm md:text-base leading-relaxed ${isUser ? 'prose-invert' : ''}`}>
           {/* Custom styling for markdown elements since we aren't using the full tailwind typography plugin */}
           <ReactMarkdown
            components={{
              strong: ({node, ...props}) => <span className="font-bold" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc ml-4 my-2 space-y-1" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal ml-4 my-2 space-y-1" {...props} />,
              li: ({node, ...props}) => <li className="" {...props} />,
              p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
              h1: ({node, ...props}) => <h1 className="text-lg font-bold my-2" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-base font-bold my-2" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-sm font-bold my-1" {...props} />,
            }}
           >
            {message.text}
           </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;