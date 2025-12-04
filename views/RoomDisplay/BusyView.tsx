import React, { useState } from 'react';
import { User, X, ChevronRight, AlertCircle } from 'lucide-react';
import { Meeting } from '../../types';
import { THEME } from '../../constants';
import { formatTime } from '../../utils';
import { Modal } from '../../components/Modal';

interface BusyViewProps {
    meeting: Meeting;
    nextMeeting?: Meeting;
    onEndEarly: () => void;
    onExtend: (mins: number) => void;
}

export const BusyView: React.FC<BusyViewProps> = ({ meeting, nextMeeting, onEndEarly, onExtend }) => {
    const [showExtendModal, setShowExtendModal] = useState(false);

    const maxExtendMins = nextMeeting 
        ? (new Date(nextMeeting.startTime).getTime() - new Date(meeting.endTime).getTime()) / 60000 
        : 180;

    const options = [15, 30, 45, 60];

    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '40px', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: THEME.red, boxShadow: `0 0 10px ${THEME.red}` }}></div>
                <span style={{ color: THEME.red, fontSize: '1.5rem', fontWeight: 600, letterSpacing: '1px' }}>IN PROGRESS</span>
            </div>

            <h1 style={{ fontSize: '4.5rem', margin: '0 0 10px 0', lineHeight: 1.1 }}>{meeting.title}</h1>
            <div style={{ fontSize: '2rem', color: THEME.textDim, marginBottom: '20px' }}>
                {formatTime(meeting.startTime)} — {formatTime(meeting.endTime)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.4rem', color: THEME.textDim }}>
                <User size={24} /> {meeting.host}
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', gap: '20px' }}>
                <button 
                    onClick={onEndEarly}
                    style={{ 
                        flex: 1, padding: '25px', backgroundColor: 'rgba(255,255,255,0.05)', 
                        border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px',
                        color: 'white', fontSize: '1.4rem', fontWeight: 500, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px'
                    }}>
                    <X size={32} /> End Meeting
                </button>
                <button 
                    onClick={() => setShowExtendModal(true)}
                    style={{ 
                        flex: 1, padding: '25px', backgroundColor: THEME.red, 
                        border: 'none', borderRadius: '12px',
                        color: 'white', fontSize: '1.4rem', fontWeight: 600, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px',
                        boxShadow: `0 10px 30px -10px ${THEME.red}`
                    }}>
                    Extend <ChevronRight size={32} />
                </button>
            </div>

            <div style={{ marginTop: '40px', padding: '20px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                <div style={{ textTransform: 'uppercase', fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>Up Next</div>
                {nextMeeting ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: 500 }}>{nextMeeting.title}</span>
                        <span style={{ fontFamily: 'monospace', fontSize: '1.2rem' }}>{formatTime(nextMeeting.startTime)}</span>
                    </div>
                ) : (
                    <span style={{ color: '#888', fontStyle: 'italic' }}>No upcoming meetings</span>
                )}
            </div>

            {showExtendModal && (
                <Modal title="Extend Meeting" onClose={() => setShowExtendModal(false)}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        {options.map(min => {
                            const disabled = min > maxExtendMins;
                            return (
                                <button
                                    key={min}
                                    disabled={disabled}
                                    onClick={() => { onExtend(min); setShowExtendModal(false); }}
                                    style={{
                                        padding: '30px', borderRadius: '8px', border: 'none',
                                        backgroundColor: disabled ? '#333' : '#444',
                                        color: disabled ? '#666' : 'white',
                                        fontSize: '1.2rem', cursor: disabled ? 'not-allowed' : 'pointer',
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px'
                                    }}
                                >
                                    <span style={{ fontSize: '2rem', fontWeight: 700 }}>+{min}</span>
                                    <span style={{ fontSize: '0.9rem' }}>minutes</span>
                                </button>
                            )
                        })}
                    </div>
                    {maxExtendMins < 15 && (
                        <div style={{ marginTop: '20px', color: '#ff9800', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <AlertCircle size={20} />
                            <span>Cannot extend. Next meeting starts soon.</span>
                        </div>
                    )}
                </Modal>
            )}
        </div>
    );
};