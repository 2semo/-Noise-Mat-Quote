import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Phone, Calculator, AlertCircle, Check } from "lucide-react";
import bannerImage from "@assets/uWUmx59_1768308324848.jpeg";
import {
  apartmentTypes,
  sizeRanges,
  installationAreas,
  apartmentTypeLabels,
  apartmentTypeDescriptions,
  sizeRangeLabels,
  installationAreaLabels,
  type ApartmentType,
  type SizeRange,
  type InstallationArea,
  type QuoteResult,
} from "@shared/schema";

// Price calculation logic based on standard pricing tables
function calculateQuote(
  apartmentType: ApartmentType,
  sizeRange: SizeRange,
  installationArea: InstallationArea
): QuoteResult {
  const pricePerSheet = 25000; // 장당 가격

  // Base sheets by size range
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

  // Area multiplier
  const areaMultiplierMap: Record<InstallationArea, number> = {
    living: 0.4,
    living_hallway: 0.55,
    living_hallway_kitchen_entrance: 0.7,
    living_hallway_kitchen_full: 0.85,
    living_hallway_kitchen_room: 1.0,
  };

  // Type multiplier (expanded apartments typically need more)
  const typeMultiplier = apartmentType === "expanded" ? 1.15 : 1.0;

  const baseSheets = baseSheetsMap[sizeRange];
  const areaMultiplier = areaMultiplierMap[installationArea];

  let sheets = Math.ceil(baseSheets * areaMultiplier * typeMultiplier);
  
  // Minimum 60 sheets
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

function formatPrice(price: number): string {
  return new Intl.NumberFormat("ko-KR").format(price);
}

export default function Home() {
  const [apartmentType, setApartmentType] = useState<ApartmentType | null>(null);
  const [sizeRange, setSizeRange] = useState<SizeRange | null>(null);
  const [installationArea, setInstallationArea] = useState<InstallationArea | null>(null);
  const [showResult, setShowResult] = useState(false);

  const isFormComplete = apartmentType && sizeRange && installationArea;

  const quote = useMemo(() => {
    if (!isFormComplete) return null;
    return calculateQuote(apartmentType!, sizeRange!, installationArea!);
  }, [apartmentType, sizeRange, installationArea, isFormComplete]);

  const handleCalculate = () => {
    if (isFormComplete) {
      setShowResult(true);
    }
  };

  const handleReset = () => {
    setApartmentType(null);
    setSizeRange(null);
    setInstallationArea(null);
    setShowResult(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Calculator className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-lg font-semibold leading-tight">롯데하이마트</h1>
                <p className="text-sm text-muted-foreground">안산선부점</p>
              </div>
            </div>
            <a
              href="tel:031-483-7400"
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover-elevate active-elevate-2"
              data-testid="link-phone"
            >
              <Phone className="h-4 w-4" />
              <span>031-483-7400</span>
            </a>
          </div>
        </div>
      </header>

      {/* Banner Image */}
      <div className="mx-auto max-w-3xl px-4 pt-6">
        <img
          src={bannerImage}
          alt="롯데하이마트 층간소음방지매트 - 층간소음으로 인한 불편함 상상매트로 해결하세요"
          className="w-full rounded-lg shadow-lg"
          data-testid="img-banner"
        />
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-3xl px-4 py-8">
        {/* Title Section */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">
            우리집 맞춤 층간소음방지 매트
          </h2>
          <p className="mt-2 text-lg text-muted-foreground">시공견적기</p>
        </div>

        {/* Calculator Form */}
        <Card className="mb-6">
          <CardContent className="space-y-8 pt-6">
            {/* 1. Apartment Type */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  1
                </span>
                <Label className="text-base font-semibold">
                  아파트 타입 <span className="text-destructive">*</span>
                </Label>
              </div>
              <p className="text-sm text-muted-foreground pl-9">
                확장형 = 거실 확장 포함 (일반적 확장) / 비확장형 = 기본형
              </p>
              <RadioGroup
                value={apartmentType || ""}
                onValueChange={(value) => {
                  setApartmentType(value as ApartmentType);
                  setShowResult(false);
                }}
                className="grid grid-cols-2 gap-4 pl-9"
              >
                {apartmentTypes.map((type) => (
                  <div key={type} className="relative">
                    <RadioGroupItem
                      value={type}
                      id={`type-${type}`}
                      className="peer sr-only"
                      data-testid={`radio-type-${type}`}
                    />
                    <Label
                      htmlFor={`type-${type}`}
                      className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 transition-all hover-elevate peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                    >
                      <span className="text-base font-semibold">
                        {apartmentTypeLabels[type]}
                      </span>
                      <span className="mt-1 text-xs text-muted-foreground text-center">
                        {apartmentTypeDescriptions[type]}
                      </span>
                    </Label>
                    {apartmentType === type && (
                      <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* 2. Size Range */}
            <div className="space-y-4 border-t pt-6">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  2
                </span>
                <Label className="text-base font-semibold">
                  평수 구간 <span className="text-destructive">*</span>
                </Label>
              </div>
              <div className="pl-9">
                <Select
                  value={sizeRange || ""}
                  onValueChange={(value) => {
                    setSizeRange(value as SizeRange);
                    setShowResult(false);
                  }}
                >
                  <SelectTrigger 
                    className="w-full" 
                    data-testid="select-size-trigger"
                  >
                    <SelectValue placeholder="평수를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {sizeRanges.map((range) => (
                      <SelectItem 
                        key={range} 
                        value={range}
                        data-testid={`select-size-${range}`}
                      >
                        {sizeRangeLabels[range]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 3. Installation Area */}
            <div className="space-y-4 border-t pt-6">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  3
                </span>
                <Label className="text-base font-semibold">
                  시공 공간 <span className="text-destructive">*</span>
                </Label>
              </div>
              <RadioGroup
                value={installationArea || ""}
                onValueChange={(value) => {
                  setInstallationArea(value as InstallationArea);
                  setShowResult(false);
                }}
                className="space-y-3 pl-9"
              >
                {installationAreas.map((area) => (
                  <div key={area} className="relative">
                    <RadioGroupItem
                      value={area}
                      id={`area-${area}`}
                      className="peer sr-only"
                      data-testid={`radio-area-${area}`}
                    />
                    <Label
                      htmlFor={`area-${area}`}
                      className="flex cursor-pointer items-center justify-between rounded-lg border-2 border-muted bg-popover px-4 py-3 transition-all hover-elevate peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                    >
                      <span className="font-medium">
                        {installationAreaLabels[area]}
                      </span>
                      {installationArea === area && (
                        <Check className="h-5 w-5 text-primary" />
                      )}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Calculate Button */}
            <div className="border-t pt-6">
              <Button
                onClick={handleCalculate}
                disabled={!isFormComplete}
                className="w-full h-14 text-lg font-semibold"
                size="lg"
                data-testid="button-calculate"
              >
                <Calculator className="mr-2 h-5 w-5" />
                견적 확인하기
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quote Result */}
        {showResult && quote && (
          <Card className="mb-6 border-primary/20 bg-primary/5">
            <CardHeader className="pb-4">
              <CardTitle className="text-center text-xl">견적 결과</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Summary */}
              <div className="rounded-lg bg-background p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">아파트 타입</span>
                  <span className="font-medium">{apartmentTypeLabels[apartmentType!]}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">평수</span>
                  <span className="font-medium">{sizeRangeLabels[sizeRange!]}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">시공 공간</span>
                  <span className="font-medium">{installationAreaLabels[installationArea!]}</span>
                </div>
              </div>

              {/* Price Details */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">예상 매트 수량</span>
                  <span className="font-semibold">{quote.sheets}장</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">장당 가격</span>
                  <span className="font-medium">₩{formatPrice(quote.pricePerSheet)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex items-end justify-between">
                    <span className="text-base font-medium">예상 견적가</span>
                    <div className="text-right">
                      <span className="text-3xl font-bold text-primary" data-testid="text-total-price">
                        ₩{formatPrice(quote.totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-3 pt-2">
                <a
                  href="tel:031-483-7400"
                  className="flex h-12 items-center justify-center gap-2 rounded-lg bg-primary font-semibold text-primary-foreground hover-elevate active-elevate-2"
                  data-testid="link-call-quote"
                >
                  <Phone className="h-5 w-5" />
                  전화 상담 요청
                </a>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="h-12"
                  data-testid="button-reset"
                >
                  다시 계산하기
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notes Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertCircle className="h-5 w-5 text-muted-foreground" />
              유의사항
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              표준조견표 기준 (최소 수량: 60장)
            </p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-muted-foreground">•</span>
                <span>
                  시공 환경에 따라 표준조견표와 <strong className="text-foreground">±5% 차이</strong>가 있을 수 있습니다.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-muted-foreground">•</span>
                <span>
                  현장 조건에 따라 실제 필요 장수가 달라질 수 있으니 <strong className="text-foreground">정확한 견적은 실측 후</strong> 안내드립니다.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-muted-foreground">•</span>
                <span>
                  프로모션, 무이자, 혜택은 <strong className="text-foreground">제휴카드 및 기간 조건</strong>에 따라 변동될 수 있습니다.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-muted-foreground">•</span>
                <span>
                  시공 전 반드시 <strong className="text-foreground">현장 실측 상담</strong>을 통해 정확한 수량과 금액을 확인하시기 바랍니다.
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="mt-12 border-t pt-8 pb-8 text-center">
          <div className="space-y-2">
            <p className="text-base font-semibold text-foreground">롯데하이마트 안산선부점</p>
            <a
              href="tel:031-483-7400"
              className="inline-flex items-center gap-2 text-primary"
              data-testid="link-footer-phone"
            >
              <Phone className="h-4 w-4" />
              031-483-7400
            </a>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            본 견적은 참고용이며, 정확한 금액은 현장 실측 후 안내드립니다.
          </p>
        </footer>
      </main>
    </div>
  );
}
