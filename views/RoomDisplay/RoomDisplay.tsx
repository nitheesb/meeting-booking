
import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { Room, Meeting } from '../../types';
import { THEME } from '../../constants';
import { formatTime, getCurrentMeeting, getNextMeeting } from '../../utils';
import { Timeline } from '../../components/Timeline';
import { BusyView } from './BusyView';
import { FreeView } from './FreeView';

interface RoomDisplayProps {
    room: Room;
    onExit: () => void;
    onUpdateRoom: (r: Room) => void;
}

export const RoomDisplay: React.FC<RoomDisplayProps> = ({ room, onExit, onUpdateRoom }) => {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 30000); // Update every 30s
        return () => clearInterval(timer);
    }, []);

    const currentMeeting = getCurrentMeeting(room.schedule, now);
    const nextMeeting = getNextMeeting(room.schedule, now);
    const isBusy = !!currentMeeting;

    const handleQuickBook = (minutes: number) => {
        const start = new Date(now);
        start.setSeconds(0, 0);
        const end = new Date(start.getTime() + minutes * 60000);
        
        const newMeeting: Meeting = {
            id: Math.random().toString(36).substr(2, 9),
            title: 'Ad-hoc Booking',
            host: 'Walk-in',
            startTime: start,
            endTime: end,
            type: 'ad-hoc'
        };

        onUpdateRoom({ ...room, schedule: [...room.schedule, newMeeting] });
    };

    const handleEndEarly = () => {
        if (!currentMeeting) return;
        const confirm = window.confirm("Are you sure you want to end this meeting?");
        if (!confirm) return;

        const updatedSchedule = room.schedule.map(m => 
            m.id === currentMeeting.id ? { ...m, endTime: new Date() } : m
        );
        onUpdateRoom({ ...room, schedule: updatedSchedule });
    };

    const handleExtend = (minutes: number) => {
        if (!currentMeeting) return;
        const newEnd = new Date(currentMeeting.endTime.getTime() + minutes * 60000);
        
        const updatedSchedule = room.schedule.map(m => 
            m.id === currentMeeting.id ? { ...m, endTime: newEnd } : m
        );
        onUpdateRoom({ ...room, schedule: updatedSchedule });
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: THEME.bg, color: 'white' }}>
            {/* Top Bar */}
            <div style={{ 
                height: '80px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                padding: '0 40px', backgroundColor: THEME.panel, borderBottom: `1px solid ${THEME.border}`,
                flexShrink: 0
            }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 500 }}>{room.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 300, fontFamily: 'monospace' }}>{formatTime(now)}</div>
                    <button onClick={onExit} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', padding: '10px' }}>
                        <Settings />
                    </button>
                </div>
            </div>

            {/* Main Stage */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
                {isBusy ? (
                    <BusyView 
                        meeting={currentMeeting} 
                        nextMeeting={nextMeeting} 
                        onEndEarly={handleEndEarly}
                        onExtend={handleExtend}
                    />
                ) : (
                    <FreeView 
                        nextMeeting={nextMeeting} 
                        onBook={handleQuickBook} 
                    />
                )}
            </div>

            {/* LED Status Bar */}
            <div style={{ height: '12px', width: '100%', backgroundColor: isBusy ? THEME.red : THEME.green, boxShadow: `0 -5px 20px ${isBusy ? THEME.redDark : THEME.greenDark}`, flexShrink: 0, zIndex: 5 }} />

            {/* Timeline */}
            <Timeline schedule={room.schedule} now={now} />
        </div>
    );
};
