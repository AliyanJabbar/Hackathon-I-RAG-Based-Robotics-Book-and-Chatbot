import React from 'react';
import styles from './styles.module.css';
import { FaUsers, FaTrophy, FaStar, FaRobot } from 'react-icons/fa';

const stats = [
    {
        icon: FaUsers,
        number: '5,000+',
        label: 'Students Enrolled',
    },
    {
        icon: FaTrophy,
        number: '87%',
        label: 'Completion Rate',
    },
    {
        icon: FaStar,
        number: '4.8/5.0',
        label: 'Average Rating',
    },
    {
        icon: FaRobot,
        number: '1,200+',
        label: 'Projects Built',
    },
];

export default function StatsSection() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <span className={styles.tagline}>Our Impact</span>
                    <h2 className={styles.title}>Trusted by Thousands of Students</h2>
                </div>
                <div className={styles.statsGrid}>
                    {stats.map((stat, idx) => {
                        const Icon = stat.icon;
                        return (
                            <div key={idx} className={styles.statCard}>
                                <div className={styles.iconContainer}>
                                    <Icon className={styles.icon} />
                                </div>
                                <div className={styles.number}>{stat.number}</div>
                                <div className={styles.label}>{stat.label}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
