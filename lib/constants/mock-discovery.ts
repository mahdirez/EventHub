import { PLACEHOLDER_IMAGES } from "@/lib/constants/placeholder-images";

export type MockEvent = {
  id: string;
  slug: string;
  title: string;
  categorySlug: string;
  dateIso: string;
  location: string;
  description: string;
  rsvpCount: number;
  imageUrl: string;
};

export const MOCK_CATEGORIES: {
  slug: string;
  eventCount: number;
}[] = [
  { slug: "technology", eventCount: 120 },
  { slug: "music", eventCount: 85 },
  { slug: "business", eventCount: 64 },
  { slug: "art", eventCount: 48 },
  { slug: "education", eventCount: 32 },
  { slug: "sports", eventCount: 28 },
];

export const MOCK_POPULAR_EVENTS: MockEvent[] = [
  {
    id: "1",
    slug: "react-summit-2025",
    title: "React Summit 2025",
    categorySlug: "technology",
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
    categorySlug: "music",
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
    categorySlug: "business",
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
    categorySlug: "art",
    dateIso: "2025-07-09T10:00:00.000Z",
    location: "Tehran",
    description:
      "Explore contemporary art from local and international artists.",
    rsvpCount: 320,
    imageUrl: PLACEHOLDER_IMAGES.events.art,
  },
];
