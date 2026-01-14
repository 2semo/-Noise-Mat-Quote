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
import { Phone, Calculator, AlertCircle, Check, CreditCard, Gift, Info } from "lucide-react";
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

// Price calculation logic based on standard pricing tables
function calculateQuote(
  apartmentType: ApartmentType,
  sizeRange: SizeRange,
  installationArea: InstallationArea
): QuoteResult {
  const pricePerSheet = 25000; // 장당 가격

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
        {showResult && quote && (() => {
          // 금액대별 캐시백: 100만원 구간별 5%
          const tierCashback = Math.floor(quote.totalPrice / 1000000) * 50000;
          // 첫 결제 할인: 결제금액의 3% 최대 3만원
          const firstPaymentDiscount = Math.min(Math.floor(quote.totalPrice * 0.03), 30000);
          // 최종 혜택가
          const finalBenefitPrice = quote.totalPrice - tierCashback - firstPaymentDiscount;
          // 24개월 무이자 할부
          const monthlyPayment = Math.ceil(quote.totalPrice / 24);
          // 매월 30만원 사용시 캐시백
          const monthlyCashback = 11000;
          // 최종 월 부담금
          const finalMonthlyPayment = monthlyPayment - monthlyCashback;

          return (
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
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">예상 필요 장수</p>
                    <p className="text-3xl font-bold" data-testid="text-sheets">{quote.sheets}장</p>
                  </div>
                  <div className="text-center border-t pt-4">
                    <p className="text-sm text-muted-foreground mb-1">총 시공 견적</p>
                    <p className="text-3xl font-bold text-primary" data-testid="text-total-price">
                      ₩{formatPrice(quote.totalPrice)}
                    </p>
                  </div>
                </div>

                {/* Card Benefits */}
                <div className="rounded-lg bg-background p-4 space-y-3">
                  <div className="flex items-center gap-2 mb-3">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <span className="font-semibold">혜택 내역</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">금액대별 캐시백</span>
                    <span className="font-medium text-destructive">-₩{formatPrice(tierCashback)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">첫 결제 할인</span>
                    <span className="font-medium text-destructive">-₩{formatPrice(firstPaymentDiscount)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-3">
                    <span className="font-semibold">최종 혜택가</span>
                    <span className="text-xl font-bold text-primary" data-testid="text-final-benefit-price">
                      ₩{formatPrice(finalBenefitPrice)}
                    </span>
                  </div>
                </div>

                {/* Installment */}
                <div className="rounded-lg bg-background p-4 space-y-3">
                  <div className="flex items-center gap-2 mb-3">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <span className="font-semibold text-sm">24개월 무이자 할부 + 매월 30만원 사용시 1.1만원 캐시백</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">월</span>
                    <span className="font-medium">₩{formatPrice(monthlyPayment)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">캐시백</span>
                    <span className="font-medium text-destructive">-₩{formatPrice(monthlyCashback)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-3">
                    <span className="font-semibold">최종 월 부담금</span>
                    <span className="text-xl font-bold text-primary" data-testid="text-final-monthly">
                      ₩{formatPrice(finalMonthlyPayment)}
                    </span>
                  </div>
                </div>

                {/* Gift Promotion */}
                {quote.sheets >= 100 && (
                  <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-4">
                    <div className="flex items-center gap-2">
                      <Gift className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      <span className="font-semibold text-amber-800 dark:text-amber-300">1월 한정 롯데모바일상품권</span>
                    </div>
                    <p className="mt-2 text-sm text-amber-700 dark:text-amber-400">
                      5만원 증정 (100장 이상 구매시)
                    </p>
                  </div>
                )}

                {/* Info Notice */}
                <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                  <Info className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    정확한 견적은 현장 실측 후 안내드립니다.
                  </p>
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
          );
        })()}

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
