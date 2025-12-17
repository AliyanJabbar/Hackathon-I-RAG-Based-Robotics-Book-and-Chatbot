import React, { useState, useCallback } from 'react';
import styles from './ChapterTranslation.module.css';
import { useAuth } from '../../context/AuthContext';
import ReactMarkdown from 'react-markdown'; // <--- IMPORT THIS
import remarkGfm from 'remark-gfm';         // <--- IMPORT THIS

interface ChapterTranslatorProps {
  children: React.ReactNode;
}

export default function ChapterTranslator({ children }: ChapterTranslatorProps) {
  // Get user from context. We don't use authToken here because it's not in the context value.
  const { user, loading: authLoading } = useAuth();

  const [translated, setTranslated] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [preferenceError, setPreferenceError] = useState<string | null>(null);
  
  const [customizedContent, setCustomizedContent] = useState<string | null>(null);
  const [isContentCustomized, setIsContentCustomized] = useState(false);

  // Recursively extract text from React children
  const extractText = useCallback((node: React.ReactNode): string => {
    if (typeof node === 'string') return node;
    if (typeof node === 'number') return String(node);
    if (node === null || node === undefined) return '';
    if (Array.isArray(node)) return node.map(extractText).join(' ');
    if (React.isValidElement(node)) {
      const props = node.props as { children?: React.ReactNode };
      if (props && props.children) return extractText(props.children);
    }
    return '';
  }, []);

  // Free translation using MyMemory API
  async function translateToUrdu(text: string): Promise<string> {
    const chunkSize = 500;
    const chunks: string[] = [];
    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.substring(i, i + chunkSize));
    }

    try {
      const translatedChunks = await Promise.all(
        chunks.map(async (chunk) => {
          const response = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
              chunk
            )}&langpair=en|ur`
          );
          if (!response.ok) throw new Error('Translation API request failed');
          const data = await response.json();
          if (data.responseStatus !== 200) throw new Error(data.responseDetails || 'Translation failed');
          return data.responseData.translatedText;
        })
      );
      return translatedChunks.join(' ');
    } catch (err) {
      console.error('Translation error:', err);
      throw new Error('Failed to translate content. API Limit has reached.');
    }
  }

  const handleTranslate = async () => {
    // Note: If content is customized (Markdown), translation might break formatting.
    // For now, we pass the raw text to the translator.
    const textToTranslate = isContentCustomized && customizedContent ? customizedContent : extractText(children);

    if (translated) {
      setTranslated(false);
      setTranslatedContent('');
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (!textToTranslate || textToTranslate.trim() === '') {
        throw new Error('No text content found to translate');
      }

      const urduText = await translateToUrdu(textToTranslate);
      setTranslatedContent(urduText);
      setTranslated(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Translation failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomizeContent = async () => {
    if (authLoading) return;

    // Get token directly from localStorage since it's not exposed in AuthContext value
    const token = localStorage.getItem('access_token');

    if (!token || !user) {
      setPreferenceError("You must be logged in to customize content.");
      return;
    }

    if (isContentCustomized) {
      setCustomizedContent(null);
      setIsContentCustomized(false);
      setTranslated(false); 
      setTranslatedContent('');
      return;
    }

    setIsCustomizing(true);
    setPreferenceError(null);

    try {
      const textToCustomize = extractText(children);
      if (!textToCustomize || textToCustomize.trim() === '') {
        throw new Error('No text content found to customize');
      }

      const customizationPayload = {
        text: textToCustomize,
        software_experience: user.software_experience || 'intermediate',
        hardware_experience: user.hardware_experience || 'intermediate',
      };

      const response = await fetch('http://localhost:8000/customize_text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(customizationPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to customize content.');
      }

      const data: { customized_content: string } = await response.json();
      
      setCustomizedContent(data.customized_content);
      setIsContentCustomized(true);
      setTranslated(false); 
      setTranslatedContent('');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to customize content.';
      setPreferenceError(errorMessage);
    } finally {
      setIsCustomizing(false);
    }
  };

  const renderContent = () => {
    // Case 1: Customized Content is Active
    if (isContentCustomized && customizedContent) {
      // If the user also clicked "Translate" on the customized content
      if (translated && translatedContent) {
        return (
          <div 
            className={styles.urduContent}
            style={{ 
              direction: 'rtl', 
              textAlign: 'right',
              fontFamily: 'Noto Nastaliq Urdu, "Jameel Noori Nastaleeq", Arial, sans-serif',
              lineHeight: '2.2',
              fontSize: '1.15em',
              whiteSpace: 'pre-wrap'
            }}
          >
            {translatedContent}
          </div>
        );
      }
      // If just Customized (English Markdown)
      return (
        <div className={styles.customizedContent}>
          {/* ReactMarkdown converts the raw markdown string into HTML elements */}
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {customizedContent}
          </ReactMarkdown>
        </div>
      );
    }
    
    // Case 2: Original Content Translated
    if (translated && translatedContent) {
      return (
        <div 
          className={styles.urduContent}
          style={{ 
            direction: 'rtl', 
            textAlign: 'right',
            fontFamily: 'Noto Nastaliq Urdu, "Jameel Noori Nastaleeq", Arial, sans-serif',
            lineHeight: '2.2',
            fontSize: '1.15em',
            whiteSpace: 'pre-wrap'
          }}
        >
          {translatedContent}
        </div>
      );
    }
    
    // Case 3: Default Original Content
    return <div className={styles.englishContent}>{children}</div>;
  };

  const translateButtonText = () => {
    if (isLoading) return <span className={styles.buttonContent}><span className={styles.loader}></span>Translating...</span>;
    if (translated) return <span className={styles.buttonContent}><span className={styles.icon}>🇬🇧</span>Show English</span>;
    return <span className={styles.buttonContent}><span className={styles.icon}>🇵🇰</span>ترجمہ کریں (Urdu)</span>;
  };

  const customizeButtonText = () => {
    if (isCustomizing) return <span className={styles.buttonContent}><span className={styles.loader}></span>Customizing...</span>;
    if (isContentCustomized) return <span className={styles.buttonContent}><span className={styles.icon}>✨</span>Show Original</span>;
    return <span className={styles.buttonContent}><span className={styles.icon}>✨</span>Customize Content</span>;
  };

  return (
    <div className={styles.translatorWrapper}>
      <button
        className={styles.translateButton}
        onClick={handleTranslate}
        disabled={isLoading || isCustomizing || authLoading}
        aria-label={translated ? 'Switch to English' : 'Translate to Urdu'}
      >
        {translateButtonText()}
      </button>

      <button
        className={`${styles.translateButton} ${styles.customizeButton}`}
        onClick={handleCustomizeContent}
        // Button enabled only if user is logged in (user object exists)
        disabled={isLoading || isCustomizing || authLoading || !user}
        aria-label={isContentCustomized ? 'Show Original Content' : 'Customize Content according to preference'}
        style={{ marginLeft: '10px' }}
      >
        {customizeButtonText()}
      </button>

      {(error || preferenceError) && (
        <div className={styles.errorMessage}>
          <span>{error || preferenceError}</span>
          <button 
            onClick={error ? handleTranslate : () => {}} 
            className={styles.retryButton}
          >
            Retry
          </button>
        </div>
      )}
      
       {authLoading && (
        <div className={styles.loadingMessage}>
          <span>Loading user authentication...</span>
        </div>
      )}

      <div className={styles.content}>
        {renderContent()}
      </div>
    </div>
  );
}