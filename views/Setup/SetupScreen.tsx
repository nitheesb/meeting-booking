
import React from 'react';
import { LayoutGrid } from 'lucide-react';
import { Room } from '../../types';
import { THEME } from '../../constants';

interface SetupScreenProps {
    rooms: Room[];
    onSelectRoom: (id: string) => void;
    onSelectAdmin: () => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ rooms, onSelectRoom, onSelectAdmin }) => (
    <div style={{ height: '100vh', backgroundColor: '#111', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', width: '100%', maxWidth: '800px' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 300, marginBottom: '60px' }}>Configure Display</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', padding: '0 20px' }}>
                {rooms.map(r => (
                    <button key={r.id} onClick={() => onSelectRoom(r.id)} style={{
                        padding: '40px 20px', backgroundColor: '#222', border: '2px solid transparent', borderRadius: '16px', color: 'white',
                        cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px'
                    }}
                    onMouseOver={e => e.currentTarget.style.borderColor = THEME.green}
                    onMouseOut={e => e.currentTarget.style.borderColor = 'transparent'}
                    >
                        <LayoutGrid size={40} color={THEME.green} />
                        <span style={{ fontSize: '1.2rem', fontWeight: 500 }}>{r.name}</span>
                    </button>
                ))}
            </div>
            <button onClick={onSelectAdmin} style={{ marginTop: '60px', background: 'transparent', border: '1px solid #444', color: '#888', padding: '10px 30px', borderRadius: '30px', cursor: 'pointer' }}>
                System Admin
            </button>
        </div>
    </div>
);
