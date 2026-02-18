
export interface OeNumber {
  oe: string;
  ref: string;
}

export interface Criterion {
  key: string;
  value: string;
}

export interface LinkageItem {
  make: string;
  model?: string;
  code?: string;
}

export interface ProductDetailExtra {
  replaces?: string;
  replacedBy?: string;
  oeNumbers: OeNumber[];
  criteria: Criterion[];
  vehicleLinkage: LinkageItem[];
  engineLinkages: LinkageItem[];
  axleLinkages: LinkageItem[];
  notes: string[];
}

/**
 * Mock API to fetch technical details for a product.
 */
export const fetchProductDetailExtra = async (brand: string, artNr: string): Promise<ProductDetailExtra> => {
  await new Promise(resolve => setTimeout(resolve, 600));

  return {
    replaces: "312 647",
    replacedBy: "316 699",
    oeNumbers: [
      { oe: "005 323 12 00", ref: "Mercedes-Benz" },
      { oe: "006 323 09 00", ref: "Mercedes-Benz" },
      { oe: "A 005 323 12 00", ref: "Mercedes-Benz" },
      { oe: "A 006 323 09 00", ref: "Mercedes-Benz" },
      { oe: "313 954", ref: "Sachs Ref." }
    ],
    criteria: [
      { key: "Parameter", value: "MSE27/13X36A2" },
      { key: "Shock Absorber System", value: "Twin-Tube" },
      { key: "Shock Absorber Type", value: "Gas Pressure" },
      { key: "Mounting Type", value: "Top Eye, Bottom Eye" },
      { key: "Min Length", value: "245 mm" },
      { key: "Max Length", value: "368 mm" },
      { key: "Piston Diameter", value: "27 mm" },
      { key: "Weight", value: "3.40 kg" }
    ],
    vehicleLinkage: Array(24).fill(null).map((_, i) => ({
      make: "MERCEDES-BENZ",
      model: `ACTROS MP4 / MP5 (Model ${100 + i})`
    })),
    engineLinkages: Array(36).fill(null).map((_, i) => ({
      make: "MERCEDES-BENZ",
      code: `OM 541.${940 + i}`
    })),
    axleLinkages: Array(36).fill(null).map((_, i) => ({
      make: "MERCEDES-BENZ",
      code: `Axle 941.${910 + i}`
    })),
    notes: [
      "Article status: Normal availability.",
      "Requires standard mounting kit MK-122 for installation on Actros MP4 chassis.",
      "Check axle alignment after replacement."
    ]
  };
};

// Legacy compatibility
export interface ProductDetailData extends ProductDetailExtra {}
export const fetchProductDetails = fetchProductDetailExtra;
