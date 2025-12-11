import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { useHistory } from '@docusaurus/router';
import { useAuth } from '../../context/AuthContext';
import styles from './styles.module.css'; 

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // New State for Experience Levels
  const [softwareExp, setSoftwareExp] = useState('beginner');
  const [hardwareExp, setHardwareExp] = useState('beginner');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const history = useHistory();
  const { login, register } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Use the register method from useAuth
      await register({
        name,
        email,
        password,
        software_experience: softwareExp,
        hardware_experience: hardwareExp
      });

      // Auto login after success
      await login(email, password);
      history.push('/docs/chapter-1-physical-ai');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Sign Up">
      <div className={styles.authWrapper}>
        <div className={styles.authCard}>
          <h1 className={styles.authTitle}>Create Account</h1>
          
          <form onSubmit={handleRegister}>
            {/* Name Field */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Full Name</label>
              <input 
                type="text" 
                required
                placeholder="John Doe"
                className={styles.input}
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
            </div>

            {/* Software Experience Dropdown */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Software Experience</label>
              <select 
                className={styles.input} 
                value={softwareExp}
                onChange={(e) => setSoftwareExp(e.target.value)}
              >
                <option value="beginner">Beginner (New to coding)</option>
                <option value="intermediate">Intermediate (Comfortable with Python)</option>
                <option value="experienced">Experienced (Professional Dev)</option>
              </select>
            </div>

            {/* Hardware Experience Dropdown */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Hardware Experience</label>
              <select 
                className={styles.input} 
                value={hardwareExp}
                onChange={(e) => setHardwareExp(e.target.value)}
              >
                <option value="beginner">Beginner (Never used GPIO/Sensors)</option>
                <option value="intermediate">Intermediate (Arduino/RPi)</option>
                <option value="experienced">Experienced (PCB Design/Embedded)</option>
              </select>
            </div>

            {/* Email Field */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Email Address</label>
              <input 
                type="email" 
                required
                placeholder="name@example.com"
                className={styles.input}
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>

            {/* Password Field */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Password</label>
              <input 
                type="password" 
                required
                placeholder="••••••••"
                className={styles.input}
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>

            {error && <div className={styles.errorMessage}>{error}</div>}

            <button 
              type="submit" 
              disabled={loading}
              className={`button button--primary button--block ${styles.submitButton}`}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div className={styles.linkText}>
            Already have an account? <Link to="/login">Login here</Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}