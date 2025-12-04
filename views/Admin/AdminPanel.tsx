
import React, { useState } from 'react';
import { Room, Meeting } from '../../types';
import { COLORS } from '../../constants';
import { LogOut, Settings, RefreshCw, Trash2, Calendar } from 'lucide-react';
import { Modal } from '../../components/Modal';

interface AdminPanelProps {
  rooms: Room[];
  onUpdateRooms: (rooms: Room[]) => void;
  onLogout: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ rooms, onUpdateRooms, onLogout }) => {
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  
  // Helpers
  const updateRoom = (id: string, updates: Partial<Room>) => {
    const updated = rooms.map(r => r.id === id ? { ...r, ...updates } : r);
    onUpdateRooms(updated);
  };

  const editingRoom = rooms.find(r => r.id === editingRoomId);

  return (
    <div style={{ minHeight: '100vh', background: '#f4f4f4', color: '#333' }}>
      
      {/* Admin Header */}
      <div style={{ background: 'white', padding: '20px 40px', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
           <h1 style={{ margin: 0, fontSize: '24px' }}>System Administration</h1>
           <div style={{ color: '#666', fontSize: '14px' }}>Manage devices and integrations</div>
        </div>
        <button onClick={onLogout} style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '10px 20px', border: '1px solid #ccc', borderRadius: '6px', background: 'white', cursor: 'pointer' }}>
          <LogOut size={16} /> Logout
        </button>
      </div>

      {/* Grid */}
      <div style={{ padding: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px' }}>
        {rooms.map(room => (
          <div key={room.id} style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
               <h3 style={{ margin: 0 }}>{room.name}</h3>
               <button onClick={() => setEditingRoomId(room.id)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#666' }}>
                 <Settings size={20} />
               </button>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                 <Calendar size={16} color="#666" />
                 <span style={{ fontSize: '14px', color: '#666' }}>
                    {room.settings.googleCalendarId ? 'Google Calendar Synced' : 'Local Mock Data'}
                 </span>
              </div>
              <div style={{ fontSize: '12px', color: '#999' }}>ID: {room.id}</div>
              
              <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                 <button 
                   onClick={() => updateRoom(room.id, { schedule: [] })}
                   style={{ flex: 1, padding: '8px', border: '1px solid #fee', background: '#fff5f5', color: '#c00', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                   <Trash2 size={14} /> Clear
                 </button>
                 <button 
                   onClick={() => window.alert('In a real app, this would re-fetch from Google API')}
                   style={{ flex: 1, padding: '8px', border: '1px solid #eee', background: '#f9f9f9', color: '#333', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                   <RefreshCw size={14} /> Sync
                 </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Configuration Modal */}
      {editingRoom && (
        <Modal title={`Configure ${editingRoom.name}`} onClose={() => setEditingRoomId(null)}>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: '#ccc' }}>Room Name</label>
                <input 
                  value={editingRoom.name}
                  onChange={e => updateRoom(editingRoom.id, { name: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <div style={{ borderTop: '1px solid #444', paddingTop: '15px' }}>
                <label style={{ display: 'block', marginBottom: '10px', color: COLORS.green, fontWeight: 'bold' }}>Google Integration</label>
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#888', fontSize: '12px' }}>Calendar ID</label>
                  <input 
                    placeholder="example@group.calendar.google.com"
                    value={editingRoom.settings.googleCalendarId || ''}
                    onChange={e => updateRoom(editingRoom.id, { settings: { ...editingRoom.settings, googleCalendarId: e.target.value }})}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#888', fontSize: '12px' }}>API Key (Service Account)</label>
                  <input 
                    type="password"
                    placeholder="AIzaSy..."
                    value={editingRoom.settings.googleApiKey || ''}
                    onChange={e => updateRoom(editingRoom.id, { settings: { ...editingRoom.settings, googleApiKey: e.target.value }})}
                    style={inputStyle}
                  />
                </div>
              </div>
              <button onClick={() => setEditingRoomId(null)} style={{ marginTop: '10px', padding: '12px', background: COLORS.green, border: 'none', color: 'white', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                Save Configuration
              </button>
           </div>
        </Modal>
      )}

    </div>
  );
};

const inputStyle = {
  width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #555', background: '#222', color: 'white'
};
