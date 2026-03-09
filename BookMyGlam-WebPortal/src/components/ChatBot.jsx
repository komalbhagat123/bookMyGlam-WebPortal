import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, SendHorizontal } from 'lucide-react';
import '../ChatBot.css';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([
    { text: "Hi! Welcome to *BookMyGlam*. How can I help?", sender: "bot" }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (userInput.trim() === "" || isLoading) return;

    const currentInput = userInput;
    setUserInput("");
    setMessages((prev) => [...prev, { text: currentInput, sender: "user" }]);
    setIsLoading(true);

    // Full prompt with context sent as a single "message" string
    const promptContext = `
You are the Professional Virtual Assistant for 'BookMyGlam'

LOCATION & HOURS:
- Location: Nagpur, Maharashtra.
- Mon-Sat: 10:00 AM - 8:00 PM.
- Sunday: 11:00 AM - 4:00 PM (Half day).

SERVICE MENU & CHARGES:
1. HAIR CARE:
   - Basic Haircut: ₹500
   - Hair Wash & Blow Dry: ₹400
   - Deep Conditioning: ₹800
   - Hair Coloring (Global): Starting ₹1500

2. SKIN & FACIALS:
   - Premium Gold Facial: ₹1200
   - Fruit/O3+ Facial: ₹1500
   - Face Cleanup: ₹600
   - De-Tan Treatment: ₹500

3. BRIDAL & MAKEUP:
   - Luxury Bridal Makeup: ₹5000
   - Party Makeup: ₹2000
   - Engagement Makeup: ₹3500
   - Saree Draping: ₹300

4. GROOMING:
   - Threading (Eyebrows): ₹50
   - Full Body Waxing: ₹1200
   - Manicure/Pedicure: ₹800

STRICT RULES:
- Use **BOLD** for category headers.
- Use bullet points (*) for services.
- Use double line breaks between categories.
- NEVER use pet names like 'darling' or 'dear'.
- If a service is not listed, direct user to the 'Services' page.
- Always encourage using the purple 'Book Now' button for scheduling.

USER MESSAGE: ${currentInput}
`;

    try {
      const backendUrl =
        process.env.NODE_ENV === 'production'
          ? "https://book-my-glam-web-portal.vercel.app/api/chat"
          : "http://localhost:5000/api/chat";

      const response = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // ✅ Send as { message: "..." } — matches req.body.message in server.js
        body: JSON.stringify({ message: promptContext })
      });

      const data = await response.json();

      if (response.status === 429) {
        setMessages((prev) => [
          ...prev,
          { text: "⚠️ **Assistant is busy.** Please wait a moment and try again.", sender: "bot" }
        ]);
        return;
      }

      if (response.ok && data.candidates) {
        const botText = data.candidates[0].content.parts[0].text;
        setMessages((prev) => [...prev, { text: botText, sender: "bot" }]);
      } else {
        throw new Error(data.error?.message || "Unknown error");
      }

    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        { text: "I'm having a bit of a glitch. Try again in a moment?", sender: "bot" }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chat-icon" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✖' : <Bot size={30} strokeWidth={2} />}
      </div>

      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">BOOKMYGLAM AI</div>

          <div className="chat-body">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {msg.sender === "bot" ? (
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                ) : (
                  msg.text
                )}
              </div>
            ))}

            {isLoading && (
              <div className="message bot typing">
                <span className="dot">.</span>
                <span className="dot">.</span>
                <span className="dot">.</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          <div className="chat-footer">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type here..."
              disabled={isLoading}
            />
            <button onClick={handleSend} className="send-btn" disabled={isLoading}>
              <SendHorizontal size={20} color="white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;