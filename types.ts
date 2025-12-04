
export interface Meeting {
  id: string;
  title: string;
  host: string;
  startTime: string; // ISO String for easier serialization
  endTime: string;   // ISO String
  type: 'scheduled' | 'ad-hoc' | 'extended';
}

export interface RoomSettings {
  googleCalendarId?: string;
  googleApiKey?: string;
  displayName?: string;
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  status: 'available' | 'busy';
  schedule: Meeting[];
  settings: RoomSettings;
}

export type AppView = 'BOOT' | 'SETUP' | 'DISPLAY' | 'ADMIN_LOGIN' | 'ADMIN';
