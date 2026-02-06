import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { PastelBackground } from './components/PastelBackground';
import { Header } from './components/Header';
import { EmptyState } from './components/EmptyState';
import { ChatMessage, LoadingMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { Sidebar } from './components/Sidebar';
import * as pdfjsLib from 'pdfjs-dist';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

const compressData = async (text) => {
  const response = await axios.post(`${API_URL}/api/compress`, { text });
  return response.data;
};

const askQuestion = async (question, compressedData) => {
  const response = await axios.post(`${API_URL}/api/ask-question`, { question, compressedData });
  return response.data.answer;
};

const App = () => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [compressedData, setCompressedData] = useState(null);
  const [attachedFile, setAttachedFile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  
  // Sidebar & History State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [recentChats, setRecentChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);

  // Load history from local storage on mount
  useEffect(() => {
    const savedChats = localStorage.getItem('admission_chat_history');
    if (savedChats) {
      try {
        const parsedChats = JSON.parse(savedChats);
        // Clean up old chats > 2 days
        const twoDaysAgo = Date.now() - (2 * 24 * 60 * 60 * 1000);
        const validChats = parsedChats.filter(chat => chat.timestamp > twoDaysAgo);
        setRecentChats(validChats);
        
        // Update storage if we cleaned anything
        if (validChats.length !== parsedChats.length) {
            localStorage.setItem('admission_chat_history', JSON.stringify(validChats));
        }
      } catch (e) {
        console.error("Failed to parse chat history", e);
      }
    }
  }, []);

  // Save history whenever it changes
  useEffect(() => {
    if (recentChats.length > 0) {
      localStorage.setItem('admission_chat_history', JSON.stringify(recentChats));
    }
  }, [recentChats]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
        setLoading(true); // temporary loading state while parsing
      try {
        let content = '';
        
        if (uploadedFile.type === 'application/pdf' || uploadedFile.name.toLowerCase().endsWith('.pdf')) {
            content = await extractTextFromPDF(uploadedFile);
        } else {
            content = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (event) => resolve(event.target?.result);
                reader.onerror = (error) => reject(error);
                reader.readAsText(uploadedFile);
            });
        }

        const maxLength = 20000; 
        const truncatedContent = content.substring(0, maxLength);
        const suffix = content.length > maxLength ? '... [content truncated]' : '';
        
        setAttachedFile({
          name: uploadedFile.name,
          content: `${truncatedContent}${suffix}`
        });
        
        // Suggest a prompt if the input is empty
        if (!inputText.trim()) {
          setInputText("Please analyze these admission guidelines");
        }
      } catch (err) {
        console.error("File upload error:", err);
        setError("Failed to read the file. Please ensure it's a valid text or PDF document.");
      } finally {
        setLoading(false);
        e.target.value = ''; // Reset input
      }
    }
  };

  const handleRemoveFile = () => {
    setAttachedFile(null);
    // If the input text was the default prompt, clear it
    if (inputText === "Please analyze these admission guidelines") {
      setInputText('');
    }
  };

  const saveCurrentChatToHistory = (newMessages) => {
    if (newMessages.length === 0) return;
    
    // Determine title from first user message
    const firstUserMsg = newMessages.find(m => m.type === 'user');
    const title = firstUserMsg 
      ? (firstUserMsg.content.length > 30 ? firstUserMsg.content.substring(0, 30) + '...' : firstUserMsg.content)
      : 'New Conversation';

    const chatData = {
        id: currentChatId || Date.now(),
        title: title,
        messages: newMessages,
        compressedData: compressedData, // Save context too!
        timestamp: Date.now()
    };

    setRecentChats(prev => {
        const others = prev.filter(c => c.id !== chatData.id);
        return [chatData, ...others];
    });
    
    if (!currentChatId) {
        setCurrentChatId(chatData.id);
    }
  };

  const handleSendMessage = async (text) => {
    const messageText = text || inputText;
    // Allow sending if there's text OR an attached file
    if (!messageText.trim() && !attachedFile) return;

    setLoading(true);
    setError('');
    setInputText('');
    
    // If we are sending the message, we should consume the attached file
    const currentAttachedFile = attachedFile;
    setAttachedFile(null);

    const userMessage = {
      type: 'user',
      content: messageText,
      attachedFile: currentAttachedFile ? { name: currentAttachedFile.name } : null,
      timestamp: new Date()
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    try {
      let responseContent;
      let newCompressedData = compressedData;

      // Check if this is the first message (needs compression) or a follow-up
      if (!compressedData && (currentAttachedFile || messageText.toLowerCase().includes('analyze'))) {
        
        let contentToAnalyze = messageText;
        
        // If there's a file, the content comes from there
        if (currentAttachedFile) {
             contentToAnalyze = currentAttachedFile.content;
        } else {
             // Fallback for direct copy-paste without file attachment object
             contentToAnalyze = messageText.replace('Please analyze these admission guidelines:\n\n', '')
                                           .replace('Please analyze these admission guidelines', '');
        }

        const response = await compressData(contentToAnalyze);
        newCompressedData = response;
        setCompressedData(response);
        
        const aiMessage = {
          type: 'ai',
          content: response,
          isStructured: true,
          timestamp: new Date()
        };
        const finalMessages = [...updatedMessages, aiMessage];
        setMessages(finalMessages);
        saveCurrentChatToHistory(finalMessages); // Save after response

      } else {
        // Mark data as loaded for follow-up questions
        // This case handles if user asks question directly without explicit analysis step first
        // But for this flow to work, we need context. 
        // If no compressedData, we can't really answer unless we have a default context or ask user for it.
        if (!compressedData) {
           const errorMessage = {
            type: 'ai',
            content: 'Please provide admission guidelines or a document for me to analyze first.',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, errorMessage]);
          return;
        }
        
        const answer = await askQuestion(messageText, compressedData);
        const aiMessage = {
          type: 'ai',
          content: answer,
          timestamp: new Date()
        };
        const finalMessages = [...updatedMessages, aiMessage];
        setMessages(finalMessages);
        saveCurrentChatToHistory(finalMessages);
      }
    } catch (err) {
        console.error(err);
      setError('Something went wrong. Please try again.');
      const errorMessage = {
        type: 'ai',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        isError: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (text) => {
    setInputText(text);
    handleSendMessage(text);
  };


  const handleNewChat = () => {
    setMessages([]);
    setCompressedData(null);
    setAttachedFile(null);
    setInputText('');
    setCurrentChatId(null);
    setIsSidebarOpen(false); // Close mobile sidebar
  };

  const handleSelectChat = (chatId) => {
    const chat = recentChats.find(c => c.id === chatId);
    if (chat) {
        setMessages(chat.messages);
        setCompressedData(chat.compressedData);
        setCurrentChatId(chat.id);
        setIsSidebarOpen(false); // Close mobile sidebar on selection
    }
  };

  const handleClearHistory = () => {
    setRecentChats([]);
    localStorage.removeItem('admission_chat_history');
    handleNewChat();
  };

  // Save chat history on unmount or when the component is about to be removed
  useEffect(() => {
    return () => {
      saveCurrentChatToHistory(messages);
    };
  }, [messages]);

  const extractTextFromPDF = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n\n';
    }
    return fullText;
  };

  return (
    <div className="min-h-screen flex text-foreground bg-background">
      <PastelBackground />
      
      {/* Sidebar */}
      <Sidebar 
         isOpen={isSidebarOpen}
         onClose={() => setIsSidebarOpen(false)}
         onNewChat={handleNewChat}
         recentChats={recentChats}
         onSelectChat={handleSelectChat}
         onClearHistory={handleClearHistory}
      />

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col h-screen overflow-hidden">
        <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <EmptyState onSuggestionClick={handleSuggestionClick} />
          ) : (
            <div className="max-w-180 mx-auto py-6 px-4 space-y-6 pb-32">
              {messages.map((message, idx) => (
                <ChatMessage key={idx} message={message} />
              ))}
              
              {loading && <LoadingMessage />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {error && (
          <div className="max-w-180 mx-auto px-4 py-2">
            <div className="bg-destructive/10 border border-destructive/30 rounded-xl px-4 py-2">
              <p className="text-sm text-destructive text-center">{error}</p>
            </div>
          </div>
        )}

        {/* Input Area */}
        <ChatInput 
          value={inputText}
          onChange={setInputText}
          onSend={() => handleSendMessage()}
          onFileUpload={handleFileUpload}
          attachedFile={attachedFile}
          onRemoveFile={handleRemoveFile}
          disabled={loading}
          placeholder={compressedData 
            ? "Ask about programs, eligibility, fees, deadlines…" 
            : "Ask about admissions, programs, eligibility, fees…"
          }
        />
      </div>
    </div>
  );
};

export default App;
