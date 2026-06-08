"use client";
import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import { motion, AnimatePresence } from "motion/react";
import { FaPaperPlane } from "react-icons/fa6";
import { RiRobot2Line, RiCloseLine, RiFullscreenLine, RiFullscreenExitLine, RiRefreshLine } from "react-icons/ri";
import { marked } from "marked";
import sanitizeInput from "../../utils/sanitizeInput";
import { useChat } from "../../context/chatContext";
import styles from "./styles.module.css";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

interface ChatMessage {
  role: string;
  text: string;
}

export default function AIAssistantWidget() {
  const {
    siteConfig: { customFields },
  } = useDocusaurusContext();

  const { isOpen, setIsOpen, draftText, clearDraftText } = useChat();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isLarge, setIsLarge] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContentRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestedQuestions = [
    "What is the ZMP stability criterion?",
    "How do I install the ROS2 dependencies?",
    "Explain the inverse kinematics module.",
  ];

  // --- LOGIC PRESERVED ---
  useEffect(() => {
    if (draftText) {
      setInput(draftText);
      clearDraftText();
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [draftText, clearDraftText]);

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

    try {
      const res = await fetch(`${customFields.BACKEND_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-vercel-protection-bypass": `${process.env.VERCEL_BYPASS_TOKEN}`
        },
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
        { role: "bot", text: "❌ Connection error. The robot is offline." },
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
        aria-label="Open Robotics AI"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={styles.floatingBtn}
      >
        {/* Main Icon Change */}
        <RiRobot2Line size={26} className={styles.iconRobot} />
        <span className={styles.pulse} />
      </motion.button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chatbox"
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
            className={clsx(styles.modal, isLarge && styles.modalLarge)}
          >
            {/* HUD Header */}
            <div className={styles.header}>
              <div className={styles.headerLeft}>
                <div className={styles.avatar}>
                  <RiRobot2Line className={styles.headerIcon} />
                  <div className={styles.scanLine} />
                </div>
                <div className={styles.headerInfo}>
                  <h2 className={styles.title}>Robotics AI</h2>
                  <div className={styles.statusBadge}>
                    <span className={clsx(styles.statusDot, isLoading && styles.statusBlink)} />
                    {isLoading ? "THINKING..." : "ONLINE"}
                  </div>
                </div>
              </div>
              <div className={styles.headerActions}>
                <button onClick={handleRefresh} className={styles.actionBtn} title="Reset Context">
                  <RiRefreshLine size={18} />
                </button>
                <button onClick={() => setIsLarge(!isLarge)} className={clsx(styles.actionBtn, styles.hideMobile)} title="Resize">
                  {isLarge ? <RiFullscreenExitLine size={18} /> : <RiFullscreenLine size={18} />}
                </button>
                <button onClick={() => setIsOpen(false)} className={clsx(styles.actionBtn, styles.closeBtn)} title="Close">
                  <RiCloseLine size={20} />
                </button>
              </div>
            </div>

            {/* Chat Content */}
            <div className={styles.contentWrapper}>
              <div ref={chatContentRef} className={styles.messagesArea}>
                {showWelcome && messages.length === 0 ? (
                  <div className={styles.welcome}>
                    <div className={styles.welcomeVisual}>
                      <RiRobot2Line size={48} />
                    </div>
                    <div className={styles.welcomeText}>
                      <h3>Robotics AI is ready.</h3>
                      <p>Ask about Kinematics, URDF, or select code from the docs to analyze.</p>
                    </div>
                    <div className={styles.suggestions}>
                      {suggestedQuestions.map((q, i) => (
                        <button key={i} onClick={() => handleSuggestedQuestion(q)} className={styles.suggestionBtn}>
                          <span className={styles.cmdPrefix}>{">"}</span> {q}
                        </button>
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
                    {isLoading && (
                      <div className={styles.loadingContainer}>
                        <div className={styles.typingIndicator}>
                          <span /><span /><span />
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
            </div>

            {/* Input Area */}
            <div className={styles.inputContainer}>
              <div className={styles.inputWrapper}>
                <input
                  ref={inputRef}
                  className={styles.inputField}
                  placeholder="Enter command or query..."
                  value={input}
                  onChange={(e) => setInput(sanitizeInput(e.target.value))}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={isLoading}
                  className={clsx(styles.sendBtn, isLoading && styles.btnDisabled)}
                >
                  <FaPaperPlane className={styles.sendIcon} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}