"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProductFilters } from "@/components/shop/ProductFilters";
import { ProductGrid } from "@/components/shop/ProductGrid";

export default function TiendaPage() {
  const [filters, setFilters] = useState<{ category?: string; search?: string }>({});

  return (
    <div>
      <PageHeader
        title="Tienda online"
        subtitle="Encargá cortes argentinos, embutidos caseros y dulces típicos desde Barcelona"
        backgroundImage="https://speedy.uenicdn.com/c2e720ac-5428-4cd8-a240-55d5ced204a1/c1536_a/image/upload/v1627588859/business/14c477c3-9ca8-43b4-84bf-5785886f7741.jpg"
      />

      <section className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[linear-gradient(150deg,rgba(18,2,0,0.9)_0%,rgba(48,6,0,0.85)_45%,rgba(18,2,0,0.92)_100%)]" aria-hidden />
        <div className="relative grid gap-10 lg:grid-cols-[280px_1fr]">
          <ProductFilters onFilterChange={setFilters} />
          <div className="mt-10 lg:mt-0">
            <ProductGrid category={filters.category} search={filters.search} />
          </div>
        </div>
      </section>
    </div>
  );
}
