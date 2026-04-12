export interface Story {
  _id: string;
  name: string;
  email: string;
  title: string;
  narrative: string;
  mission: "challenger" | "columbia";
  imageUrl?: string;
  category: "public" | "heritage";
  relation: "immediate-family" | "friend" | "colleague" | "public-observer";
  isVerified: boolean;
  isFeatured: boolean;
  status: "pending" | "published" | "archived";
  createdAt: string;
}