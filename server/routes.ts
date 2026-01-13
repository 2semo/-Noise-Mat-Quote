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

// Price calculation logic
function calculateQuote(
  apartmentType: ApartmentType,
  sizeRange: SizeRange,
  installationArea: InstallationArea
): QuoteResult {
  const pricePerSheet = 25000;

  const baseSheetsMap: Record<SizeRange, number> = {
    "17-20": 60,
    "21-23": 65,
    "24-26": 72,
    "27-29": 80,
    "30-32": 88,
    "33-34": 95,
    "35-36": 102,
    "37-40": 115,
    "41-45": 130,
    "46-50": 150,
    "50+": 170,
  };

  const areaMultiplierMap: Record<InstallationArea, number> = {
    living: 0.4,
    living_hallway: 0.55,
    living_hallway_kitchen_entrance: 0.7,
    living_hallway_kitchen_full: 0.85,
    living_hallway_kitchen_room: 1.0,
  };

  const typeMultiplier = apartmentType === "expanded" ? 1.15 : 1.0;

  const baseSheets = baseSheetsMap[sizeRange];
  const areaMultiplier = areaMultiplierMap[installationArea];

  let sheets = Math.ceil(baseSheets * areaMultiplier * typeMultiplier);
  sheets = Math.max(60, sheets);

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
