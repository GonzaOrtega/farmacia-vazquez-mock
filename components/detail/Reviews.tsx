import { IconStar } from "@/components/atoms/Icon";
import { getReviewsFor } from "@/lib/data/reviews";
import type { Product } from "@/types/product";

export function Reviews({ p }: { p: Product }) {
  const reviews = getReviewsFor(p.id);
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));
  const total = reviews.length || 1;

  return (
    <div id="reviews" className="py-8">
      <h3 className="pro-serif text-[28px] mb-4" style={{ color: "#1A1320" }}>
        Reseñas de clientes
      </h3>
      <div className="grid md:grid-cols-[240px_1fr] gap-8 items-start">
        <div
          className="rounded-[14px] text-center"
          style={{ background: "#FBF7F3", padding: 20 }}
        >
          <div
            className="pro-serif text-[54px] leading-none"
            style={{ color: "#1A1320" }}
          >
            {p.rating.toFixed(1)}
          </div>
          <div className="inline-flex gap-0.5 mt-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <IconStar
                key={i}
                size={14}
                stroke={i <= Math.round(p.rating) ? "#B45309" : "#D8D2DC"}
                fill={i <= Math.round(p.rating) ? "#B45309" : "#D8D2DC"}
              />
            ))}
          </div>
          <div className="text-[12px] mt-1" style={{ color: "#7A7185" }}>
            {p.reviews} reseñas verificadas
          </div>
          <button
            type="button"
            className="pro-btn pro-btn-primary mt-3.5 w-full"
            style={{ padding: "10px 14px", fontSize: 12 }}
          >
            Escribir una reseña
          </button>
        </div>
        <div>
          {dist.map((d) => (
            <div
              key={d.star}
              className="grid grid-cols-[40px_1fr_40px] items-center gap-2.5 mb-1.5 text-[12px]"
              style={{ color: "#4A3D54" }}
            >
              <div className="inline-flex items-center gap-0.5">
                {d.star}
                <IconStar size={11} stroke="#B45309" fill="#B45309" />
              </div>
              <div
                className="h-1.5 rounded-full overflow-hidden"
                style={{ background: "#F0E8EE" }}
              >
                <div
                  className="h-full"
                  style={{ width: `${(d.count / total) * 100}%`, background: "#B45309" }}
                />
              </div>
              <div className="text-right" style={{ color: "#7A7185" }}>
                {d.count}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-3.5">
        {reviews.map((r) => (
          <div
            key={r.id}
            className="rounded-[12px]"
            style={{ padding: 18, background: "#fff", border: "1px solid var(--pro-line-2)" }}
          >
            <div className="flex justify-between items-start mb-1.5">
              <div>
                <div className="text-[14px] font-semibold" style={{ color: "#1A1320" }}>
                  {r.name}
                  {r.verified && (
                    <span
                      className="ml-1.5 text-[11px] font-medium"
                      style={{ color: "#046B3A" }}
                    >
                      ✓ Compra verificada
                    </span>
                  )}
                </div>
                <div className="inline-flex gap-px mt-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <IconStar
                      key={i}
                      size={11}
                      stroke={i <= r.rating ? "#B45309" : "#D8D2DC"}
                      fill={i <= r.rating ? "#B45309" : "#D8D2DC"}
                    />
                  ))}
                </div>
              </div>
              <div className="text-[11px]" style={{ color: "#7A7185" }}>
                {r.date}
              </div>
            </div>
            <div className="pro-serif text-[17px] mt-1.5" style={{ color: "#1A1320" }}>
              {r.title}
            </div>
            <p className="text-[13px] leading-[1.55] mt-1" style={{ color: "#4A3D54" }}>
              {r.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ReviewsMobile({ p }: { p: Product }) {
  const reviews = getReviewsFor(p.id).slice(0, 2);
  return (
    <div className="mt-6">
      <div className="flex justify-between items-end mb-3.5">
        <h3 className="pro-serif text-[22px]" style={{ color: "#1A1320" }}>
          Reseñas
        </h3>
        <div className="inline-flex items-center gap-1 text-[13px]" style={{ color: "#4A3D54" }}>
          <IconStar size={13} stroke="#B45309" fill="#B45309" />
          <span className="font-semibold" style={{ color: "#1A1320" }}>
            {p.rating}
          </span>
          <span style={{ color: "#7A7185" }}>({p.reviews})</span>
        </div>
      </div>
      <div className="grid gap-2.5">
        {reviews.map((r) => (
          <div key={r.id} className="rounded-[10px]" style={{ padding: 14, background: "#FBF7F3" }}>
            <div className="flex justify-between">
              <div className="text-[13px] font-semibold" style={{ color: "#1A1320" }}>
                {r.name}
              </div>
              <div className="inline-flex gap-px">
                {[1, 2, 3, 4, 5].map((i) => (
                  <IconStar
                    key={i}
                    size={10}
                    stroke={i <= r.rating ? "#B45309" : "#D8D2DC"}
                    fill={i <= r.rating ? "#B45309" : "#D8D2DC"}
                  />
                ))}
              </div>
            </div>
            <div className="pro-serif text-[15px] mt-1" style={{ color: "#1A1320" }}>
              {r.title}
            </div>
            <p className="text-[13px] mt-1" style={{ color: "#4A3D54" }}>
              {r.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
