
import { Meeting, Room } from './types';

export const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

export const isTimeBetween = (target: Date, start: Date, end: Date) => target >= start && target < end;

export const getNextMeeting = (schedule: Meeting[], now: Date) => {
  return schedule
    .filter(m => m.startTime > now)
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())[0];
};

export const getCurrentMeeting = (schedule: Meeting[], now: Date) => {
  // Add a small buffer (1s) to handle exact boundary cases nicely
  return schedule.find(m => isTimeBetween(new Date(now.getTime() + 1000), m.startTime, m.endTime));
};

export const generateSchedule = (date: Date): Meeting[] => {
  const schedule: Meeting[] = [];
  const baseTime = new Date(date);
  baseTime.setHours(8, 0, 0, 0);

  const titles = ['Strategy Sync', 'Client Call', 'Daily Standup', 'Project Kick-off', 'Design Review', 'Executive Briefing'];
  const hosts = ['John Eastwood', 'Sarah Connor', 'Michael Scott', 'Jane Doe', 'David Smith'];

  let currentTime = new Date(baseTime);

  // Generate 4-6 meetings
  for (let i = 0; i < 5; i++) {
    // Random gap 0-90 mins
    const gap = Math.floor(Math.random() * 6) * 15; 
    const start = new Date(currentTime.getTime() + gap * 60000);
    
    // Duration 15-90 mins
    const duration = (1 + Math.floor(Math.random() * 6)) * 15;
    const end = new Date(start.getTime() + duration * 60000);

    if (end.getHours() >= 19) break;

    schedule.push({
      id: Math.random().toString(36).substr(2, 9),
      title: titles[Math.floor(Math.random() * titles.length)],
      host: hosts[Math.floor(Math.random() * hosts.length)],
      startTime: start,
      endTime: end,
      type: 'scheduled'
    });

    currentTime = end;
  }
  return schedule;
};

export const INITIAL_ROOMS: Room[] = Array.from({ length: 6 }, (_, i) => ({
  id: `room-${i + 1}`,
  name: `Meeting Room ${i + 1}`,
  capacity: 4 + i * 2,
  schedule: generateSchedule(new Date()),
  calendarId: '',
  apiKey: ''
}));
