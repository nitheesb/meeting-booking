
import React, { useState } from 'react';
import { LogOut, Settings, CheckCircle, RefreshCw, Power } from 'lucide-react';
import { Room } from '../../types';
import { THEME } from '../../constants';
import { getCurrentMeeting, generateSchedule, formatTime } from '../../utils';
import { RoomConfigModal } from './RoomConfigModal';

interface AdminPanelProps {
    rooms: Room[];
    onLogout: () => void;
    onUpdateRoom: (r: Room) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ rooms, onLogout, onUpdateRoom }) => {
    const [editingRoom, setEditingRoom] = useState<Room | null>(null);

    const handleResetRoom = (room: Room) => {
        if (window.confirm(`Reset schedule for ${room.name}?`)) {
            onUpdateRoom({ ...room, schedule: generateSchedule(new Date()) });
        }
    };

    const handleClearRoom = (room: Room) => {
        if (window.confirm(`Clear ALL meetings for ${room.name}?`)) {
            onUpdateRoom({ ...room, schedule: [] });
        }
    };

    return (
        <div style={{ padding: '40px', backgroundColor: '#f5f5f5', minHeight: '100vh', color: '#333', overflowY: 'auto' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '2.5rem', color: '#111' }}>System Administration</h1>
                        <p style={{ margin: '10px 0 0', color: '#666' }}>Manage room schedules and device settings</p>
                    </div>
                    <button onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px', backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                        <LogOut size={20} /> Logout
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px' }}>
                    {rooms.map(room => {
                        const now = new Date();
                        const current = getCurrentMeeting(room.schedule, now);
                        const isConfigured = room.calendarId && room.calendarId.length > 0;
                        
                        return (
                            <div key={room.id} style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                                <div style={{ padding: '24px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1.3rem' }}>{room.name}</h3>
                                        <div style={{ fontSize: '0.9rem', color: '#888', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            {isConfigured ? (
                                                <span style={{ color: THEME.greenDark, display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={12}/> Synced</span>
                                            ) : (
                                                <span style={{ color: '#999' }}>Local Mode</span>
                                            )}
                                            <span>•</span>
                                            Capacity: {room.capacity}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                         <button 
                                            onClick={() => setEditingRoom(room)}
                                            style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ddd', backgroundColor: 'white', cursor: 'pointer', color: '#666' }}>
                                            <Settings size={20} />
                                         </button>
                                         <div style={{ 
                                            padding: '8px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600,
                                            backgroundColor: current ? '#ffebee' : '#e8f5e9', color: current ? '#c62828' : '#2e7d32',
                                            display: 'flex', alignItems: 'center'
                                         }}>
                                            {current ? 'BUSY' : 'FREE'}
                                        </div>
                                    </div>
                                </div>
                                
                                <div style={{ padding: '24px', minHeight: '150px' }}>
                                    <h4 style={{ margin: '0 0 15px 0', fontSize: '0.9rem', textTransform: 'uppercase', color: '#999' }}>Today's Schedule</h4>
                                    {room.schedule.length === 0 ? (
                                        <div style={{ color: '#ccc', fontStyle: 'italic' }}>No meetings scheduled</div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            {room.schedule.sort((a,b) => a.startTime.getTime() - b.startTime.getTime()).map(m => (
                                                <div key={m.id} style={{ display: 'flex', gap: '10px', fontSize: '0.9rem', alignItems: 'center' }}>
                                                    <div style={{ fontFamily: 'monospace', fontWeight: 600, color: '#333' }}>
                                                        {formatTime(m.startTime)}
                                                    </div>
                                                    <div style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#666' }}>
                                                        {m.title}
                                                    </div>
                                                    {m.type === 'ad-hoc' && <span style={{ fontSize: '0.7rem', backgroundColor: '#e3f2fd', color: '#1565c0', padding: '2px 6px', borderRadius: '4px' }}>Ad-hoc</span>}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div style={{ padding: '16px 24px', backgroundColor: '#fafafa', borderTop: '1px solid #eee', display: 'flex', gap: '10px' }}>
                                    <button 
                                        onClick={() => handleResetRoom(room)}
                                        style={{ flex: 1, padding: '10px', border: '1px solid #ddd', background: 'white', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', color: '#555' }}>
                                        <RefreshCw size={16} /> Reset
                                    </button>
                                    <button 
                                        onClick={() => handleClearRoom(room)}
                                        style={{ flex: 1, padding: '10px', border: '1px solid #ddd', background: 'white', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', color: '#d32f2f' }}>
                                        <Power size={16} /> Clear
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            
            {editingRoom && (
                <RoomConfigModal 
                    room={editingRoom} 
                    onSave={onUpdateRoom} 
                    onClose={() => setEditingRoom(null)} 
                />
            )}
        </div>
    );
};
