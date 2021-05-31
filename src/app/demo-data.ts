export interface Permission {
  id: string;
  name: string;
}

export const PERMISSIONS: Permission[] = [
  { name: 'Tribe', id: 'A' },
  { name: 'Mesila', id: 'B' },
  { name: 'Rest', id: 'C' },
  { name: 'Web Client', id: 'D' },
  { name: 'Main Frame', id: 'E' },
  { name: 'WSO2', id: 'E' },
  { name: 'Splunk', id: 'E' }
];
