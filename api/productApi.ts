
export interface OeNumber {
  oe: string;
  ref: string;
}

export interface Criterion {
  key: string;
  value: string;
}

export interface ProductDetailData {
  oeNumbers: OeNumber[];
  criteria: Criterion[];
  notes: string[];
}

/**
 * Mock API to fetch technical details for a product.
 * In production, this would call a real backend endpoint.
 */
export const fetchProductDetails = async (brand: string, artNr: string): Promise<ProductDetailData> => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 600));

  return {
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
    notes: [
      "Article status: Normal availability.",
      "Requires standard mounting kit MK-122 for installation on Actros MP4 chassis.",
      "Check axle alignment after replacement of cab suspension components."
    ]
  };
};
