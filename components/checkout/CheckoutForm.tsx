"use client";

import { useState, type FormEvent } from "react";
import { IconArrow, IconCheck, IconCross } from "@/components/atoms/Icon";
import { mockAddresses, mockUser } from "@/lib/data/account";

export type ShipMode = "domicilio" | "sucursal";
export type PayMode = "tarjeta" | "mp" | "efectivo";

interface Props {
  onSubmit: () => void;
  submitting: boolean;
}

export function CheckoutForm({ onSubmit, submitting }: Props) {
  const defaultAddress = mockAddresses.find((a) => a.isDefault) ?? mockAddresses[0];
  const [email, setEmail] = useState(mockUser.email);
  const [phone, setPhone] = useState(mockUser.phone);
  const [shipMode, setShipMode] = useState<ShipMode>("domicilio");
  const [payMode, setPayMode] = useState<PayMode>("tarjeta");

  const handle = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handle} className="flex flex-col gap-4">
      <section className="pro-card" style={{ padding: 20 }}>
        <SectionTitle step={1} title="Datos de contacto" />
        <div className="grid gap-3 md:grid-cols-2 mt-4">
          <Field label="Email">
            <input
              className="pro-input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Field label="Teléfono">
            <input
              className="pro-input"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </Field>
        </div>
      </section>

      <section className="pro-card" style={{ padding: 20 }}>
        <SectionTitle step={2} title="Envío" />

        <div className="grid gap-2 md:grid-cols-2 mt-4">
          <ModeOption
            on={shipMode === "domicilio"}
            onClick={() => setShipMode("domicilio")}
            title="Envío a domicilio"
            sub="24-48 hs · Gratis desde $20.000"
          />
          <ModeOption
            on={shipMode === "sucursal"}
            onClick={() => setShipMode("sucursal")}
            title="Retiro en sucursal"
            sub="Av. Balbín 4702, San Miguel · Hoy mismo"
          />
        </div>

        {shipMode === "domicilio" ? (
          <div className="grid gap-3 md:grid-cols-2 mt-4">
            <Field label="Nombre y apellido">
              <input className="pro-input" required defaultValue={defaultAddress.name} />
            </Field>
            <Field label="DNI">
              <input className="pro-input" required defaultValue={mockUser.dni} />
            </Field>
            <Field label="Calle y número" span={2}>
              <input className="pro-input" required defaultValue={defaultAddress.street} />
            </Field>
            <Field label="Piso / Depto (opcional)">
              <input className="pro-input" defaultValue={defaultAddress.unit ?? ""} />
            </Field>
            <Field label="Código postal">
              <input className="pro-input" required defaultValue={defaultAddress.zip} />
            </Field>
            <Field label="Ciudad">
              <input className="pro-input" required defaultValue={defaultAddress.city} />
            </Field>
            <Field label="Provincia">
              <input className="pro-input" required defaultValue={defaultAddress.province} />
            </Field>
          </div>
        ) : (
          <div
            className="mt-4 rounded-[12px] p-4 flex items-start gap-3 text-[13px]"
            style={{ background: "#FBF7F3", color: "#4A3D54" }}
          >
            <span className="grid place-items-center rounded-full flex-shrink-0" style={{ width: 34, height: 34, background: "#F4EEF7", color: "#5C1A6E" }}>
              <IconCross size={16} stroke="#5C1A6E" />
            </span>
            <div>
              <div className="font-semibold text-[14px]" style={{ color: "#1A1320" }}>
                Farmacia Vázquez · Casa Central
              </div>
              <div className="mt-0.5">Av. Presidente Arturo Illia 4702, San Miguel</div>
              <div className="mt-0.5" style={{ color: "#7A7185" }}>
                Lunes a sábados · 9 a 21 hs
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="pro-card" style={{ padding: 20 }}>
        <SectionTitle step={3} title="Pago" />

        <div className="flex flex-col gap-2 mt-4">
          <PayOption on={payMode === "tarjeta"} onClick={() => setPayMode("tarjeta")} title="Tarjeta de crédito o débito" sub="Visa · Mastercard · American Express · Cuotas sin interés" />
          <PayOption on={payMode === "mp"} onClick={() => setPayMode("mp")} title="Mercado Pago" sub="Pagá con dinero en cuenta o tarjeta guardada" />
          <PayOption on={payMode === "efectivo"} onClick={() => setPayMode("efectivo")} title="Efectivo en sucursal" sub="Reservá y pagá al retirar" />
        </div>

        {payMode === "tarjeta" && (
          <div className="grid gap-3 md:grid-cols-2 mt-4">
            <Field label="Número de tarjeta" span={2}>
              <input className="pro-input" inputMode="numeric" placeholder="4509 9535 6623 3704" required />
            </Field>
            <Field label="Nombre como figura en la tarjeta" span={2}>
              <input className="pro-input" required defaultValue={mockUser.firstName + " " + mockUser.lastName} />
            </Field>
            <Field label="Vencimiento">
              <input className="pro-input" placeholder="MM/AA" required />
            </Field>
            <Field label="CVV">
              <input className="pro-input" placeholder="123" inputMode="numeric" required />
            </Field>
            <Field label="Cuotas" span={2}>
              <select className="pro-input" defaultValue="3" style={{ background: "#fff" }}>
                <option value="1">1 pago</option>
                <option value="3">3 cuotas sin interés</option>
                <option value="6">6 cuotas sin interés</option>
                <option value="12">12 cuotas</option>
              </select>
            </Field>
          </div>
        )}
      </section>

      <section className="pro-card" style={{ padding: 20 }}>
        <SectionTitle step={4} title="Notas para el repartidor (opcional)" />
        <textarea
          className="pro-input mt-3"
          rows={3}
          placeholder="Ej. Tocar timbre 3B. Si no estoy, dejalo al encargado."
          style={{ resize: "vertical" }}
        />
      </section>

      <label className="flex items-start gap-2 text-[13px] px-1" style={{ color: "#4A3D54" }}>
        <input type="checkbox" required defaultChecked className="mt-0.5" />
        <span>
          Acepto los <a className="underline" style={{ color: "var(--pro-primary)" }}>términos y condiciones</a> y la política de privacidad.
        </span>
      </label>

      <button
        type="submit"
        disabled={submitting}
        className="pro-btn pro-btn-primary"
        style={{ padding: "16px 24px", fontSize: 15, width: "100%", opacity: submitting ? 0.7 : 1 }}
      >
        {submitting ? "Procesando..." : "Realizar pedido"} <IconArrow size={16} />
      </button>
      <p className="text-center text-[11px] -mt-1" style={{ color: "#7A7185" }}>
        Al confirmar vas a recibir un email con el resumen del pedido.
      </p>
    </form>
  );
}

