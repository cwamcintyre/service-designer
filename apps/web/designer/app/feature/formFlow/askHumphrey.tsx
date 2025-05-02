import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { type Form } from "@/store/formTypes";
import axios from 'axios';
import { set } from 'react-hook-form';

type Message = {
    type: string;
    message: string;
}

export default function Chatbot({ formId, onReceiveForm }: { formId: string; onReceiveForm: (form: Form) => void }) {

    const chatApiUrl = `${import.meta.env.VITE_APP_CHAT_URL}/humphrey/chat`;

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (input.trim()) {
            setMessages([...messages, { type: 'user', message: input }]);
            setInput('');
            
            try {
                setIsLoading(true);
                
                const response = await axios.post(chatApiUrl, { prompt: input, formId: formId });
                
                setIsLoading(false);

                const jsonResponse = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;

                if (jsonResponse.response) {
                    setMessages(prevMessages => [...prevMessages, { type: 'bot', message: jsonResponse.response }]);
                }

                if (jsonResponse.form && Object.keys(jsonResponse.form).length > 0) {
                    onReceiveForm(jsonResponse.form as Form);
                }

            } catch (error) {
                console.error('Error calling chat API:', error);
                
                setMessages(prevMessages => [...prevMessages, { type: 'bot', message: "Sorry, there was an error. Please try again." }]);
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="p-5 w-full h-full flex flex-col mx-auto border border-gray-300 rounded-lg">            
            <div className="flex-grow overflow-y-auto border border-gray-200 p-3 mb-3">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`mb-2 p-4 w-[70%] rounded inline-block clear-both ${message.type === "user" ? 'bg-blue-100 text-left float-right' : 'bg-gray-100 text-left float-left'}`}
                    >
                        {message.message}
                    </div>
                ))}
            </div>
            <div className="flex items-center">
                <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-grow border border-gray-300 h-50 rounded px-2 py-1 mr-2"
                />
                <Button
                    onClick={handleSend}
                    className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 w-15"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <div className="spinner-border animate-spin inline-block w-4 h-4 border-2 rounded-full" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    ) : (
                        "Send"
                    )}
                </Button>
            </div>
        </div>
    );
};