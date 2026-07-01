export interface CrewMember {
  _id: string;
  slug: string;
  name: string;
  role: string;
  crewId: string;
  seat: string;
  img: string;
  shortBio: string;
  rawBiography?: string;
  media?: string[];
  createdAt?: string;
  updatedAt?: string;
}