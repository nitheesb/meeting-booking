import React from 'react';
import { Meeting } from '../../types';
import { THEME } from '../../constants';
import { formatTime } from '../../utils';

interface FreeViewProps {
    nextMeeting?: Meeting;
    onBook: (mins: number) => void;
}

export const FreeView: React.FC<FreeViewProps> = ({ nextMeeting, onBook }) => {
    const now = new Date();
    const minsUntilNext = nextMeeting 
        ? (new Date(nextMeeting.startTime).getTime() - now.getTime()) / 60000 
        : 999;

    const options = [
        { label: 'Quick 15m', val: 15 },
        { label: '30 mins', val: 30 },
        { label: '1 hour', val: 60 }
    ];

    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '40px', justifyContent: 'center' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: THEME.green, boxShadow: `0 0 10px ${THEME.green}` }}></div>
                <span style={{ color: THEME.green, fontSize: '1.5rem', fontWeight: 600, letterSpacing: '1px' }}>AVAILABLE</span>
            </div>

            <h1 style={{ fontSize: '4.5rem', margin: '0 0 20px 0', lineHeight: 1.1 }}>Room is free</h1>
            <div style={{ fontSize: '2rem', color: THEME.textDim, marginBottom: '60px' }}>
                {nextMeeting ? `Until ${formatTime(nextMeeting.startTime)}` : 'For the rest of the day'}
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
                {options.map((opt, i) => {
                    const disabled = opt.val > minsUntilNext;
                    return (
                        <button
                            key={i}
                            disabled={disabled}
                            onClick={() => onBook(opt.val)}
                            style={{
                                flex: 1,
                                height: '160px',
                                borderRadius: '16px',
                                border: 'none',
                                backgroundColor: disabled ? 'rgba(255,255,255,0.05)' : THEME.green,
                                opacity: disabled ? 0.5 : 1,
                                color: 'white',
                                cursor: disabled ? 'not-allowed' : 'pointer',
                                display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                                transition: 'transform 0.1s',
                                boxShadow: disabled ? 'none' : `0 10px 40px -10px ${THEME.greenDark}`,
                                position: 'relative', // Ensure it has a z-index context
                                zIndex: 1
                            }}
                            onMouseDown={e => !disabled && (e.currentTarget.style.transform = 'scale(0.96)')}
                            onMouseUp={e => !disabled && (e.currentTarget.style.transform = 'scale(1)')}
                        >
                            <span style={{ fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>Book</span>
                            <span style={{ fontSize: '3rem', fontWeight: 700, lineHeight: 1 }}>{opt.val}</span>
                            <span style={{ fontSize: '1rem', opacity: 0.8 }}>min</span>
                        </button>
                    )
                })}
            </div>

            <div style={{ marginTop: 'auto', textAlign: 'center', color: '#666' }}>
                Tap a duration to book instantly
            </div>
        </div>
    );
};