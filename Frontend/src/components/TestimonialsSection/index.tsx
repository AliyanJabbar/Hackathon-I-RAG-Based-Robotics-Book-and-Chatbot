import React from 'react';
import styles from './styles.module.css';
import { FaUserCircle } from 'react-icons/fa';

const testimonials = [
    {
        name: 'Sarah Chen',
        role: 'Robotics Engineer',
        quote: 'This course transformed my understanding of humanoid robotics. The RAG AI assistant was invaluable for debugging complex kinematics issues.',
    },
    {
        name: 'Marcus Johnson',
        role: 'Graduate Student',
        quote: 'From zero robotics knowledge to building a walking robot in 3 months. The curriculum is perfectly structured and the community is amazing.',
    },
    {
        name: 'Priya Patel',
        role: 'Software Developer',
        quote: 'The hands-on approach with ROS2 and Isaac Sim gave me real-world skills I use daily in my robotics startup.',
    },
];

export default function TestimonialsSection() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <span className={styles.tagline}>Student Success</span>
                    <h2 className={styles.title}>What Our Students Say</h2>
                    <p className={styles.subtitle}>
                        Join thousands of students who have transformed their robotics skills
                    </p>
                </div>
                <div className={styles.testimonialsGrid}>
                    {testimonials.map((testimonial, idx) => (
                        <div key={idx} className={styles.testimonialCard}>
                            <div className={styles.quoteIcon}>"</div>
                            <p className={styles.quote}>{testimonial.quote}</p>
                            <div className={styles.author}>
                                <div className={styles.avatarContainer}>
                                    <FaUserCircle className={styles.avatar} />
                                </div>
                                <div className={styles.authorInfo}>
                                    <div className={styles.name}>{testimonial.name}</div>
                                    <div className={styles.role}>{testimonial.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
