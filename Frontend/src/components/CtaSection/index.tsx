import React from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';
import { useChat } from '@site/src/context/chatContext';

export default function CtaSection() {
    const { openWithText } = useChat();

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.blob1} />
                <div className={styles.blob2} />
                <div className={styles.content}>
                    <h2 className={styles.title}>
                        Ready to Build Your First Humanoid Robot?
                    </h2>
                    <p className={styles.subtitle}>
                        Join thousands of students mastering robotics with AI-powered learning
                    </p>
                    <div className={styles.buttons}>
                        <Link
                            className="button button--primary button--lg"
                            to="docs/chapter-1-physical-ai"
                        >
                            Start Learning Now
                        </Link>
                        <button
                            className="button button--secondary button--lg"
                            onClick={() => openWithText('')}
                        >
                            Talk to AI Assistant
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
