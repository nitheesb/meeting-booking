
import { useState } from 'react';
import { Room, AppView } from './types';
import { generateMockSchedule } from './utils';
import { SetupScreen } from './views/Setup/SetupScreen';
import { AdminLogin } from './views/Setup/AdminLogin';
import { AdminPanel } from './views/Admin/AdminPanel';
import { RoomDisplay } from './views/RoomDisplay/RoomDisplay';

// Initial State Bootstrapper
const INITIAL_ROOMS: Room[] = Array.from({ length: 6 }, (_, i) => ({
  id: `room-${i + 1}`,
  name: `Meeting Room ${i + 1}`,
  capacity: 8,
  status: 'available',
  schedule: generateMockSchedule(new Date()),
  settings: {}
}));

export const App = () => {
  const [view, setView] = useState<AppView>('SETUP');
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);

  const activeRoom = rooms.find(r => r.id === activeRoomId);

  const handleUpdateSchedule = (roomId: string, newSchedule: any[]) => {
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, schedule: newSchedule } : r));
  };

  switch (view) {
    case 'DISPLAY':
      if (!activeRoom) return <div>Error: Room not found</div>;
      return (
        <RoomDisplay 
          room={activeRoom} 
          onExit={() => setView('SETUP')}
          onUpdateSchedule={(s) => handleUpdateSchedule(activeRoom.id, s)}
        />
      );

    case 'ADMIN_LOGIN':
      return <AdminLogin onCancel={() => setView('SETUP')} onLogin={() => setView('ADMIN')} />;

    case 'ADMIN':
      return <AdminPanel rooms={rooms} onUpdateRooms={setRooms} onLogout={() => setView('SETUP')} />;

    case 'SETUP':
    default:
      return (
        <SetupScreen 
          rooms={rooms} 
          onSelectRoom={(id) => { setActiveRoomId(id); setView('DISPLAY'); }}
          onSelectAdmin={() => setView('ADMIN_LOGIN')}
        />
      );
  }
};
