/**
 * Tests for ShareFilterButton in components/filters/ShareFilterButton.tsx.
 *
 * jsdom 29 ships a real `navigator.clipboard`; we spy on its writeText
 * method so each test gets a fresh call-log without wrestling with
 * Object.defineProperty on a non-configurable property.
 *
 * The 2-second revert test uses a real wait instead of fake timers, because
 * mixing user-event v14 with Vitest fake timers requires extra plumbing
 * that's not worth the complexity for a single 2s pause.
 *
 * What would break these tests: changing the label text, wiring the button
 * to something other than `navigator.clipboard.writeText(location.href)`,
 * or changing the 2000ms reset window.
 */
import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ShareFilterButton } from "./ShareFilterButton";

describe("ShareFilterButton", () => {
  let writeTextSpy: MockInstance<typeof window.navigator.clipboard.writeText>;

  beforeEach(() => {
    // Defensive: install a shim only if jsdom happens not to provide clipboard.
    if (!window.navigator.clipboard) {
      Object.defineProperty(window.navigator, "clipboard", {
        configurable: true,
        value: { writeText: () => Promise.resolve() },
      });
    }
    writeTextSpy = vi
      .spyOn(window.navigator.clipboard, "writeText")
      .mockResolvedValue();
  });

  afterEach(() => {
    writeTextSpy.mockRestore();
  });

  it("renders 'Compartir filtros' in the idle state", () => {
    render(<ShareFilterButton />);
    expect(
      screen.getByRole("button", { name: /compartir filtros/i }),
    ).toBeInTheDocument();
  });

  it("calls navigator.clipboard.writeText with the current URL on click", () => {
    // fireEvent is fully synchronous, so the spy is observed at the moment of
    // the onClick handler call. (user-event's async scheduling introduces a
    // micro-race that makes the first call hard to read in test.)
    render(<ShareFilterButton />);
    fireEvent.click(screen.getByRole("button"));
    expect(writeTextSpy).toHaveBeenCalledTimes(1);
    expect(writeTextSpy).toHaveBeenCalledWith(window.location.href);
  });

  it("switches the label to 'Enlace copiado' after a successful click", async () => {
    const user = userEvent.setup();
    render(<ShareFilterButton />);
    await user.click(screen.getByRole("button"));
    // findByRole waits for the re-render triggered by the resolved promise.
    expect(
      await screen.findByRole("button", { name: /enlace copiado/i }),
    ).toBeInTheDocument();
  });

  it(
    "reverts to 'Compartir filtros' after 2 seconds",
    async () => {
      const user = userEvent.setup();
      render(<ShareFilterButton />);
      await user.click(screen.getByRole("button"));
      await screen.findByRole("button", { name: /enlace copiado/i });
      // Real wait, just past the 2s revert window.
      await new Promise((resolve) => setTimeout(resolve, 2100));
      expect(
        screen.getByRole("button", { name: /compartir filtros/i }),
      ).toBeInTheDocument();
    },
    10000, // per-test timeout, default 5000ms isn't enough once we real-wait
  );

  it("does not enter the copied state if clipboard.writeText rejects", async () => {
    writeTextSpy.mockRejectedValueOnce(new Error("clipboard denied"));
    const user = userEvent.setup();
    render(<ShareFilterButton />);
    await user.click(screen.getByRole("button"));
    // Let the rejected promise settle (catch handler runs, no state change)
    await act(async () => {
      await Promise.resolve();
    });
    expect(
      screen.getByRole("button", { name: /compartir filtros/i }),
    ).toBeInTheDocument();
  });
});
