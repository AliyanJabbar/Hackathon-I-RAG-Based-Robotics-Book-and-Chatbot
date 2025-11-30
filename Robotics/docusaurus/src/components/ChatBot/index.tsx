"use client";
import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import { motion, AnimatePresence } from "motion/react";
import { FaRegPaperPlane } from "react-icons/fa";
import { BsRobot } from "react-icons/bs";
import { LuMaximize2, LuMinimize2 } from "react-icons/lu";
import { IoMdRefresh } from "react-icons/io";
import { RiCloseLargeLine } from "react-icons/ri";
import { marked } from "marked";
import sanitizeInput from "../../utils/sanitizeInput";
import { useChat } from "../../context/chatContext"; // <--- Import Context
import styles from "./styles.module.css";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

interface ChatMessage {
  role: string;
  text: string;
}

export default function AIAssistantWidget() {
  const {
    siteConfig: {customFields},
  } = useDocusaurusContext();

  const { isOpen, setIsOpen, draftText, clearDraftText } = useChat();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isLarge, setIsLarge] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContentRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null); // To focus input

  const suggestedQuestions = [
    "What are the hardware requirements for the Sim Rig?",
    "Tell me about the Capstone Project.",
    "What topics are covered in Module 3?",
  ];

  // --- LOGIC TO HANDLE PRE-FILLING TEXT ---
  useEffect(() => {
    if (draftText) {
      setInput(draftText); // 1. Put text in input
      clearDraftText();    // 2. Clear from context
      
      // 3. Focus the input field so user can type immediately
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100); 
    }
  }, [draftText, clearDraftText]);
  // ----------------------------------------

  const scrollToBottom = () => {
    if (messagesEndRef.current && chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const sendMessage = async (messageText?: string) => {
    const messageToSend = messageText || input.trim();
    if (!messageToSend || isLoading) return;

    const newMessages = [...messages, { role: "user", text: messageToSend }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    setShowWelcome(false);
    // console.log("backend url:", customFields.BACKEND_URL);

    try {
      const res = await fetch(`${customFields.BACKEND_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      const botReply = data.response || data.text || data.message || "No response received.";
      setMessages((prev) => [...prev, { role: "bot", text: botReply }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "❌ Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => sendMessage(question);
  
  const handleRefresh = () => {
    setMessages([]);
    setShowWelcome(true);
    setInput("");
  };

  return (
    <main className={styles.wrapper}>
      {/* Floating Chat Button */}
      <motion.button
        aria-label="Open AI Assistant Chat"
        whileTap={{ scale: 0.9, transition: { duration: 0.2 } }}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={styles.floatingBtn}
      >
        <BsRobot size={23} className={styles.iconRobot} />
      </motion.button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chatbox"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
            className={clsx(styles.modal, isLarge && styles.modalLarge)}
          >
            {/* Header */}
            <div className={styles.header}>
              <div className={styles.headerLeft}>
                <div className={styles.avatar}>
                  <BsRobot className={styles.headerIcon} />
                  <div className={styles.statusDot} />
                </div>
                <div className={styles.headerInfo}>
                  <h2 className={styles.title}>AI Assistant</h2>
                  <p className={styles.subtitle}>{isLoading ? "Typing..." : "Online"}</p>
                </div>
              </div>
              <div className={styles.headerActions}>
                <motion.button onClick={handleRefresh} className={styles.actionBtn}>
                  <IoMdRefresh size={22} />
                </motion.button>
                <motion.button onClick={() => setIsLarge(!isLarge)} className={clsx(styles.actionBtn, styles.hideMobile)}>
                  {isLarge ? <LuMinimize2 size={20} /> : <LuMaximize2 size={20} />}
                </motion.button>
                <motion.button onClick={() => setIsOpen(false)} className={styles.actionBtn}>
                  <RiCloseLargeLine size={20} />
                </motion.button>
              </div>
            </div>

            {/* Chat Content */}
            <div className={styles.contentWrapper}>
              <div ref={chatContentRef} className={styles.messagesArea}>
                {showWelcome && messages.length === 0 ? (
                  <div className={styles.welcome}>
                    <div className={styles.welcomeIcon}><BsRobot size={40} /></div>
                    <div className={styles.welcomeText}>
                      <p>"Hi! Select any text on the page to ask about it, or type a question below!"</p>
                    </div>
                    <div className={styles.suggestions}>
                      {suggestedQuestions.map((q, i) => (
                        <button key={i} onClick={() => handleSuggestedQuestion(q)} className={styles.suggestionBtn}>{q}</button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className={styles.messageList}>
                    {messages.map((msg, ind) => (
                      <div key={ind} className={clsx(styles.messageRow, msg.role === "user" ? styles.rowUser : styles.rowBot)}>
                        <div className={clsx(styles.bubble, msg.role === "user" ? styles.bubbleUser : styles.bubbleBot)}>
                          {msg.role === "user" ? msg.text : <div className={styles.markdown} dangerouslySetInnerHTML={{ __html: marked.parse(msg.text) }} />}
                        </div>
                      </div>
                    ))}
                    {isLoading && <div className={styles.loadingContainer}><div className={styles.typingIndicator}><span /><span /><span /></div></div>}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
              <div className={styles.gradientTop} />
              <div className={styles.gradientBottom} />
            </div>

            {/* Input */}
            <div className={styles.inputContainer}>
              <input
                ref={inputRef}
                className={styles.inputField}
                placeholder="Ask me anything..."
                value={input}
                onChange={(e) => setInput(sanitizeInput(e.target.value))}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={() => sendMessage()}
                disabled={isLoading}
                className={clsx(styles.sendBtn, isLoading && styles.btnDisabled)}
              >
                <FaRegPaperPlane className={styles.sendIcon} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}