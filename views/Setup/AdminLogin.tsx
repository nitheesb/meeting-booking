
import React, { useState } from 'react';
import { THEME } from '../../constants';

interface AdminLoginProps {
    onLogin: () => void;
    onCancel: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onCancel }) => {
    const [pin, setPin] = useState('');
    return (
        <div style={{ height: '100vh', backgroundColor: '#000', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '300px', textAlign: 'center' }}>
                <h2 style={{ fontWeight: 300, marginBottom: '30px' }}>Enter PIN</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input type="password" autoFocus value={pin} onChange={e => setPin(e.target.value)} 
                        style={{ padding: '20px', fontSize: '1.5rem', textAlign: 'center', borderRadius: '12px', border: 'none', backgroundColor: '#222', color: 'white' }}
                        placeholder="••••"
                    />
                    <button onClick={() => pin === 'admin' ? onLogin() : alert('Try "admin"')} style={{ padding: '20px', borderRadius: '12px', border: 'none', backgroundColor: THEME.green, color: 'white', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}>
                        Unlock
                    </button>
                    <button onClick={onCancel} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>Cancel</button>
                </div>
            </div>
        </div>
    );
};
