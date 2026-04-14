import { render, screen, fireEvent } from "@testing-library/react";
import PremiumModal from "@/components/premium/PremiumModal";

jest.mock("framer-motion", () => {
  const React = require("react");
  return {
    __esModule: true,
    AnimatePresence: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
    motion: new Proxy(
      {},
      {
        get: () => (props: Record<string, unknown>) => {
          const {
            initial: _i,
            animate: _a,
            exit: _e,
            transition: _t,
            whileInView: _w,
            viewport: _v,
            ...rest
          } = props as Record<string, unknown>;
          void _i; void _a; void _e; void _t; void _w; void _v;
          return React.createElement("div", rest);
        },
      }
    ),
  };
});

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, ...rest }: { children: React.ReactNode; href: string }) => {
    const React = require("react");
    return React.createElement("a", { href, ...rest }, children);
  },
}));

describe("PremiumModal", () => {
  it("renders when isOpen is true", () => {
    render(<PremiumModal isOpen={true} onClose={() => {}} />);
    expect(screen.getByText(/Bu dars Premium/i)).toBeInTheDocument();
  });

  it("does not render when isOpen is false", () => {
    render(<PremiumModal isOpen={false} onClose={() => {}} />);
    expect(screen.queryByText(/Bu dars Premium/i)).not.toBeInTheDocument();
  });

  it("calls onClose when cancel button clicked", () => {
    const onClose = jest.fn();
    render(<PremiumModal isOpen={true} onClose={onClose} />);
    fireEvent.click(screen.getByText(/Bekor qilish/i));
    expect(onClose).toHaveBeenCalled();
  });

  it("has link to /pricing page", () => {
    render(<PremiumModal isOpen={true} onClose={() => {}} />);
    const link = screen.getByText(/Premium olish/i).closest("a");
    expect(link).toHaveAttribute("href", "/pricing");
  });
});
