import { PLACEHOLDER_IMAGES } from "@/lib/constants/placeholder-images";

export type MockCategoryId =
  | "technology"
  | "music"
  | "business"
  | "art"
  | "education"
  | "sports";

export type MockEvent = {
  id: string;
  slug: string;
  title: string;
  categoryId: MockCategoryId;
  dateIso: string;
  location: string;
  description: string;
  rsvpCount: number;
  imageUrl: string;
};

export const MOCK_CATEGORIES: {
  id: MockCategoryId;
  eventCount: number;
}[] = [
  { id: "technology", eventCount: 120 },
  { id: "music", eventCount: 85 },
  { id: "business", eventCount: 64 },
  { id: "art", eventCount: 48 },
  { id: "education", eventCount: 32 },
  { id: "sports", eventCount: 28 },
];

export const MOCK_POPULAR_EVENTS: MockEvent[] = [
  {
    id: "1",
    slug: "react-summit-2025",
    title: "React Summit 2025",
    categoryId: "technology",
    dateIso: "2025-04-12T18:00:00.000Z",
    location: "Tehran",
    description:
      "Join developers from around the world for talks, workshops, and networking.",
    rsvpCount: 1200,
    imageUrl: PLACEHOLDER_IMAGES.events.technology,
  },
  {
    id: "2",
    slug: "electronic-music-night",
    title: "Electronic Music Night",
    categoryId: "music",
    dateIso: "2025-05-03T20:00:00.000Z",
    location: "Isfahan",
    description:
      "An unforgettable night of electronic beats and live performances.",
    rsvpCount: 890,
    imageUrl: PLACEHOLDER_IMAGES.events.music,
  },
  {
    id: "3",
    slug: "startup-pitch-day",
    title: "Startup Pitch Day",
    categoryId: "business",
    dateIso: "2025-06-18T14:00:00.000Z",
    location: "Online Event",
    description:
      "Watch innovative startups pitch their ideas to investors and mentors.",
    rsvpCount: 450,
    imageUrl: PLACEHOLDER_IMAGES.events.business,
  },
  {
    id: "4",
    slug: "art-expo-tehran",
    title: "Art Expo Tehran",
    categoryId: "art",
    dateIso: "2025-07-09T10:00:00.000Z",
    location: "Tehran",
    description:
      "Explore contemporary art from local and international artists.",
    rsvpCount: 320,
    imageUrl: PLACEHOLDER_IMAGES.events.art,
  },
];
