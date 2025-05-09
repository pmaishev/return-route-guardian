
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface ReturnItem {
  id: string;
  productName: string;
  sku: string;
  orderId: string;
  customerName: string;
  returnReason: string;
  returnDate: string;
  status: "in_transit" | "received" | "processed";
  condition: "new" | "used" | "damaged";
}

export type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

export type Decision = "return_to_inventory" | "dispose" | "donate";
