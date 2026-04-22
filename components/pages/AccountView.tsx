"use client";

import Link from "next/link";
import { useState } from "react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { IconArrow, IconCheck, IconPlus, IconRx } from "@/components/atoms/Icon";
import { AccountSidebar, type AccountSection } from "@/components/account/AccountSidebar";
import { OrderCard } from "@/components/account/OrderCard";
import { useRequireAuth } from "@/components/auth/useRequireAuth";
import { mockAddresses, mockOrders, mockUser } from "@/lib/data/account";
import type { Address } from "@/types/user";

const crumbs = [
  { label: "Inicio", href: "/" },
  { label: "Mi cuenta" },
];

export function AccountView() {
  const auth = useRequireAuth("/cuenta");
  const [section, setSection] = useState<AccountSection>("perfil");

  if (!auth.hydrated || !auth.user) {
    return (
      <div className="text-center py-16 text-[14px]" style={{ color: "#7A7185" }}>
        Verificando tu sesión…
      </div>
    );
  }

  const displayName = auth.user.firstName || mockUser.firstName;

  return (
    <>
      <div className="bg-white border-b border-[color:var(--pro-line)] px-4 py-4 md:px-12 md:py-6">
        <Breadcrumb items={crumbs} />
        <div className="mt-2">
          <div className="text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: "#5C1A6E" }}>
            Mi cuenta
          </div>
          <h1 className="pro-serif text-[32px] md:text-[44px] leading-[1.05] tracking-[-0.02em]" style={{ color: "#1A1320" }}>
            Hola, {displayName}
          </h1>
          <p className="text-[14px] md:text-[15px] mt-1.5" style={{ color: "#4A3D54" }}>
            Administrá tus datos, pedidos y direcciones desde un solo lugar.
          </p>
        </div>
      </div>

      <div className="px-4 py-6 md:px-12 md:py-10">
        <div className="grid gap-5 md:gap-8 md:grid-cols-[240px_1fr] items-start">
          <AccountSidebar active={section} onChange={setSection} />

          <section>
            {section === "perfil" && <ProfilePanel />}
            {section === "pedidos" && <OrdersPanel />}
            {section === "direcciones" && <AddressesPanel />}
            {section === "recetas" && <PrescriptionsPanel />}
          </section>
        </div>
      </div>
    </>
  );
}

function PanelHead({ eyebrow, title, subtitle, action }: { eyebrow: string; title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <header className="flex items-end justify-between gap-3 flex-wrap mb-5">
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: "#5C1A6E" }}>
          {eyebrow}
        </div>
        <h2 className="pro-serif text-[26px] md:text-[32px] leading-[1.1]" style={{ color: "#1A1320" }}>
          {title}
        </h2>
        {subtitle && (
          <p className="text-[13px] md:text-[14px] mt-1" style={{ color: "#7A7185" }}>
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </header>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <div className="text-[11px] font-semibold uppercase tracking-[0.06em] mb-1.5" style={{ color: "#7A7185" }}>
        {label}
      </div>
      <input readOnly value={value} className="pro-input" style={{ background: "#FAFAFB" }} />
    </label>
  );
}

function ProfilePanel() {
  return (
    <div>
      <PanelHead
        eyebrow="Perfil"
        title="Tus datos"
        subtitle={`Cliente desde ${mockUser.memberSince}`}
        action={
          <button type="button" className="pro-btn pro-btn-secondary" style={{ fontSize: 13 }}>
            Editar datos
          </button>
        }
      />
      <div className="pro-card" style={{ padding: 20 }}>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Nombre" value={mockUser.firstName} />
          <Field label="Apellido" value={mockUser.lastName} />
          <Field label="Email" value={mockUser.email} />
          <Field label="Teléfono" value={mockUser.phone} />
          <Field label="DNI" value={mockUser.dni} />
        </div>
        <div
          className="mt-5 pt-5 flex items-center gap-2.5 flex-wrap text-[12px]"
          style={{ borderTop: "1px dashed var(--pro-line)", color: "#046B3A" }}
        >
          <span className="inline-flex items-center gap-1">
            <IconCheck size={14} stroke="#046B3A" /> Email verificado
          </span>
          <span style={{ color: "var(--pro-line)" }}>·</span>
          <span className="inline-flex items-center gap-1" style={{ color: "#4A3D54" }}>
            Cambiá tu contraseña cada 90 días
          </span>
        </div>
      </div>

      <div className="pro-card mt-5" style={{ padding: 20, background: "#FBF7F3" }}>
        <div className="pro-serif text-[20px]" style={{ color: "#1A1320" }}>
          Preferencias
        </div>
        <p className="text-[13px] mt-1" style={{ color: "#4A3D54" }}>
          Decidí cómo querés que te avisemos.
        </p>
        <div className="mt-4 flex flex-col gap-3">
          <PreferenceRow label="Novedades y promociones" defaultOn />
          <PreferenceRow label="Alertas de stock de tus favoritos" defaultOn />
          <PreferenceRow label="Recordatorios de receta por vencer" />
        </div>
      </div>
    </div>
  );
}

