/**
 * Tests for FilterDrawer in components/filters/FilterDrawer.tsx.
 *
 * FilterDrawer is a presentational wrapper — it just owns the modal chrome
 * (backdrop, ESC-to-close, focus trap, footer actions) and slots arbitrary
 * filter controls as children. The reducer/URL logic is tested elsewhere
 * under lib/filters/*, so here we only verify the wrapper's own contract:
 *
 *   open=false → nothing rendered
 *   open=true  → modal dialog, close/reset/apply callbacks wire correctly
 *   ESC key    → onClose fires
 *
 * What would break these tests: renaming the footer button labels,
 * removing the aria-modal dialog, or changing the ESC-to-close handler.
 */
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FilterDrawer } from "./FilterDrawer";

function setup(open: boolean) {
  const onClose = vi.fn();
  const onApply = vi.fn();
  const onReset = vi.fn();
  render(
    <FilterDrawer
      open={open}
      onClose={onClose}
      onApply={onApply}
      onReset={onReset}
      resultCount={42}
    >
      <p>dummy filter contents</p>
    </FilterDrawer>,
  );
  return { onClose, onApply, onReset };
}

describe("FilterDrawer", () => {
  it("renders nothing when open is false", () => {
    setup(false);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("renders an aria-modal dialog titled 'Filtros' when open is true", () => {
    setup(true);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(screen.getByText("Filtros")).toBeInTheDocument();
    // Child content is slotted through
    expect(screen.getByText("dummy filter contents")).toBeInTheDocument();
  });

  it("fires onClose when the Cerrar button is clicked", async () => {
    const user = userEvent.setup();
    const { onClose } = setup(true);
    await user.click(screen.getByRole("button", { name: /cerrar/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("fires onClose on ESC keypress", () => {
    const { onClose } = setup(true);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("fires onReset when Limpiar is clicked", async () => {
    const user = userEvent.setup();
    const { onReset } = setup(true);
    await user.click(screen.getByRole("button", { name: /limpiar/i }));
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it("shows the resultCount in the apply button and fires onApply when clicked", async () => {
    const user = userEvent.setup();
    const { onApply } = setup(true);
    const apply = screen.getByRole("button", { name: /ver 42 productos/i });
    await user.click(apply);
    expect(onApply).toHaveBeenCalledTimes(1);
  });
});
