
import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Meeting } from '../types';
import { THEME } from '../constants';
import { formatTime } from '../utils';

interface TimelineProps {
  schedule: Meeting[];
  now: Date;
}

// Configuration
const START_HOUR = 7; // 7 AM
const END_HOUR = 19;  // 7 PM
const PX_PER_MIN = 4; // Width of 1 minute in pixels
const MIN_BLOCK_WIDTH = 50; // Minimum width for text visibility

export const Timeline: React.FC<TimelineProps> = ({ schedule, now }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  // 1. Calculate dimensions
  const totalMinutes = (END_HOUR - START_HOUR) * 60;
  const totalWidth = totalMinutes * PX_PER_MIN;

  // Helper: Convert Date to pixels relative to start of day
  const getPosition = (date: Date) => {
    const h = date.getHours();
    const m = date.getMinutes();
    const minutesSinceStart = (h * 60 + m) - (START_HOUR * 60);
    return Math.max(0, minutesSinceStart * PX_PER_MIN);
  };

  // 2. Generate Grid Lines (Every 30 mins)
  const gridLines = [];
  for (let i = 0; i <= totalMinutes; i += 30) {
    const isHour = i % 60 === 0;
    gridLines.push({
      left: i * PX_PER_MIN,
      label: isHour ? `${Math.floor(START_HOUR + i / 60).toString().padStart(2, '0')}:00` : null,
      isHour
    });
  }

  // 3. Auto-scroll logic
  useEffect(() => {
    // Only auto-scroll if the user hasn't touched the scroll recently
    if (!isUserScrolling && scrollContainerRef.current) {
      const currentPos = getPosition(now);
      const containerWidth = scrollContainerRef.current.clientWidth;
      // Center the view on "now"
      scrollContainerRef.current.scrollTo({
        left: currentPos - (containerWidth / 2),
        behavior: 'smooth'
      });
    }
  }, [now, isUserScrolling]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      setIsUserScrolling(true);
      const amount = direction === 'left' ? -300 : 300;
      scrollContainerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
      // Reset user scrolling flag after animation
      setTimeout(() => setIsUserScrolling(false), 500);
    }
  };

  const nowPos = getPosition(now);

  return (
    <div style={{ 
      height: '140px', 
      backgroundColor: '#111', 
      borderTop: '1px solid #333', 
      position: 'relative', 
      display: 'flex', 
      flexDirection: 'column', 
      zIndex: 20 
    }}>
      
      {/* Scroll Controls */}
      <button 
        onClick={() => handleScroll('left')}
        style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: '50px',
          backgroundColor: 'rgba(0,0,0,0.5)', border: 'none', color: 'white',
          zIndex: 30, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
        <ChevronLeft size={32} />
      </button>

      <button 
        onClick={() => handleScroll('right')}
        style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: '50px',
          backgroundColor: 'rgba(0,0,0,0.5)', border: 'none', color: 'white',
          zIndex: 30, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
        <ChevronRight size={32} />
      </button>

      {/* Scrollable Track */}
      <div 
        ref={scrollContainerRef}
        className="timeline-scroll-area"
        style={{ 
          flex: 1, 
          overflowX: 'auto', 
          overflowY: 'hidden',
          position: 'relative',
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none' // IE/Edge
        }}
        onTouchStart={() => setIsUserScrolling(true)}
      >
        <style>{`.timeline-scroll-area::-webkit-scrollbar { display: none; }`}</style>
        
        <div style={{ 
          width: `${totalWidth}px`, 
          height: '100%', 
          position: 'relative',
          backgroundColor: THEME.green // BASE LAYER: GREEN (FREE)
        }}>

          {/* LAYER 2: GRID LINES */}
          {gridLines.map((line, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: `${line.left}px`,
              top: 0,
              bottom: 0,
              width: '1px',
              backgroundColor: 'rgba(0,0,0,0.15)',
              borderRight: line.isHour ? '1px solid rgba(0,0,0,0.2)' : 'none'
            }}>
              {line.label && (
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '5px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.9)',
                  textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                }}>
                  {line.label}
                </div>
              )}
            </div>
          ))}

          {/* LAYER 3: MEETINGS (RED OVERLAY) */}
          {schedule.map((meeting) => {
            const startPx = getPosition(meeting.startTime);
            const endPx = getPosition(meeting.endTime);
            const width = Math.max(endPx - startPx, 2); // Ensure at least visible line
            
            // Don't render if outside our view range (07:00 - 19:00)
            if (endPx < 0 || startPx > totalWidth) return null;

            return (
              <div key={meeting.id} style={{
                position: 'absolute',
                left: `${startPx}px`,
                width: `${width}px`,
                top: 0,
                bottom: 0,
                backgroundColor: THEME.red,
                borderLeft: '1px solid rgba(255,255,255,0.2)',
                borderRight: '1px solid rgba(255,255,255,0.2)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10
              }}>
                {width > MIN_BLOCK_WIDTH && (
                  <div style={{ 
                    color: 'white', 
                    fontSize: '12px', 
                    fontWeight: 600, 
                    whiteSpace: 'nowrap',
                    textAlign: 'center',
                    lineHeight: 1.2
                  }}>
                    {width > 120 ? (
                      <>
                        <div style={{ opacity: 0.9 }}>{meeting.title}</div>
                        <div style={{ opacity: 0.7, fontSize: '10px' }}>{formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}</div>
                      </>
                    ) : (
                      <span>{formatTime(meeting.startTime)}</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* LAYER 4: NOW INDICATOR */}
          {nowPos >= 0 && nowPos <= totalWidth && (
            <div style={{
              position: 'absolute',
              left: `${nowPos}px`,
              top: 0,
              bottom: 0,
              width: '2px',
              backgroundColor: '#fff',
              zIndex: 25,
              boxShadow: '0 0 8px rgba(255,255,255,0.8)'
            }}>
              <div style={{
                position: 'absolute',
                top: '5px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'white',
                color: '#111',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 'bold',
                whiteSpace: 'nowrap'
              }}>
                {formatTime(now)}
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};
