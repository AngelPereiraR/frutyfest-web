export interface User {
  _id:      string;
  email:    string;
  minecraftName: string;
  name:     string;
  roles:    string[];
  hasCompanion: boolean;
  companionName: string;
  event: string;
  presentation: string;
}
