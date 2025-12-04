
import React, { useState, useMemo } from 'react';
import { Room, ViewMode } from './types';
import { INITIAL_ROOMS } from './utils';
import { RoomDisplay } from './views/RoomDisplay/RoomDisplay';
import { AdminPanel } from './views/Admin/AdminPanel';
import { SetupScreen } from './views/Setup/SetupScreen';
import { AdminLogin } from './views/Setup/AdminLogin';

export const App = () => {
    const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
    const [view, setView] = useState<ViewMode>('SETUP');
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

    const selectedRoom = useMemo(() => rooms.find(r => r.id === selectedRoomId), [rooms, selectedRoomId]);

    const handleUpdateRoom = (updatedRoom: Room) => {
        setRooms(prev => prev.map(r => r.id === updatedRoom.id ? updatedRoom : r));
    };

    switch (view) {
        case 'DISPLAY':
            return selectedRoom ? <RoomDisplay room={selectedRoom} onExit={() => setView('SETUP')} onUpdateRoom={handleUpdateRoom} /> : null;
        case 'ADMIN':
            return <AdminPanel rooms={rooms} onLogout={() => setView('SETUP')} onUpdateRoom={handleUpdateRoom} />;
        case 'ADMIN_LOGIN':
            return <AdminLogin onLogin={() => setView('ADMIN')} onCancel={() => setView('SETUP')} />;
        default:
            return <SetupScreen rooms={rooms} onSelectRoom={id => { setSelectedRoomId(id); setView('DISPLAY'); }} onSelectAdmin={() => setView('ADMIN_LOGIN')} />;
    }
};
