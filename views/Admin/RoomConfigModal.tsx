import React, { useState } from 'react';
import { Save, Link } from 'lucide-react';
import { Room } from '../../types';
import { THEME } from '../../constants';
import { Modal } from '../../components/Modal';

interface RoomConfigModalProps {
    room: Room;
    onSave: (r: Room) => void;
    onClose: () => void;
}

export const RoomConfigModal: React.FC<RoomConfigModalProps> = ({ room, onSave, onClose }) => {
    const [name, setName] = useState(room.name);
    const [capacity, setCapacity] = useState(room.capacity);
    const [calendarId, setCalendarId] = useState(room.settings.googleCalendarId || '');
    const [apiKey, setApiKey] = useState(room.settings.googleApiKey || '');

    const handleSave = () => {
        onSave({ 
            ...room, 
            name, 
            capacity, 
            settings: {
                ...room.settings,
                googleCalendarId: calendarId,
                googleApiKey: apiKey
            }
        });
        onClose();
    };

    return (
        <Modal title="Room Configuration" onClose={onClose}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'white' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#aaa', fontSize: '0.9rem' }}>Room Name</label>
                    <input 
                        value={name} onChange={e => setName(e.target.value)}
                        style={{ width: '100%', padding: '12px', backgroundColor: '#333', border: '1px solid #555', borderRadius: '8px', color: 'white', fontSize: '1rem', boxSizing: 'border-box' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#aaa', fontSize: '0.9rem' }}>Capacity</label>
                    <input 
                        type="number" value={capacity} onChange={e => setCapacity(Number(e.target.value))}
                        style={{ width: '100%', padding: '12px', backgroundColor: '#333', border: '1px solid #555', borderRadius: '8px', color: 'white', fontSize: '1rem', boxSizing: 'border-box' }}
                    />
                </div>
                
                <div style={{ borderTop: '1px solid #444', paddingTop: '20px', marginTop: '10px' }}>
                    <h4 style={{ margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Link size={18} /> Google Calendar Integration
                    </h4>
                    
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#aaa', fontSize: '0.9rem' }}>Calendar ID</label>
                        <input 
                            placeholder="e.g. c_12345abcde@group.calendar.google.com"
                            value={calendarId} onChange={e => setCalendarId(e.target.value)}
                            style={{ width: '100%', padding: '12px', backgroundColor: '#333', border: '1px solid #555', borderRadius: '8px', color: 'white', fontSize: '1rem', fontFamily: 'monospace', boxSizing: 'border-box' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#aaa', fontSize: '0.9rem' }}>Service Account API Key</label>
                        <input 
                            type="password"
                            placeholder="••••••••••••••••"
                            value={apiKey} onChange={e => setApiKey(e.target.value)}
                            style={{ width: '100%', padding: '12px', backgroundColor: '#333', border: '1px solid #555', borderRadius: '8px', color: 'white', fontSize: '1rem', fontFamily: 'monospace', boxSizing: 'border-box' }}
                        />
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '10px', fontStyle: 'italic' }}>
                        Note: Entering credentials here is for demonstration. In a production app, use a secure backend proxy.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    <button onClick={onClose} style={{ flex: 1, padding: '14px', backgroundColor: 'transparent', border: '1px solid #555', color: '#ccc', borderRadius: '8px', cursor: 'pointer' }}>
                        Cancel
                    </button>
                    <button onClick={handleSave} style={{ flex: 1, padding: '14px', backgroundColor: THEME.green, border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <Save size={18} /> Save Settings
                    </button>
                </div>
            </div>
        </Modal>
    );
};