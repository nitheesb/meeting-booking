
import React, { useState, useEffect } from 'react';
import { Settings, Plus, X, ArrowRight } from 'lucide-react';
import { Room, Meeting } from '../../types';
import { COLORS } from '../../constants';
import { isBusyAtTime, getNextMeeting, formatTime } from '../../utils';
import { Timeline } from '../../components/Timeline';
import { Modal } from '../../components/Modal';

interface RoomDisplayProps {
  room: Room;
  onExit: () => void;
  onUpdateSchedule: (newSchedule: Meeting[]) => void;
}

export const RoomDisplay: React.FC<RoomDisplayProps> = ({ room, onExit, onUpdateSchedule }) => {
  const [now, setNow] = useState(new Date());
  const [showExtendModal, setShowExtendModal] = useState(false);

  // Timer to update "Now"
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);

  const currentMeeting = isBusyAtTime(room.schedule, now);
  const nextMeeting = getNextMeeting(room.schedule, now);
  const isBusy = !!currentMeeting;

  // Handlers
  const handleQuickBook = (minutes: number) => {
    const start = new Date(now);
    const end = new Date(now.getTime() + minutes * 60000);
    
    const newMeeting: Meeting = {
      id: Math.random().toString(36),
      title: 'Walk-in Booking',
      host: 'Ad-hoc',
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      type: 'ad-hoc'
    };
    
    onUpdateSchedule([...room.schedule, newMeeting]);
  };

  const handleEndEarly = () => {
    if (!currentMeeting) return;
    // Effectively sets the end time to now
    const updatedSchedule = room.schedule.map(m => 
      m.id === currentMeeting.id ? { ...m, endTime: new Date().toISOString() } : m
    );
    onUpdateSchedule(updatedSchedule);
  };

  const handleExtend = (minutes: number) => {
    if (!currentMeeting) return;
    const currentEnd = new Date(currentMeeting.endTime);
    const newEnd = new Date(currentEnd.getTime() + minutes * 60000);
    
    const updatedSchedule = room.schedule.map(m => 
      m.id === currentMeeting.id ? { ...m, endTime: newEnd.toISOString() } : m
    );
    onUpdateSchedule(updatedSchedule);
    setShowExtendModal(false);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: COLORS.bg, overflow: 'hidden' }}>
      
      {/* Header */}
      <div style={{ height: '80px', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 40px', background: COLORS.panel }}>
        <h1 style={{ color: 'white', margin: 0, fontSize: '24px', fontWeight: 500 }}>{room.name}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ color: 'white', fontSize: '28px', fontWeight: 300 }}>{formatTime(now)}</span>
          <button onClick={onExit} style={{ background: 'none', border: 'none', color: COLORS.textDim, cursor: 'pointer' }}><Settings /></button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 60px' }}>
        
        {/* Status Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
          <div style={{ 
            width: '12px', height: '12px', borderRadius: '50%', 
            background: isBusy ? COLORS.red : COLORS.green,
            boxShadow: `0 0 15px ${isBusy ? COLORS.red : COLORS.green}`
          }} />
          <span style={{ 
            color: isBusy ? COLORS.red : COLORS.green, 
            fontSize: '20px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' 
          }}>
            {isBusy ? 'In Progress' : 'Available'}
          </span>
        </div>

        {/* Meeting Details / Availability Info */}
        {isBusy && currentMeeting ? (
          <div>
            <h2 style={{ color: 'white', fontSize: '64px', margin: '0 0 10px 0', lineHeight: 1.1 }}>{currentMeeting.title}</h2>
            <div style={{ color: COLORS.textDim, fontSize: '24px', marginBottom: '40px' }}>
              {formatTime(currentMeeting.startTime)} — {formatTime(currentMeeting.endTime)} • Hosted by {currentMeeting.host}
            </div>
            
            {/* Busy Actions */}
            <div style={{ display: 'flex', gap: '20px', maxWidth: '600px' }}>
              <button onClick={handleEndEarly} style={btnStyle('secondary')}>
                <X size={24} /> End
              </button>
              <button onClick={() => setShowExtendModal(true)} style={btnStyle('primary')}>
                Extend <ArrowRight size={24} />
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h2 style={{ color: 'white', fontSize: '64px', margin: '0 0 10px 0', lineHeight: 1.1 }}>Room is free</h2>
            <div style={{ color: COLORS.textDim, fontSize: '24px', marginBottom: '40px' }}>
              {nextMeeting 
                ? `Available until ${formatTime(nextMeeting.startTime)}`
                : 'Available for the rest of the day'}
            </div>

            {/* Free Actions */}
            <div style={{ display: 'flex', gap: '20px' }}>
               {[15, 30, 60].map(mins => (
                 <button key={mins} onClick={() => handleQuickBook(mins)} style={bookBtnStyle}>
                   <div style={{ fontSize: '14px', textTransform: 'uppercase', opacity: 0.8 }}>Book</div>
                   <div style={{ fontSize: '42px', fontWeight: 'bold' }}>{mins}</div>
                   <div style={{ fontSize: '14px' }}>minutes</div>
                 </button>
               ))}
            </div>
          </div>
        )}

        {/* Next Meeting Preview */}
        <div style={{ marginTop: 'auto', marginBottom: '30px', paddingTop: '20px', borderTop: `1px solid ${COLORS.border}` }}>
          <span style={{ color: COLORS.textDark, textTransform: 'uppercase', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>Up Next</span>
          {nextMeeting ? (
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <span style={{ color: 'white', fontSize: '18px', fontWeight: 500 }}>{nextMeeting.title}</span>
                <span style={{ color: 'white', fontSize: '18px', fontFamily: 'monospace' }}>{formatTime(nextMeeting.startTime)} - {formatTime(nextMeeting.endTime)}</span>
             </div>
          ) : (
            <div style={{ color: COLORS.textDim, marginTop: '10px' }}>No upcoming meetings</div>
          )}
        </div>

      </div>

      {/* LED Bar */}
      <div style={{ height: '8px', background: isBusy ? COLORS.red : COLORS.green, boxShadow: `0 -5px 20px ${isBusy ? COLORS.redGlow : COLORS.greenGlow}` }} />

      {/* Timeline Component */}
      <Timeline schedule={room.schedule} currentTime={now} />

      {/* Modals */}
      {showExtendModal && (
        <Modal title="Extend Meeting" onClose={() => setShowExtendModal(false)}>
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              {[15, 30, 45, 60].map(m => (
                <button key={m} onClick={() => handleExtend(m)} style={btnStyle('secondary')}>
                  +{m} min
                </button>
              ))}
           </div>
        </Modal>
      )}

    </div>
  );
};

// Styles
const btnStyle = (variant: 'primary' | 'secondary'): React.CSSProperties => ({
  flex: 1,
  padding: '20px',
  borderRadius: '12px',
  border: variant === 'secondary' ? `1px solid ${COLORS.border}` : 'none',
  background: variant === 'secondary' ? 'rgba(255,255,255,0.05)' : COLORS.red,
  color: 'white',
  fontSize: '18px',
  fontWeight: 600,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px'
});

const bookBtnStyle: React.CSSProperties = {
  width: '140px',
  height: '140px',
  borderRadius: '16px',
  background: COLORS.green,
  border: 'none',
  color: 'white',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: `0 10px 30px -5px ${COLORS.greenGlow}`
};
