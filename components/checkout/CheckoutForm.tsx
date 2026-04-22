"use client";

import {
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { IconArrow, IconCheck, IconCross } from "@/components/atoms/Icon";
import { mockAddresses, mockUser } from "@/lib/data/account";

export type ShipMode = "domicilio" | "sucursal";
export type PayMode = "tarjeta" | "mp" | "efectivo";

interface Props {
  onSubmit: () => void;
  submitting: boolean;
}

type Errors = Record<string, string | undefined>;

export function CheckoutForm({ onSubmit, submitting }: Props) {
  const defaultAddress = mockAddresses.find((a) => a.isDefault) ?? mockAddresses[0];
  const [shipMode, setShipMode] = useState<ShipMode>("domicilio");
  const [payMode, setPayMode] = useState<PayMode>("tarjeta");
  const [errors, setErrors] = useState<Errors>({});
  const formRef = useRef<HTMLFormElement>(null);
  const termsId = useId();
  const errSummaryId = useId();

  const validate = (data: FormData): Errors => {
    const e: Errors = {};
    const required = (name: string, label: string) => {
      const v = String(data.get(name) ?? "").trim();
      if (!v) e[name] = `${label} es obligatorio`;
      return v;
    };

    const email = required("email", "Email");
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.email = "Ingresá un email válido";
    }
    const phone = required("phone", "Teléfono");
    if (phone && phone.replace(/\D/g, "").length < 8) {
      e.phone = "Ingresá un teléfono válido";
    }

    if (shipMode === "domicilio") {
      required("name", "Nombre");
      required("dni", "DNI");
      required("street", "Calle y número");
      required("zip", "Código postal");
      required("city", "Ciudad");
      required("province", "Provincia");
    }

    if (payMode === "tarjeta") {
      const card = String(data.get("card") ?? "").replace(/\s+/g, "");
      if (!card) e.card = "Ingresá el número de tarjeta";
      else if (!/^\d{13,19}$/.test(card)) e.card = "Número inválido (13 a 19 dígitos)";

      required("cardName", "Nombre como figura en la tarjeta");

      const exp = String(data.get("exp") ?? "").trim();
      if (!exp) e.exp = "Ingresá el vencimiento";
      else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(exp)) e.exp = "Formato MM/AA";

      const cvv = String(data.get("cvv") ?? "").trim();
      if (!cvv) e.cvv = "Ingresá el CVV";
      else if (!/^\d{3,4}$/.test(cvv)) e.cvv = "3 o 4 dígitos";
    }

    if (!data.get("terms")) e.terms = "Tenés que aceptar los términos";

    return e;
  };

  const handle = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next = validate(data);
    setErrors(next);
    const firstErr = Object.keys(next)[0];
    if (firstErr) {
      const el = formRef.current?.querySelector<HTMLElement>(`[name="${firstErr}"]`);
      el?.focus();
      return;
    }
    onSubmit();
  };

  const errCount = Object.values(errors).filter(Boolean).length;

  return (
    <form ref={formRef} onSubmit={handle} className="flex flex-col gap-4" noValidate>
      <section className="pro-card" style={{ padding: 20 }}>
        <SectionTitle step={1} title="Datos de contacto" />
        <div className="grid gap-3 md:grid-cols-2 mt-4">
          <Field label="Email" name="email" error={errors.email}>
            <input
              className="pro-input"
              type="email"
              name="email"
              autoComplete="email"
              defaultValue={mockUser.email}
              aria-required="true"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-err" : undefined}
            />
          </Field>
          <Field label="Teléfono" name="phone" error={errors.phone}>
            <input
              className="pro-input"
              type="tel"
              name="phone"
              autoComplete="tel"
              defaultValue={mockUser.phone}
              aria-required="true"
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "phone-err" : undefined}
            />
          </Field>
        </div>
      </section>

      <section className="pro-card" style={{ padding: 20 }}>
        <SectionTitle step={2} title="Envío" />

        <RadioGroup
          label="Método de envío"
          value={shipMode}
          onChange={setShipMode}
          options={[
            {
              value: "domicilio",
              title: "Envío a domicilio",
              sub: "24-48 hs · Gratis desde $20.000",
            },
            {
              value: "sucursal",
              title: "Retiro en sucursal",
              sub: "Av. Balbín 4702, San Miguel · Hoy mismo",
            },
          ]}
          render={(opt, on, props) => (
            <ModeOption on={on} title={opt.title} sub={opt.sub} {...props} />
          )}
          className="grid gap-2 md:grid-cols-2 mt-4"
        />

        {shipMode === "domicilio" ? (
          <div className="grid gap-3 md:grid-cols-2 mt-4">
            <Field label="Nombre y apellido" name="name" error={errors.name}>
              <input
                className="pro-input"
                name="name"
                autoComplete="name"
                defaultValue={defaultAddress.name}
                aria-required="true"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-err" : undefined}
              />
            </Field>
            <Field label="DNI" name="dni" error={errors.dni}>
              <input
                className="pro-input"
                name="dni"
                inputMode="numeric"
                defaultValue={mockUser.dni}
                aria-required="true"
                aria-invalid={!!errors.dni}
                aria-describedby={errors.dni ? "dni-err" : undefined}
              />
            </Field>
            <Field label="Calle y número" name="street" error={errors.street} span={2}>
              <input
                className="pro-input"
                name="street"
                autoComplete="address-line1"
                defaultValue={defaultAddress.street}
                aria-required="true"
                aria-invalid={!!errors.street}
                aria-describedby={errors.street ? "street-err" : undefined}
              />
            </Field>
            <Field label="Piso / Depto (opcional)" name="unit">
              <input
                className="pro-input"
                name="unit"
                autoComplete="address-line2"
                defaultValue={defaultAddress.unit ?? ""}
              />
            </Field>
            <Field label="Código postal" name="zip" error={errors.zip}>
              <input
                className="pro-input"
                name="zip"
                inputMode="numeric"
                autoComplete="postal-code"
                defaultValue={defaultAddress.zip}
                aria-required="true"
                aria-invalid={!!errors.zip}
                aria-describedby={errors.zip ? "zip-err" : undefined}
              />
            </Field>
            <Field label="Ciudad" name="city" error={errors.city}>
              <input
                className="pro-input"
                name="city"
                autoComplete="address-level2"
                defaultValue={defaultAddress.city}
                aria-required="true"
                aria-invalid={!!errors.city}
                aria-describedby={errors.city ? "city-err" : undefined}
              />
            </Field>
            <Field label="Provincia" name="province" error={errors.province}>
              <input
                className="pro-input"
                name="province"
                autoComplete="address-level1"
                defaultValue={defaultAddress.province}
                aria-required="true"
                aria-invalid={!!errors.province}
                aria-describedby={errors.province ? "province-err" : undefined}
              />
            </Field>
          </div>
        ) : (
          <div
            className="mt-4 rounded-[12px] p-4 flex items-start gap-3 text-[13px]"
            style={{ background: "#FBF7F3", color: "#4A3D54" }}
          >
            <span
              className="grid place-items-center rounded-full flex-shrink-0"
              style={{ width: 34, height: 34, background: "#F4EEF7", color: "#5C1A6E" }}
            >
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

        <RadioGroup
          label="Método de pago"
          value={payMode}
          onChange={setPayMode}
          options={[
            {
              value: "tarjeta",
              title: "Tarjeta de crédito o débito",
              sub: "Visa · Mastercard · American Express · Cuotas sin interés",
            },
            {
              value: "mp",
              title: "Mercado Pago",
              sub: "Pagá con dinero en cuenta o tarjeta guardada",
            },
            {
              value: "efectivo",
              title: "Efectivo en sucursal",
              sub: "Reservá y pagá al retirar",
            },
          ]}
          render={(opt, on, props) => (
            <PayOption on={on} title={opt.title} sub={opt.sub} {...props} />
          )}
          className="flex flex-col gap-2 mt-4"
        />

        {payMode === "tarjeta" && (
          <div className="grid gap-3 md:grid-cols-2 mt-4">
            <Field label="Número de tarjeta" name="card" error={errors.card} span={2}>
              <input
                className="pro-input"
                name="card"
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="4509 9535 6623 3704"
                aria-required="true"
                aria-invalid={!!errors.card}
                aria-describedby={errors.card ? "card-err" : undefined}
              />
            </Field>
            <Field
              label="Nombre como figura en la tarjeta"
              name="cardName"
              error={errors.cardName}
              span={2}
            >
              <input
                className="pro-input"
                name="cardName"
                autoComplete="cc-name"
                defaultValue={mockUser.firstName + " " + mockUser.lastName}
                aria-required="true"
                aria-invalid={!!errors.cardName}
                aria-describedby={errors.cardName ? "cardName-err" : undefined}
              />
            </Field>
            <Field label="Vencimiento" name="exp" error={errors.exp}>
              <input
                className="pro-input"
                name="exp"
                autoComplete="cc-exp"
                placeholder="MM/AA"
                aria-required="true"
                aria-invalid={!!errors.exp}
                aria-describedby={errors.exp ? "exp-err" : undefined}
              />
            </Field>
            <Field label="CVV" name="cvv" error={errors.cvv}>
              <input
                className="pro-input"
                name="cvv"
                placeholder="123"
                inputMode="numeric"
                autoComplete="cc-csc"
                aria-required="true"
                aria-invalid={!!errors.cvv}
                aria-describedby={errors.cvv ? "cvv-err" : undefined}
              />
            </Field>
            <Field label="Cuotas" name="installments" span={2}>
              <select
                className="pro-input"
                name="installments"
                defaultValue="3"
                style={{ background: "#fff" }}
              >
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
        <label className="block mt-3">
          <span className="pro-sr-only">Notas para el repartidor</span>
          <textarea
            name="notes"
            className="pro-input"
            rows={3}
            placeholder="Ej. Tocar timbre 3B. Si no estoy, dejalo al encargado."
            style={{ resize: "vertical" }}
          />
        </label>
      </section>

      <div className="flex items-start gap-2 text-[13px] px-1" style={{ color: "#4A3D54" }}>
        <input
          id={termsId}
          name="terms"
          type="checkbox"
          defaultChecked
          aria-required="true"
          aria-invalid={!!errors.terms}
          aria-describedby={errors.terms ? "terms-err" : undefined}
          className="mt-0.5"
        />
        <label htmlFor={termsId}>
          Acepto los{" "}
          <a className="underline" href="#" style={{ color: "var(--pro-primary)" }}>
            términos y condiciones
          </a>{" "}
          y la política de privacidad.
        </label>
      </div>
      {errors.terms && (
        <p
          id="terms-err"
          role="alert"
          className="text-[12px] -mt-2 px-1"
          style={{ color: "#C2185B" }}
        >
          {errors.terms}
        </p>
      )}

      {errCount > 0 && (
        <p
          id={errSummaryId}
          role="alert"
          aria-live="assertive"
          className="text-[13px] rounded-[10px] px-3 py-2"
          style={{ background: "#FBEAF0", color: "#8A1A3E" }}
        >
          Revisá los {errCount === 1 ? "datos" : `${errCount} campos`} marcados antes de continuar.
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="pro-btn pro-btn-primary"
        style={{
          padding: "16px 24px",
          fontSize: 15,
          width: "100%",
          opacity: submitting ? 0.7 : 1,
        }}
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
        aria-hidden="true"
        className="grid place-items-center rounded-full text-[13px] font-semibold"
        style={{
          width: 26,
          height: 26,
          background: "var(--pro-primary-50)",
          color: "var(--pro-primary)",
        }}
      >
        {step}
      </span>
      <h2 className="pro-serif text-[22px]" style={{ color: "#1A1320" }}>
        {title}
      </h2>
    </div>
  );
}

function Field({
  label,
  name,
  children,
  error,
  span = 1,
}: {
  label: string;
  name: string;
  children: ReactNode;
  error?: string;
  span?: 1 | 2;
}) {
  return (
    <label className="block" style={{ gridColumn: span === 2 ? "1 / -1" : undefined }}>
      <span
        className="block text-[11px] font-semibold uppercase tracking-[0.06em] mb-1.5"
        style={{ color: "#7A7185" }}
      >
        {label}
      </span>
      {children}
      {error && (
        <p
          id={`${name}-err`}
          role="alert"
          className="text-[12px] mt-1"
          style={{ color: "#C2185B" }}
        >
          {error}
        </p>
      )}
    </label>
  );
}

interface RadioOption<T extends string> {
  value: T;
  title: string;
  sub: string;
}

interface RadioRenderProps {
  onClick: () => void;
  onKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => void;
  tabIndex: number;
  role: "radio";
  "aria-checked": boolean;
}

function RadioGroup<T extends string>({
  label,
  value,
  onChange,
  options,
  render,
  className,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: RadioOption<T>[];
  render: (opt: RadioOption<T>, on: boolean, props: RadioRenderProps) => ReactNode;
  className?: string;
}) {
  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    let next = i;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (i + 1) % options.length;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (i - 1 + options.length) % options.length;
    else if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      onChange(options[i].value);
      return;
    } else return;
    e.preventDefault();
    onChange(options[next].value);
    const group = e.currentTarget.closest('[role="radiogroup"]');
    const buttons = group?.querySelectorAll<HTMLButtonElement>('[role="radio"]');
    buttons?.[next]?.focus();
  };
  return (
    <div role="radiogroup" aria-label={label} className={className}>
      {options.map((opt, i) => {
        const on = opt.value === value;
        const props: RadioRenderProps = {
          onClick: () => onChange(opt.value),
          onKeyDown: (e) => onKey(e, i),
          tabIndex: on ? 0 : -1,
          role: "radio",
          "aria-checked": on,
        };
        return <span key={opt.value}>{render(opt, on, props)}</span>;
      })}
    </div>
  );
}

interface OptionViewProps extends RadioRenderProps {
  on: boolean;
  title: string;
  sub: string;
}

function ModeOption({ on, onClick, onKeyDown, tabIndex, title, sub, ...rest }: OptionViewProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      onKeyDown={onKeyDown}
      tabIndex={tabIndex}
      className="text-left cursor-pointer w-full"
      style={{
        padding: 14,
        borderRadius: 12,
        border: on ? "2px solid #1A1320" : "1px solid var(--pro-line)",
        background: on ? "var(--pro-primary-50)" : "#fff",
      }}
      {...rest}
    >
      <div className="flex items-center justify-between">
        <div className="text-[14px] font-semibold" style={{ color: "#1A1320" }}>
          {title}
        </div>
        <span
          aria-hidden="true"
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

function PayOption({ on, onClick, onKeyDown, tabIndex, title, sub, ...rest }: OptionViewProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      onKeyDown={onKeyDown}
      tabIndex={tabIndex}
      className="text-left cursor-pointer flex items-start gap-3 w-full"
      style={{
        padding: 14,
        borderRadius: 12,
        border: on ? "2px solid #1A1320" : "1px solid var(--pro-line)",
        background: on ? "var(--pro-primary-50)" : "#fff",
      }}
      {...rest}
    >
      <span
        aria-hidden="true"
        className="grid place-items-center rounded-full flex-shrink-0 mt-0.5"
        style={{
          width: 18,
          height: 18,
          border: on ? "5px solid var(--pro-primary)" : "1.5px solid var(--pro-line)",
          background: "#fff",
        }}
      />
      <div className="flex-1">
        <div
          className="text-[14px] font-semibold flex items-center gap-2"
          style={{ color: "#1A1320" }}
        >
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
