
import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Meeting } from '../types';
import { COLORS, CONFIG } from '../constants';
import { formatTime, getMinutesFromStartOfDay } from '../utils';

interface TimelineProps {
  schedule: Meeting[];
  currentTime: Date;
}

export const Timeline: React.FC<TimelineProps> = ({ schedule, currentTime }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0); // For manual scrolling if needed, or just standard overflow

  const totalMinutes = (CONFIG.END_HOUR - CONFIG.START_HOUR) * 60;
  const totalWidth = totalMinutes * CONFIG.PIXELS_PER_MINUTE;

  // Auto-scroll to current time on mount/update
  useEffect(() => {
    if (scrollRef.current) {
      const nowMinutes = getMinutesFromStartOfDay(currentTime, CONFIG.START_HOUR);
      const centerPos = (nowMinutes * CONFIG.PIXELS_PER_MINUTE) - (window.innerWidth / 2);
      scrollRef.current.scrollLeft = centerPos;
    }
  }, [currentTime]); // Re-center occasionally

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  // Generate Grid Markers
  const markers = [];
  for (let i = 0; i <= totalMinutes; i += 15) {
    markers.push({
      left: i * CONFIG.PIXELS_PER_MINUTE,
      isHour: i % 60 === 0,
      label: i % 60 === 0 ? `${CONFIG.START_HOUR + (i / 60)}:00` : null
    });
  }

  // Calculate Current Time Line Position
  const nowPx = getMinutesFromStartOfDay(currentTime, CONFIG.START_HOUR) * CONFIG.PIXELS_PER_MINUTE;

  return (
    <div style={{ position: 'relative', height: '140px', backgroundColor: '#000', borderTop: `1px solid ${COLORS.border}` }}>
      
      {/* Scroll Buttons */}
      <button onClick={() => handleScroll('left')} style={scrollBtnStyle('left')}>
        <ChevronLeft size={32} />
      </button>
      <button onClick={() => handleScroll('right')} style={scrollBtnStyle('right')}>
        <ChevronRight size={32} />
      </button>

      {/* Scrollable Area */}
      <div 
        ref={scrollRef}
        style={{ 
          overflowX: 'auto', 
          height: '100%', 
          position: 'relative',
          scrollbarWidth: 'none',
          whiteSpace: 'nowrap'
        }}
      >
        <div style={{ width: `${totalWidth}px`, height: '100%', position: 'relative', background: COLORS.green }}>
          
          {/* Layer 1: Grid Lines */}
          {markers.map((m, idx) => (
            <div key={idx} style={{
              position: 'absolute',
              left: m.left,
              top: 0,
              bottom: 0,
              width: 1,
              backgroundColor: m.isHour ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
              zIndex: 2
            }}>
              {m.label && (
                <span style={{ 
                  position: 'absolute', bottom: 8, left: 4, 
                  color: 'white', fontWeight: 'bold', fontSize: '14px' 
                }}>
                  {m.label}
                </span>
              )}
            </div>
          ))}

          {/* Layer 2: Meetings */}
          {schedule.map(meeting => {
            const startMins = getMinutesFromStartOfDay(new Date(meeting.startTime), CONFIG.START_HOUR);
            const endMins = getMinutesFromStartOfDay(new Date(meeting.endTime), CONFIG.START_HOUR);
            
            // Bounds checking
            if (endMins < 0 || startMins > totalMinutes) return null;

            const left = Math.max(0, startMins * CONFIG.PIXELS_PER_MINUTE);
            const width = Math.max(0, (endMins * CONFIG.PIXELS_PER_MINUTE) - left);

            return (
              <div key={meeting.id} style={{
                position: 'absolute',
                left,
                width,
                top: 0,
                bottom: 0,
                backgroundColor: COLORS.red,
                borderLeft: '1px solid rgba(255,255,255,0.3)',
                borderRight: '1px solid rgba(255,255,255,0.3)',
                zIndex: 5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                {width > 60 && (
                   <div style={{ textAlign: 'center' }}>
                     <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'white' }}>{formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}</div>
                     {width > 150 && <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>{meeting.title}</div>}
                   </div>
                )}
              </div>
            );
          })}

          {/* Layer 3: Now Indicator */}
          {nowPx >= 0 && nowPx <= totalWidth && (
            <div style={{
              position: 'absolute',
              left: nowPx,
              top: 0,
              bottom: 0,
              width: 2,
              backgroundColor: 'white',
              zIndex: 10,
              boxShadow: '0 0 10px white'
            }}>
              <div style={{
                position: 'absolute', top: 0, left: '-50%', transform: 'translateX(-40%)',
                background: 'white', color: 'black', padding: '2px 6px',
                fontSize: '12px', fontWeight: 'bold', borderRadius: '0 0 4px 4px'
              }}>
                {formatTime(currentTime)}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

const scrollBtnStyle = (side: 'left' | 'right'): React.CSSProperties => ({
  position: 'absolute',
  [side]: 0,
  top: 0,
  bottom: 0,
  width: '60px',
  background: 'linear-gradient(to ' + (side === 'left' ? 'right' : 'left') + ', rgba(0,0,0,0.8), transparent)',
  border: 'none',
  color: 'white',
  zIndex: 20,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer'
});
