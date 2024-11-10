import React, { useState } from 'react';
import './ContactForm.css';

const ContactForm: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});

    // Validation function
    const validateForm = () => {
        const newErrors: { name?: string; email?: string; message?: string } = {};
        if (!name) newErrors.name = 'Name is required';
        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        if (!message) newErrors.message = 'Message is required';
        return newErrors;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formErrors = validateForm();
        setErrors(formErrors);
        if (Object.keys(formErrors).length === 0) {
            setSubmitted(true);
            setName('');
            setEmail('');
            setMessage('');
        }
    };

    return (
        <div className="contact-form-container">
            {submitted ? (
                <p className="contact-form-success">
                    Thank you for your message! We'll get back to you soon.
                </p>
            ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                    <h2>Contact Us</h2>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className={errors.name ? 'input-error' : ''}
                        />
                        {errors.name && <span className="error-message">{errors.name}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className={errors.email ? 'input-error' : ''}
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="message">Message</label>
                        <textarea
                            id="message"
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            className={errors.message ? 'input-error' : ''}
                        />
                        {errors.message && <span className="error-message">{errors.message}</span>}
                    </div>
                    <button type="submit">Submit</button>
                </form>
            )}
        </div>
    );
};

export default ContactForm;
