import React, { useState } from 'react';
import styles from './styles.module.css';
import { FaPlus, FaMinus } from 'react-icons/fa';

const faqs = [
    {
        question: 'Do I need prior robotics experience?',
        answer: 'No! This course starts from fundamentals. If you know basic Python and math, you\'re ready to begin.',
    },
    {
        question: 'What software do I need?',
        answer: 'You\'ll need Docker, a code editor (VS Code recommended), and access to NVIDIA Isaac Sim (free for educational use). We provide setup guides for all platforms.',
    },
    {
        question: 'How long does the course take?',
        answer: 'At a comfortable pace of 10-15 hours per week, most students complete the course in 3-4 months. You can go faster or slower based on your schedule.',
    },
    {
        question: 'Do I need expensive hardware?',
        answer: 'No physical robot is required! We use simulation environments (Isaac Sim, Gazebo) for all exercises. You\'ll need a computer with a decent GPU (GTX 1060 or better recommended).',
    },
    {
        question: 'Is there a community or support?',
        answer: 'Yes! You get access to our Discord community, weekly office hours, and the RAG AI assistant trained on all course materials.',
    },
    {
        question: 'What can I build after this course?',
        answer: 'You\'ll be able to design, simulate, and control humanoid robots. Skills include URDF modeling, inverse kinematics, MPC control, vision systems, and ROS2 integration.',
    },
];

export default function FaqSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <span className={styles.tagline}>FAQ</span>
                    <h2 className={styles.title}>Frequently Asked Questions</h2>
                    <p className={styles.subtitle}>
                        Everything you need to know about the course
                    </p>
                </div>
                <div className={styles.faqList}>
                    {faqs.map((faq, idx) => (
                        <div key={idx} className={styles.faqItem}>
                            <button
                                className={styles.faqQuestion}
                                onClick={() => toggleFaq(idx)}
                                aria-expanded={openIndex === idx}
                            >
                                <span className={styles.questionText}>{faq.question}</span>
                                <span className={styles.icon}>
                                    {openIndex === idx ? <FaMinus /> : <FaPlus />}
                                </span>
                            </button>
                            <div
                                className={`${styles.faqAnswer} ${openIndex === idx ? styles.open : ''
                                    }`}
                            >
                                <p>{faq.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
