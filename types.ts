
export interface Meeting {
  id: string;
  title: string;
  host: string;
  startTime: Date;
  endTime: Date;
  type: 'scheduled' | 'ad-hoc';
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  schedule: Meeting[];
  // Integration settings
  calendarId?: string;
  apiKey?: string;
}

export type ViewMode = 'SETUP' | 'DISPLAY' | 'ADMIN' | 'ADMIN_LOGIN';
