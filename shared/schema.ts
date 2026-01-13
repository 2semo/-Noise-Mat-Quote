import { z } from "zod";

// Apartment type options
export const apartmentTypes = ["expanded", "standard"] as const;
export type ApartmentType = typeof apartmentTypes[number];

// Size range options (평수)
export const sizeRanges = [
  "17-20",
  "21-23",
  "24-26",
  "27-29",
  "30-32",
  "33-34",
  "35-36",
  "37-40",
  "41-45",
  "46-50",
  "50+"
] as const;
export type SizeRange = typeof sizeRanges[number];

// Installation area options
export const installationAreas = [
  "living",
  "living_hallway",
  "living_hallway_kitchen_entrance",
  "living_hallway_kitchen_full",
  "living_hallway_kitchen_room"
] as const;
export type InstallationArea = typeof installationAreas[number];

// Quote request schema
export const quoteRequestSchema = z.object({
  apartmentType: z.enum(apartmentTypes),
  sizeRange: z.enum(sizeRanges),
  installationArea: z.enum(installationAreas),
});

export type QuoteRequest = z.infer<typeof quoteRequestSchema>;

// Quote result
export interface QuoteResult {
  basePrice: number;
  sheets: number;
  totalPrice: number;
  pricePerSheet: number;
}

// Labels for display
export const apartmentTypeLabels: Record<ApartmentType, string> = {
  expanded: "확장형",
  standard: "비확장형",
};

export const apartmentTypeDescriptions: Record<ApartmentType, string> = {
  expanded: "거실 확장 포함 (일반적 확장)",
  standard: "기본형",
};

export const sizeRangeLabels: Record<SizeRange, string> = {
  "17-20": "17~20평",
  "21-23": "21~23평",
  "24-26": "24~26평",
  "27-29": "27~29평",
  "30-32": "30~32평",
  "33-34": "33~34평",
  "35-36": "35~36평",
  "37-40": "37~40평",
  "41-45": "41~45평",
  "46-50": "46~50평",
  "50+": "50평 이상",
};

export const installationAreaLabels: Record<InstallationArea, string> = {
  living: "거실",
  living_hallway: "거실+복도",
  living_hallway_kitchen_entrance: "거실+복도+주방(입구)",
  living_hallway_kitchen_full: "거실+복도+주방(전체)",
  living_hallway_kitchen_room: "거실+복도+주방+아이방",
};
