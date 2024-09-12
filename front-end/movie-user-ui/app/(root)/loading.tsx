import { Bot } from 'lucide-react';
import React from 'react';

type Props = {};

function Loading({}: Props) {
    return (
        <div className="flex min-h-96 w-full items-center justify-center">
            <Bot className="size-20 animate-bounce" />
        </div>
    );
}

export default Loading;
