import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import InfiniteCarousel from "./InfiniteCarousel";
import { IMAGES_ON_INITIAL_LOAD } from "../constants/carouselConfig";

describe("InfiniteCarousel", () => {
  it("renders component", () => {
    const { container } = render(<InfiniteCarousel />);
    const carouselWrapper = container.querySelector(
      '[class*="carouselWrapper"]'
    );
    expect(carouselWrapper).toBeInTheDocument();
  });

  it("renders initial images", () => {
    render(<InfiniteCarousel />);
    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(IMAGES_ON_INITIAL_LOAD);
  });

  it("renders carousel container", () => {
    const { container } = render(<InfiniteCarousel />);
    const carouselContainer = container.querySelector(
      '[class*="carouselContainer"]'
    );
    expect(carouselContainer).toBeInTheDocument();
  });

  it("handles wheel scroll", () => {
    const { container } = render(<InfiniteCarousel />);
    const carouselContainer = container.querySelector(
      '[class*="carouselContainer"]'
    ) as HTMLElement;

    const initialScroll = carouselContainer.scrollLeft;
    fireEvent.wheel(carouselContainer, { deltaY: 100 });

    expect(carouselContainer.scrollLeft).toBeGreaterThan(initialScroll);
  });

  it("renders observer element for infinite scroll", () => {
    const { container } = render(<InfiniteCarousel />);
    const observerElement = container.querySelector('[class*="observerRef"]');
    expect(observerElement).toBeInTheDocument();
  });
});
