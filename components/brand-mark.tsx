import Image from "next/image";
import { qyxBrandAssets, type BrandAssetKey } from "@/lib/brand";

export function BrandMark({
  asset,
  height,
  className,
  priority,
}: {
  asset: BrandAssetKey;
  height: number;
  className?: string;
  priority?: boolean;
}) {
  const item = qyxBrandAssets[asset];
  const width = Math.round((item.width / item.height) * height);
  return (
    <Image
      src={item.src}
      alt={item.alt}
      width={width}
      height={height}
      priority={priority}
      className={className}
      style={{ width, height }}
    />
  );
}