function SectionTitle({ step, title }: { step: number; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="grid place-items-center rounded-full text-[13px] font-semibold"
        style={{ width: 26, height: 26, background: "var(--pro-primary-50)", color: "var(--pro-primary)" }}
      >
        {step}
      </span>
      <h2 className="pro-serif text-[22px]" style={{ color: "#1A1320" }}>
        {title}
      </h2>
    </div>
  );
}

function Field({ label, children, span = 1 }: { label: string; children: React.ReactNode; span?: 1 | 2 }) {
  return (
    <label className="block" style={{ gridColumn: span === 2 ? "1 / -1" : undefined }}>
      <div className="text-[11px] font-semibold uppercase tracking-[0.06em] mb-1.5" style={{ color: "#7A7185" }}>
        {label}
      </div>
      {children}
    </label>
  );
}

function ModeOption({ on, onClick, title, sub }: { on: boolean; onClick: () => void; title: string; sub: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left cursor-pointer"
      style={{
        padding: 14,
        borderRadius: 12,
        border: on ? "2px solid #1A1320" : "1px solid var(--pro-line)",
        background: on ? "var(--pro-primary-50)" : "#fff",
      }}
    >
      <div className="flex items-center justify-between">
        <div className="text-[14px] font-semibold" style={{ color: "#1A1320" }}>
          {title}
        </div>
        <span
          className="grid place-items-center rounded-full"
          style={{
            width: 18,
            height: 18,
            border: on ? "5px solid var(--pro-primary)" : "1.5px solid var(--pro-line)",
            background: "#fff",
          }}
        />
      </div>
      <div className="text-[12px] mt-1" style={{ color: "#7A7185" }}>
        {sub}
      </div>
    </button>
  );
}

function PayOption({ on, onClick, title, sub }: { on: boolean; onClick: () => void; title: string; sub: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left cursor-pointer flex items-start gap-3"
      style={{
        padding: 14,
        borderRadius: 12,
        border: on ? "2px solid #1A1320" : "1px solid var(--pro-line)",
        background: on ? "var(--pro-primary-50)" : "#fff",
      }}
    >
      <span
        className="grid place-items-center rounded-full flex-shrink-0 mt-0.5"
        style={{
          width: 18,
          height: 18,
          border: on ? "5px solid var(--pro-primary)" : "1.5px solid var(--pro-line)",
          background: "#fff",
        }}
      />
      <div className="flex-1">
        <div className="text-[14px] font-semibold flex items-center gap-2" style={{ color: "#1A1320" }}>
          {title}
          {on && <IconCheck size={14} stroke="#046B3A" />}
        </div>
        <div className="text-[12px] mt-0.5" style={{ color: "#7A7185" }}>
          {sub}
        </div>
      </div>
    </button>
  );
}
