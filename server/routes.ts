import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import {
  apartmentTypes,
  sizeRanges,
  installationAreas,
  quoteRequestSchema,
  type QuoteResult,
  type ApartmentType,
  type SizeRange,
  type InstallationArea,
} from "@shared/schema";

// 층간소음방지매트 표준조견표 (LOTTE HIMART)
// 확장형 조견표 (단위: 장)
const expandedTable: Record<InstallationArea, Record<SizeRange, number>> = {
  living: {
    "17-20": 60, "21-23": 60, "24-26": 60, "27-29": 60, "30-32": 60,
    "33-34": 60, "35-36": 60, "37-40": 66, "41-45": 77, "46-50": 84, "50+": 89
  },
  living_hallway: {
    "17-20": 60, "21-23": 60, "24-26": 61, "27-29": 68, "30-32": 76,
    "33-34": 80, "35-36": 87, "37-40": 97, "41-45": 115, "46-50": 130, "50+": 146
  },
  living_hallway_kitchen_entrance: {
    "17-20": 60, "21-23": 67, "24-26": 74, "27-29": 82, "30-32": 92,
    "33-34": 100, "35-36": 109, "37-40": 121, "41-45": 141, "46-50": 157, "50+": 173
  },
  living_hallway_kitchen_full: {
    "17-20": 60, "21-23": 70, "24-26": 79, "27-29": 88, "30-32": 99,
    "33-34": 108, "35-36": 119, "37-40": 131, "41-45": 153, "46-50": 172, "50+": 191
  },
  living_hallway_kitchen_room: {
    "17-20": 73, "21-23": 86, "24-26": 97, "27-29": 109, "30-32": 122,
    "33-34": 133, "35-36": 144, "37-40": 163, "41-45": 188, "46-50": 210, "50+": 232
  },
};

// 비확장형 조견표 (단위: 장)
const standardTable: Record<InstallationArea, Record<SizeRange, number>> = {
  living: {
    "17-20": 60, "21-23": 60, "24-26": 60, "27-29": 60, "30-32": 60,
    "33-34": 60, "35-36": 60, "37-40": 60, "41-45": 66, "46-50": 77, "50+": 82
  },
  living_hallway: {
    "17-20": 60, "21-23": 60, "24-26": 60, "27-29": 60, "30-32": 68,
    "33-34": 74, "35-36": 80, "37-40": 91, "41-45": 104, "46-50": 123, "50+": 137
  },
  living_hallway_kitchen_entrance: {
    "17-20": 60, "21-23": 60, "24-26": 69, "27-29": 74, "30-32": 84,
    "33-34": 93, "35-36": 102, "37-40": 114, "41-45": 126, "46-50": 150, "50+": 166
  },
  living_hallway_kitchen_full: {
    "17-20": 60, "21-23": 60, "24-26": 73, "27-29": 79, "30-32": 91,
    "33-34": 102, "35-36": 112, "37-40": 125, "41-45": 142, "46-50": 165, "50+": 184
  },
  living_hallway_kitchen_room: {
    "17-20": 66, "21-23": 76, "24-26": 91, "27-29": 102, "30-32": 112,
    "33-34": 127, "35-36": 137, "37-40": 157, "41-45": 177, "46-50": 203, "50+": 215
  },
};

// Price calculation logic
function calculateQuote(
  apartmentType: ApartmentType,
  sizeRange: SizeRange,
  installationArea: InstallationArea
): QuoteResult {
  const pricePerSheet = 25000;

  // 조견표에서 장수 조회
  const table = apartmentType === "expanded" ? expandedTable : standardTable;
  const sheets = table[installationArea][sizeRange];

  const totalPrice = sheets * pricePerSheet;
  const basePrice = totalPrice;

  return {
    basePrice,
    sheets,
    totalPrice,
    pricePerSheet,
  };
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Quote calculation endpoint
  app.post("/api/quote", (req, res) => {
    try {
      const validatedData = quoteRequestSchema.parse(req.body);
      
      const quote = calculateQuote(
        validatedData.apartmentType,
        validatedData.sizeRange,
        validatedData.installationArea
      );

      res.json({
        success: true,
        data: {
          ...quote,
          request: validatedData,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: "Invalid input",
          details: error.errors,
        });
      } else {
        res.status(500).json({
          success: false,
          error: "Internal server error",
        });
      }
    }
  });

  // Get pricing info
  app.get("/api/pricing-info", (_req, res) => {
    res.json({
      success: true,
      data: {
        pricePerSheet: 25000,
        minimumSheets: 60,
        storeInfo: {
          name: "롯데하이마트 안산선부점",
          phone: "031-483-7400",
        },
      },
    });
  });

  return httpServer;
}
