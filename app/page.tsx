import { BrandStrip } from "@/components/sections/BrandStrip";
import { CategoryGrid } from "@/components/sections/CategoryGrid";
import { Conditions } from "@/components/sections/Conditions";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { Hero } from "@/components/sections/Hero";
import { PromoCarousel } from "@/components/sections/PromoCarousel";
import { RxUpload } from "@/components/sections/RxUpload";
import { Staff } from "@/components/sections/Staff";
import { TrustBar } from "@/components/sections/TrustBar";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <CategoryGrid />
      <Conditions />
      <FeaturedProducts />
      <PromoCarousel />
      <RxUpload />
      <BrandStrip />
      <Staff />
    </>
  );
}
