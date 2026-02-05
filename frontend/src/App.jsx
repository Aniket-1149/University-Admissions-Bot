import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Icons as components
const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
  </svg>
);

const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06l-3.22-3.22V16.5a.75.75 0 0 1-1.5 0V4.81L8.03 8.03a.75.75 0 0 1-1.06-1.06l4.5-4.5Z" clipRule="evenodd" />
    <path fillRule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
  </svg>
);

const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z" clipRule="evenodd" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
  </svg>
);

const DocumentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z" clipRule="evenodd" />
    <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
  </svg>
);

const NewChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
  </svg>
);

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <path d="M3 12h18M3 6h18M3 18h18" />
  </svg>
);

const LoadingDots = () => (
  <div className="flex space-x-1">
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
  </div>
);

function App() {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [compressedData, setCompressedData] = useState(null);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [question, inputText]);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setInputText(event.target.result);
        setShowUploadModal(false);
      };
      reader.readAsText(uploadedFile);
    }
  };

  const handleCompress = async () => {
    if (!inputText.trim()) {
      setError('Please paste or upload admission guidelines first');
      return;
    }

    setLoading(true);
    setError('');

    const userMessage = {
      type: 'user',
      content: `Analyze these admission guidelines:\n\n${inputText.substring(0, 300)}${inputText.length > 300 ? '...' : ''}`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await axios.post(`${API_URL}/api/compress`, {
        text: inputText
      });

      setCompressedData(response.data);
      
      const aiMessage = {
        type: 'ai',
        content: response.data,
        isStructured: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setInputText('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze. Please try again.');
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

  const handleAskQuestion = async () => {
    if (!question.trim()) return;

    if (!compressedData) {
      setError('Please upload and analyze admission guidelines first');
      return;
    }

    setLoading(true);
    setError('');

    const userMessage = {
      type: 'user',
      content: question,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    const currentQuestion = question;
    setQuestion('');

    try {
      const response = await axios.post(`${API_URL}/api/ask-question`, {
        question: currentQuestion,
        compressedData: compressedData
      });

      const aiMessage = {
        type: 'ai',
        content: response.data.answer,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage = {
        type: 'ai',
        content: 'Sorry, I couldn\'t process your question. Please try again.',
        isError: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setInputText('');
    setCompressedData(null);
    setMessages([]);
    setQuestion('');
    setError('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (compressedData) {
        handleAskQuestion();
      } else if (inputText.trim()) {
        handleCompress();
      }
    }
  };

  const renderStructuredData = (data) => (
    <div className="space-y-4">
      {data.universityName && (
        <div className="border-b border-gray-700 pb-3">
          <h3 className="text-xl font-bold text-emerald-400">{data.universityName}</h3>
        </div>
      )}

      {data.programs && data.programs.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">Programs</h4>
          <div className="grid gap-2">
            {data.programs.map((program, idx) => (
              <div key={idx} className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                <p className="font-medium text-white">{program.name}</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {program.degree && <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">{program.degree}</span>}
                  {program.duration && <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">{program.duration}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.requirements && (
        <div>
          <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">Requirements</h4>
          <div className="space-y-3">
            {data.requirements.academic && (
              <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                <p className="text-xs text-purple-400 font-medium mb-2">Academic</p>
                <ul className="space-y-1">
                  {(Array.isArray(data.requirements.academic) ? data.requirements.academic : [data.requirements.academic]).map((req, idx) => (
                    <li key={idx} className="text-sm text-gray-300 flex items-start">
                      <span className="text-purple-400 mr-2">•</span>{req}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {data.requirements.testScores && (
              <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                <p className="text-xs text-orange-400 font-medium mb-2">Test Scores</p>
                <ul className="space-y-1">
                  {(Array.isArray(data.requirements.testScores) ? data.requirements.testScores : [data.requirements.testScores]).map((score, idx) => (
                    <li key={idx} className="text-sm text-gray-300 flex items-start">
                      <span className="text-orange-400 mr-2">•</span>{score}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {data.requirements.documents && (
              <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                <p className="text-xs text-cyan-400 font-medium mb-2">Required Documents</p>
                <ul className="space-y-1">
                  {(Array.isArray(data.requirements.documents) ? data.requirements.documents : [data.requirements.documents]).map((doc, idx) => (
                    <li key={idx} className="text-sm text-gray-300 flex items-start">
                      <span className="text-cyan-400 mr-2">•</span>{doc}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {data.deadlines && data.deadlines.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">Deadlines</h4>
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
            <ul className="space-y-1">
              {data.deadlines.map((deadline, idx) => (
                <li key={idx} className="text-sm text-yellow-200 flex items-center">
                  <span className="mr-2">📅</span>{deadline}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {data.fees && Object.keys(data.fees).length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">Fees</h4>
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
            <div className="space-y-2">
              {Object.entries(data.fees).map(([key, value], idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="text-green-400 font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {data.additionalInfo && data.additionalInfo.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">Additional Info</h4>
          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
            <ul className="space-y-1">
              {data.additionalInfo.map((info, idx) => (
                <li key={idx} className="text-sm text-gray-300 flex items-start">
                  <span className="text-blue-400 mr-2">ℹ️</span>{info}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-gray-950 border-r border-gray-800 transition-all duration-300 overflow-hidden flex flex-col`}>
        <div className="p-3">
          <button onClick={handleNewChat} className="w-full flex items-center gap-2 px-4 py-3 rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors text-sm">
            <NewChatIcon />
            New Analysis
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto px-3">
          <p className="text-xs text-gray-500 px-2 py-3">Previous analyses will appear here</p>
        </div>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
              <span className="text-sm font-bold text-gray-900">🎓</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Admissions AI</p>
              <p className="text-xs text-gray-500">Powered by Gemini</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 border-b border-gray-800 flex items-center px-4 gap-3">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <MenuIcon />
          </button>
          <h1 className="text-lg font-semibold">College Admissions Assistant</h1>
          {compressedData && (
            <span className="ml-auto text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full">
              ✓ Data Loaded
            </span>
          )}
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-4 max-w-3xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-emerald-400 to-cyan-500 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20">
                <span className="text-3xl">🎓</span>
              </div>
              <h2 className="text-2xl font-bold mb-2 text-center">College Admissions Assistant</h2>
              <p className="text-gray-400 text-center mb-8 max-w-md">
                Upload university admission guidelines and get structured, fact-based summaries. Ask follow-up questions based on the data.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg mb-8">
                <button onClick={() => setShowUploadModal(true)} className="flex items-center gap-3 p-4 rounded-xl bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-gray-600 transition-all text-left group">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/30 transition-colors">
                    <DocumentIcon />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Upload Guidelines</p>
                    <p className="text-xs text-gray-500">Upload a .txt file</p>
                  </div>
                </button>
                <button onClick={() => document.getElementById('mainTextarea')?.focus()} className="flex items-center gap-3 p-4 rounded-xl bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-gray-600 transition-all text-left group">
                  <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 group-hover:bg-blue-500/30 transition-colors">
                    <SparklesIcon />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Paste Text</p>
                    <p className="text-xs text-gray-500">Paste guidelines below</p>
                  </div>
                </button>
              </div>

              <div className="w-full max-w-lg">
                <p className="text-xs text-gray-500 mb-3 text-center">After analysis, try asking:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {['What are the GPA requirements?', 'Application deadlines?', 'Required documents?'].map((q, idx) => (
                    <span key={idx} className="text-xs bg-gray-800 px-3 py-1.5 rounded-full text-gray-400 border border-gray-700">{q}</span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto py-4 px-4 space-y-6">
              {messages.map((message, idx) => (
                <div key={idx} className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : ''}`}>
                  {message.type === 'ai' && (
                    <div className="w-8 h-8 rounded-lg bg-linear-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shrink-0">
                      <SparklesIcon />
                    </div>
                  )}
                  <div className={`flex-1 max-w-[85%] ${message.type === 'user' ? 'order-first' : ''}`}>
                    <div className={`rounded-2xl px-4 py-3 ${
                      message.type === 'user' 
                        ? 'bg-emerald-600 ml-auto' 
                        : message.isError 
                          ? 'bg-red-500/20 border border-red-500/30' 
                          : 'bg-gray-800'
                    }`}>
                      {message.isStructured ? renderStructuredData(message.content) : (
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      )}
                    </div>
                  </div>
                  {message.type === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center shrink-0">
                      <UserIcon />
                    </div>
                  )}
                </div>
              ))}
              
              {loading && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-linear-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
                    <SparklesIcon />
                  </div>
                  <div className="bg-gray-800 rounded-2xl px-4 py-3">
                    <LoadingDots />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {error && (
          <div className="px-4 py-2 bg-red-500/10 border-t border-red-500/30">
            <p className="text-sm text-red-400 text-center">{error}</p>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-gray-800 p-4">
          <div className="max-w-3xl mx-auto">
            <div className="relative bg-gray-800 rounded-2xl border border-gray-700 focus-within:border-gray-600 transition-colors">
              <textarea
                id="mainTextarea"
                ref={textareaRef}
                value={compressedData ? question : inputText}
                onChange={(e) => compressedData ? setQuestion(e.target.value) : setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={compressedData ? "Ask a question about the admission requirements..." : "Paste university admission guidelines here..."}
                rows={compressedData ? 1 : 3}
                className="w-full bg-transparent px-4 py-3 pr-24 text-sm resize-none focus:outline-none max-h-48 placeholder-gray-500"
              />
              
              <div className="absolute right-2 bottom-2 flex items-center gap-2">
                {!compressedData && (
                  <button onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors" title="Upload file">
                    <UploadIcon />
                  </button>
                )}
                <button
                  onClick={compressedData ? handleAskQuestion : handleCompress}
                  disabled={loading || (!compressedData && !inputText.trim()) || (compressedData && !question.trim())}
                  className="p-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg transition-colors"
                >
                  <SendIcon />
                </button>
              </div>
            </div>
            
            <p className="text-xs text-gray-500 text-center mt-2">
              {compressedData 
                ? 'Ask questions based on the analyzed data • Press Enter to send'
                : 'Paste guidelines and press Enter to analyze • AI extracts factual requirements only'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowUploadModal(false)}>
          <div className="bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-gray-800" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">Upload Guidelines</h3>
            <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-gray-600 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
                <UploadIcon />
              </div>
              <p className="text-sm text-gray-400 mb-1">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500">.txt files supported</p>
            </div>
            <input ref={fileInputRef} type="file" accept=".txt" onChange={handleFileUpload} className="hidden" />
            <button onClick={() => setShowUploadModal(false)} className="w-full mt-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
