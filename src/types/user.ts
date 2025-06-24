export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  image?: string;
  phone: string;
  address: string;
  description: string;
  role: string;
  notifications?: string[];
  reservations?: number[];
}

export interface NotificationType {
  message: string;
  created_at: string;
};

export interface AppSidebarProps {
  sidebarVisible: boolean;
  toggleSidebar: () => void;
  user: User;
  t: (key: string) => string;
  handleSignOut: () => void;
}
