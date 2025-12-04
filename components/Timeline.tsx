
import React, { useEffect, useMemo, useRef } from 'react';
import { Meeting } from '../types';
import { THEME } from '../constants';
import { formatTime } from '../utils';

interface TimelineProps {
  schedule: Meeting[];
  now: Date;
}

export const Timeline: React.FC<TimelineProps> = ({ schedule, now }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const PIXELS_PER_MIN = 3; 
  const DAY_START_HOUR = 7;
  const DAY_END_HOUR = 19;

  // Auto-center current time
  useEffect(() => {
    if (containerRef.current) {
      const startOfDay = new Date(now);
      startOfDay.setHours(DAY_START_HOUR, 0, 0, 0);
      const minsSinceStart = (now.getTime() - startOfDay.getTime()) / 60000;
      const targetScroll = (minsSinceStart * PIXELS_PER_MIN) - (window.innerWidth / 2);
      containerRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' });
    }
  }, [now.getMinutes()]);

  const blocks = useMemo(() => {
    const list = [];
    const dayStart = new Date(now); dayStart.setHours(DAY_START_HOUR, 0, 0, 0);
    const dayEnd = new Date(now); dayEnd.setHours(DAY_END_HOUR, 0, 0, 0);
    
    let cursor = new Date(dayStart);
    const sortedMeetings = [...schedule].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

    while (cursor < dayEnd) {
      const meeting = sortedMeetings.find(m => Math.abs(m.startTime.getTime() - cursor.getTime()) < 10000);

      if (meeting) {
        const duration = (meeting.endTime.getTime() - meeting.startTime.getTime()) / 60000;
        list.push({ type: 'meeting', start: meeting.startTime, end: meeting.endTime, duration, data: meeting });
        cursor = new Date(meeting.endTime);
      } else {
        const nextMeeting = sortedMeetings.find(m => m.startTime > cursor);
        const nextBound = nextMeeting ? nextMeeting.startTime : dayEnd;
        let diffMins = (nextBound.getTime() - cursor.getTime()) / 60000;
        
        const duration = Math.min(diffMins, 15);
        if (duration <= 0) break;

        const blockEnd = new Date(cursor.getTime() + duration * 60000);
        list.push({ type: 'free', start: new Date(cursor), end: blockEnd, duration });
        cursor = blockEnd;
      }
    }
    return list;
  }, [schedule, now]);

  const startOfDay = new Date(now);
  startOfDay.setHours(DAY_START_HOUR, 0, 0, 0);
  const nowOffsetPx = ((now.getTime() - startOfDay.getTime()) / 60000) * PIXELS_PER_MIN;

  return (
    <div style={{ height: '100px', backgroundColor: '#1a1a1a', borderTop: '1px solid #333', position: 'relative', display: 'flex', flexDirection: 'column', zIndex: 10 }}>
      <div 
        ref={containerRef}
        className="no-scrollbar"
        style={{ flex: 1, overflowX: 'auto', display: 'flex', position: 'relative', alignItems: 'center' }}
      >
        <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
        
        <div style={{ width: '50vw', flexShrink: 0 }} /> 

        <div style={{ display: 'flex', height: '60px', position: 'relative' }}>
            <div style={{
                position: 'absolute', left: nowOffsetPx, top: -10, bottom: -10, width: '2px', backgroundColor: 'white', zIndex: 20,
                boxShadow: '0 0 10px white', pointerEvents: 'none'
            }}>
                <div style={{
                    position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)',
                    backgroundColor: 'white', color: 'black', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold'
                }}>
                    {formatTime(now)}
                </div>
            </div>

            {blocks.map((block, i) => (
                <div key={i} style={{
                    width: block.duration * PIXELS_PER_MIN,
                    backgroundColor: block.type === 'meeting' ? THEME.red : THEME.green,
                    height: '100%',
                    borderRight: '1px solid rgba(0,0,0,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontSize: '12px', flexShrink: 0,
                    position: 'relative'
                }}>
                    {block.type === 'meeting' ? (
                         block.duration > 20 ? (
                             <div style={{ textAlign: 'center', lineHeight: 1.1 }}>
                                 <div style={{ fontWeight: 600 }}>{formatTime(block.start)}</div>
                                 <div style={{ opacity: 0.7 }}>-</div>
                                 <div style={{ fontWeight: 600 }}>{formatTime(block.end)}</div>
                             </div>
                         ) : <span style={{ opacity: 0.5 }}>•</span>
                    ) : (
                         (block.start.getMinutes() === 0 || block.start.getMinutes() === 30) && (
                            <span style={{ position: 'absolute', bottom: '2px', left: '2px', fontSize: '10px', opacity: 0.8 }}>
                                {formatTime(block.start)}
                            </span>
                         )
                    )}
                </div>
            ))}
        </div>
        <div style={{ width: '50vw', flexShrink: 0 }} /> 
      </div>
    </div>
  );
};
