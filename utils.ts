
import { Meeting } from './types';

export const formatTime = (dateStr: string | Date) => {
  const d = new Date(dateStr);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
};

export const getMinutesFromStartOfDay = (date: Date, startHour: number) => {
  const h = date.getHours();
  const m = date.getMinutes();
  return (h * 60 + m) - (startHour * 60);
};

export const isBusyAtTime = (schedule: Meeting[], time: Date) => {
  return schedule.find(m => {
    const start = new Date(m.startTime);
    const end = new Date(m.endTime);
    return time >= start && time < end;
  });
};

export const getNextMeeting = (schedule: Meeting[], time: Date) => {
  return schedule
    .filter(m => new Date(m.startTime) > time)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0];
};

// --- Mock Data Generator ---
export const generateMockSchedule = (date: Date): Meeting[] => {
  const schedule: Meeting[] = [];
  const baseDate = new Date(date);
  baseDate.setHours(0,0,0,0);

  const meetings = [
    { title: 'Morning Standup', host: 'Team A', startH: 9, startM: 0, duration: 30 },
    { title: 'Client Briefing', host: 'John Smith', startH: 10, startM: 0, duration: 60 },
    { title: 'Design Review', host: 'Sarah Jones', startH: 13, startM: 30, duration: 90 },
    { title: 'Tech Sync', host: 'Engineering', startH: 16, startM: 0, duration: 45 },
  ];

  meetings.forEach((m, i) => {
    const start = new Date(baseDate);
    start.setHours(m.startH, m.startM);
    
    const end = new Date(start.getTime() + m.duration * 60000);

    schedule.push({
      id: `evt-${i}`,
      title: m.title,
      host: m.host,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      type: 'scheduled'
    });
  });

  return schedule;
};
