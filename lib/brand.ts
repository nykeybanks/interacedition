export type BrandAsset = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

export const qyxBrandAssets = {
  emblem: { src: "/brand/q-emblem-silver-metallic.png", width: 185, height: 82, alt: "QYX Q emblem" },
  qyxLockup: { src: "/brand/horizontal-qyx-transparent.png", width: 240, height: 65, alt: "QYX QuantumYield" },
  quantumyield: { src: "/brand/quantumyield-silver-metallic.png", width: 185, height: 33, alt: "QuantumYield" },
  qyx20: { src: "/brand/qyx20-white.png", width: 183, height: 50, alt: "QYX20" },
  qyxpay: { src: "/brand/qyxpay-white.png", width: 252, height: 80, alt: "QYXpay" },
  qyxos: { src: "/brand/qyxos-white.png", width: 183, height: 63, alt: "QYXos" },
  qyxai: { src: "/brand/qyxai-white.png", width: 183, height: 56, alt: "QYXai" },
} as const satisfies Record<string, BrandAsset>;

export type BrandAssetKey = keyof typeof qyxBrandAssets;
