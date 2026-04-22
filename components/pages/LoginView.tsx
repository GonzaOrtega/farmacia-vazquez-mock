"use client";

import {
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { IconArrow, IconCheck, IconShield } from "@/components/atoms/Icon";
import { useAuth } from "@/components/auth/useAuth";
import { mockUser } from "@/lib/data/account";

type Tab = "ingresar" | "crear";
type Errors = Record<string, string | undefined>;

const crumbs = [
  { label: "Inicio", href: "/" },
  { label: "Ingresar" },
];

const DEMO_EMAIL = mockUser.email;
const DEMO_PASSWORD = "demo1234";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginView() {
  const router = useRouter();
  const search = useSearchParams();
  const auth = useAuth();
  const goTo = search.get("next") || "/cuenta";

  const [tab, setTab] = useState<Tab>("ingresar");
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const switchTab = (t: Tab) => {
    setTab(t);
    setErrors({});
  };

  const onTabKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const order: Tab[] = ["ingresar", "crear"];
    const i = order.indexOf(tab);
    let j = i;
    if (e.key === "ArrowRight") j = (i + 1) % order.length;
    else if (e.key === "ArrowLeft") j = (i - 1 + order.length) % order.length;
    else if (e.key === "Home") j = 0;
    else if (e.key === "End") j = order.length - 1;
    else return;
    e.preventDefault();
    switchTab(order[j]);
    tabRefs.current[j]?.focus();
  };

  const validate = (data: FormData): Errors => {
    const e: Errors = {};
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");

    if (!email) e.email = "Ingresá tu email";
    else if (!EMAIL_RE.test(email)) e.email = "Ingresá un email válido";

    if (!password) e.password = "Ingresá tu contraseña";
    else if (password.length < 8) e.password = "Mínimo 8 caracteres";

    if (tab === "crear") {
      const firstName = String(data.get("firstName") ?? "").trim();
      const lastName = String(data.get("lastName") ?? "").trim();
      const confirm = String(data.get("confirm") ?? "");

      if (!firstName) e.firstName = "Ingresá tu nombre";
      if (!lastName) e.lastName = "Ingresá tu apellido";
      if (password && confirm !== password) e.confirm = "Las contraseñas no coinciden";
    }

    return e;
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const nextErrors = validate(data);
    setErrors(nextErrors);
    const firstErr = Object.keys(nextErrors)[0];
    if (firstErr) {
      const el = formRef.current?.querySelector<HTMLElement>(`[name="${firstErr}"]`);
      el?.focus();
      return;
    }

    setSubmitting(true);
    const email = String(data.get("email")).trim();
    window.setTimeout(() => {
      if (tab === "crear") {
        auth.signup({
          firstName: String(data.get("firstName")),
          lastName: String(data.get("lastName")),
          email,
        });
      } else {
        auth.login(email);
      }
      router.replace(goTo);
    }, 400);
  };

  const errCount = Object.values(errors).filter(Boolean).length;

  return (
    <>
      <div className="bg-white border-b border-[color:var(--pro-line)] px-4 py-4 md:px-12 md:py-6">
        <Breadcrumb items={crumbs} />
        <div className="mt-2">
          <div className="text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: "#5C1A6E" }}>
            Tu cuenta
          </div>
          <h1 className="pro-serif text-[32px] md:text-[44px] leading-[1.05] tracking-[-0.02em]" style={{ color: "#1A1320" }}>
            {tab === "ingresar" ? "Ingresá a tu cuenta" : "Creá tu cuenta"}
          </h1>
          <p className="text-[14px] md:text-[15px] mt-1.5" style={{ color: "#4A3D54" }}>
            {tab === "ingresar"
              ? "Entrá para finalizar tu compra, ver pedidos y guardar recetas."
              : "Sumate en un minuto y tené tu historial de compras en un solo lugar."}
          </p>
        </div>
      </div>

      <div className="px-4 py-6 md:px-12 md:py-10">
        <div className="grid gap-6 md:gap-10 md:grid-cols-[1fr_360px] items-start max-w-[1040px] mx-auto">
          <div className="pro-card" style={{ padding: 24 }}>
            <div
              role="tablist"
              aria-label="Tipo de acceso"
              onKeyDown={onTabKey}
              className="flex gap-1 mb-5"
              style={{ borderBottom: "1px solid var(--pro-line)" }}
            >
              {(["ingresar", "crear"] as Tab[]).map((t, i) => {
                const active = tab === t;
                return (
                  <button
                    key={t}
                    ref={(el) => {
                      tabRefs.current[i] = el;
                    }}
                    type="button"
                    role="tab"
                    id={`auth-tab-${t}`}
                    aria-selected={active}
                    aria-controls={`auth-panel-${t}`}
                    tabIndex={active ? 0 : -1}
                    onClick={() => switchTab(t)}
                    className="cursor-pointer"
                    style={{
                      padding: "12px 20px",
                      background: "transparent",
                      border: "none",
                      borderBottom: active ? "2px solid #1A1320" : "2px solid transparent",
                      color: active ? "#1A1320" : "#7A7185",
                      fontSize: 14,
                      fontWeight: active ? 600 : 500,
                    }}
                  >
                    {t === "ingresar" ? "Ingresar" : "Crear cuenta"}
                  </button>
                );
              })}
            </div>

            <div
              role="tabpanel"
              id={`auth-panel-${tab}`}
              aria-labelledby={`auth-tab-${tab}`}
            >
              {tab === "ingresar" && (
                <div
                  className="rounded-[10px] mb-4 flex items-start gap-3 text-[13px]"
                  style={{ padding: "12px 14px", background: "#FBF7F3", color: "#4A3D54" }}
                >
                  <span
                    aria-hidden="true"
                    className="grid place-items-center rounded-full flex-shrink-0"
                    style={{ width: 28, height: 28, background: "#F4EEF7", color: "#5C1A6E" }}
                  >
                    <IconShield size={14} stroke="#5C1A6E" />
                  </span>
                  <div>
                    <div className="font-semibold" style={{ color: "#1A1320" }}>
                      Demo
                    </div>
                    <div>
                      Este sitio es una maqueta — cualquier email y contraseña (8+ caracteres) funciona. Te dejamos unos completados para probar.
                    </div>
                  </div>
                </div>
              )}

              <form ref={formRef} onSubmit={submit} className="flex flex-col gap-3" noValidate>
                {tab === "crear" && (
                  <div className="grid gap-3 md:grid-cols-2">
                    <Field label="Nombre" name="firstName" error={errors.firstName}>
                      <input
                        className="pro-input"
                        name="firstName"
                        autoComplete="given-name"
                        aria-required="true"
                        aria-invalid={!!errors.firstName}
                        aria-describedby={errors.firstName ? "firstName-err" : undefined}
                      />
                    </Field>
                    <Field label="Apellido" name="lastName" error={errors.lastName}>
                      <input
                        className="pro-input"
                        name="lastName"
                        autoComplete="family-name"
                        aria-required="true"
                        aria-invalid={!!errors.lastName}
                        aria-describedby={errors.lastName ? "lastName-err" : undefined}
                      />
                    </Field>
                  </div>
                )}

                <Field label="Email" name="email" error={errors.email}>
                  <input
                    key={tab}
                    className="pro-input"
                    type="email"
                    name="email"
                    autoComplete="email"
                    defaultValue={tab === "ingresar" ? DEMO_EMAIL : ""}
                    aria-required="true"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-err" : undefined}
                  />
                </Field>

                <Field label="Contraseña" name="password" error={errors.password}>
                  <input
                    key={tab}
                    className="pro-input"
                    type="password"
                    name="password"
                    autoComplete={tab === "ingresar" ? "current-password" : "new-password"}
                    defaultValue={tab === "ingresar" ? DEMO_PASSWORD : ""}
                    aria-required="true"
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "password-err" : undefined}
                  />
                </Field>

                {tab === "crear" && (
                  <Field label="Repetí la contraseña" name="confirm" error={errors.confirm}>
                    <input
                      className="pro-input"
                      type="password"
                      name="confirm"
                      autoComplete="new-password"
                      aria-required="true"
                      aria-invalid={!!errors.confirm}
                      aria-describedby={errors.confirm ? "confirm-err" : undefined}
                    />
                  </Field>
                )}

                {errCount > 0 && (
                  <p
                    role="alert"
                    aria-live="assertive"
                    className="text-[13px] rounded-[10px] px-3 py-2 mt-1"
                    style={{ background: "#FBEAF0", color: "#8A1A3E" }}
                  >
                    Revisá los {errCount === 1 ? "datos" : `${errCount} campos`} marcados antes de continuar.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="pro-btn pro-btn-primary mt-2"
                  style={{ padding: "14px 22px", fontSize: 14, opacity: submitting ? 0.7 : 1 }}
                >
                  {submitting
                    ? "Procesando..."
                    : tab === "ingresar"
                      ? "Ingresar"
                      : "Crear cuenta"}{" "}
                  <IconArrow size={16} />
                </button>

                {tab === "ingresar" && (
                  <p className="text-center text-[12px] mt-1" style={{ color: "#7A7185" }}>
                    ¿Todavía no tenés cuenta?{" "}
                    <button
                      type="button"
                      onClick={() => switchTab("crear")}
                      className="cursor-pointer bg-transparent border-none underline"
                      style={{ color: "var(--pro-primary)", font: "inherit" }}
                    >
                      Creala en un minuto
                    </button>
                    .
                  </p>
                )}
                {tab === "crear" && (
                  <p className="text-center text-[12px] mt-1" style={{ color: "#7A7185" }}>
                    ¿Ya tenés cuenta?{" "}
                    <button
                      type="button"
                      onClick={() => switchTab("ingresar")}
                      className="cursor-pointer bg-transparent border-none underline"
                      style={{ color: "var(--pro-primary)", font: "inherit" }}
                    >
                      Ingresá
                    </button>
                    .
                  </p>
                )}
              </form>
            </div>
          </div>

          <aside className="pro-card" style={{ padding: 20, background: "#FBF7F3" }}>
            <div className="pro-serif text-[22px]" style={{ color: "#1A1320" }}>
              ¿Por qué registrarte?
            </div>
            <ul className="mt-4 flex flex-col gap-3">
              <Benefit text="Seguimiento en vivo de cada pedido." />
              <Benefit text="Archivo de recetas y compras recurrentes." />
              <Benefit text="Direcciones guardadas para comprar en un click." />
              <Benefit text="Ofertas antes que nadie." />
            </ul>
            <p className="text-[11px] mt-5" style={{ color: "#7A7185" }}>
              Al ingresar aceptás nuestros{" "}
              <Link href="#" style={{ color: "var(--pro-primary)" }}>
                términos
              </Link>{" "}
              y{" "}
              <Link href="#" style={{ color: "var(--pro-primary)" }}>
                política de privacidad
              </Link>
              .
            </p>
          </aside>
        </div>
      </div>
    </>
  );
}

function Field({
  label,
  name,
  children,
  error,
}: {
  label: string;
  name: string;
  children: ReactNode;
  error?: string;
}) {
  return (
    <label className="block">
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

function Benefit({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2.5 text-[13px]" style={{ color: "#1A1320" }}>
      <span
        aria-hidden="true"
        className="grid place-items-center rounded-full flex-shrink-0 mt-0.5"
        style={{ width: 22, height: 22, background: "#E8F6EE", color: "#046B3A" }}
      >
        <IconCheck size={12} stroke="#046B3A" sw={2.4} />
      </span>
      <span>{text}</span>
    </li>
  );
}
