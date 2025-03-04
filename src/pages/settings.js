// pages/settings.js
import { useState } from 'react';

export default function Settings() {
    const [keywords, setKeywords] = useState('');
    const [minDonate, setMinDonate] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        const response = await fetch('/api/saveSettings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ keywords, minDonate }),
        });

        const data = await response.json();
        if (data.success) {
            setMessage('Settings saved successfully!');
            setKeywords('');
            setMinDonate('');
        } else {
            setMessage(data.message);
        }
    };

    return (
        <div>
            <h1>Save Settings</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Keywords:</label>
                    <input
                        type="text"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Minimum Donation:</label>
                    <input
                        type="text"
                        value={minDonate}
                        onChange={(e) => setMinDonate(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Save Settings</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}