function PreferenceRow({ label, defaultOn = false }: { label: string; defaultOn?: boolean }) {
  const [on, setOn] = useToggle(defaultOn);
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer">
      <span className="text-[14px]" style={{ color: "#1A1320" }}>
        {label}
      </span>
      <button
        type="button"
        onClick={() => setOn(!on)}
        aria-pressed={on}
        className="cursor-pointer"
        style={{
          width: 40,
          height: 22,
          borderRadius: 999,
          border: "none",
          background: on ? "var(--pro-primary)" : "#D8D2DC",
          position: "relative",
          transition: "background .18s",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 2,
            left: on ? 20 : 2,
            width: 18,
            height: 18,
            borderRadius: 999,
            background: "#fff",
            transition: "left .18s",
          }}
        />
      </button>
    </label>
  );
}

function useToggle(initial: boolean) {
  const [v, setV] = useState(initial);
  return [v, setV] as const;
}

function OrdersPanel() {
  return (
    <div>
      <PanelHead
        eyebrow="Pedidos"
        title="Tu historial"
        subtitle={`${mockOrders.length} pedidos realizados`}
      />
      <div className="flex flex-col gap-4">
        {mockOrders.map((o) => (
          <OrderCard key={o.id} order={o} />
        ))}
      </div>
    </div>
  );
}

function AddressesPanel() {
  return (
    <div>
      <PanelHead
        eyebrow="Direcciones"
        title="Guardadas"
        subtitle="Elegí rápido al finalizar la compra."
        action={
          <button type="button" className="pro-btn pro-btn-primary" style={{ fontSize: 13 }}>
            <IconPlus size={14} /> Agregar dirección
          </button>
        }
      />
      <div className="grid gap-4 md:grid-cols-2">
        {mockAddresses.map((a) => (
          <AddressCard key={a.id} address={a} />
        ))}
        <button
          type="button"
          className="rounded-[16px] text-center flex flex-col items-center justify-center gap-2 cursor-pointer"
          style={{
            border: "1.5px dashed var(--pro-line)",
            background: "transparent",
            padding: 28,
            color: "var(--pro-muted)",
            minHeight: 180,
          }}
        >
          <span
            className="grid place-items-center rounded-full"
            style={{ width: 40, height: 40, background: "#F4EEF7", color: "#5C1A6E" }}
          >
            <IconPlus size={18} stroke="#5C1A6E" />
          </span>
          <span className="text-[13px] font-semibold" style={{ color: "#1A1320" }}>
            Sumá una dirección nueva
          </span>
          <span className="text-[11px]">Casa, trabajo, lo que necesites</span>
        </button>
      </div>
    </div>
  );
}

function AddressCard({ address }: { address: Address }) {
  return (
    <article className="pro-card" style={{ padding: 20 }}>
      <div className="flex items-center justify-between gap-2">
        <span
          className="inline-flex items-center gap-1.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.06em]"
          style={{ padding: "4px 10px", background: "var(--pro-primary-50)", color: "var(--pro-primary)" }}
        >
          {address.label}
        </span>
        {address.isDefault && (
          <span
            className="text-[10px] font-semibold uppercase tracking-[0.06em]"
            style={{ color: "#046B3A" }}
          >
            Predeterminada
          </span>
        )}
      </div>
      <div className="pro-serif text-[20px] mt-3" style={{ color: "#1A1320" }}>
        {address.street}
      </div>
      {address.unit && (
        <div className="text-[13px]" style={{ color: "#4A3D54" }}>
          {address.unit}
        </div>
      )}
      <div className="text-[13px] mt-0.5" style={{ color: "#4A3D54" }}>
        {address.city}, {address.province} · CP {address.zip}
      </div>
      <div className="text-[12px] mt-2" style={{ color: "#7A7185" }}>
        {address.name} · {address.phone}
      </div>
      <div className="mt-4 flex gap-2 flex-wrap">
        <button type="button" className="pro-btn pro-btn-ghost" style={{ fontSize: 12, padding: "7px 12px" }}>
          Editar
        </button>
        {!address.isDefault && (
          <button type="button" className="pro-btn pro-btn-ghost" style={{ fontSize: 12, padding: "7px 12px" }}>
            Usar como predeterminada
          </button>
        )}
      </div>
    </article>
  );
}

function PrescriptionsPanel() {
  return (
    <div>
      <PanelHead
        eyebrow="Recetas guardadas"
        title="Tu archivo médico"
        subtitle="Subí una receta para acelerar tus próximas compras."
      />
      <div
        className="rounded-[16px] text-center flex flex-col items-center"
        style={{ background: "#EAF2F9", padding: "48px 24px", border: "1px solid #CDE0F1" }}
      >
        <span className="grid place-items-center rounded-full" style={{ width: 54, height: 54, background: "#1A4E8E", color: "#fff" }}>
          <IconRx size={24} stroke="#fff" />
        </span>
        <div className="pro-serif text-[22px] md:text-[26px] mt-3" style={{ color: "#1A4E8E" }}>
          Todavía no subiste recetas
        </div>
        <p className="text-[13px] md:text-[14px] mt-1.5 max-w-[440px]" style={{ color: "#1A4E8E", opacity: 0.9 }}>
          Guardá tus recetas una sola vez y las vamos a tener listas cuando compres medicamentos bajo prescripción.
        </p>
        <Link
          href="/#receta"
          className="pro-btn mt-5 no-underline inline-flex"
          style={{ background: "#1A4E8E", color: "#fff", border: "none" }}
        >
          Subir una receta <IconArrow size={16} />
        </Link>
      </div>
    </div>
  );
}
