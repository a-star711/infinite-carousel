import '@testing-library/jest-dom';

type MockedGlobal = typeof globalThis & {
  IntersectionObserver?: typeof window.IntersectionObserver;
};

const mockGlobal = globalThis as MockedGlobal;

const MockIntersectionObserver = function (
  options?: IntersectionObserverInit
) {
  const threshold = options?.threshold ?? [0];
  return {
    root: (options?.root as Element | Document) ?? null,
    rootMargin: options?.rootMargin ?? '0px',
    thresholds: Array.isArray(threshold) ? threshold : [threshold],
    observe() {},
    unobserve() {},
    disconnect() {},
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    },
  };
};

mockGlobal.IntersectionObserver =
  MockIntersectionObserver as unknown as typeof window.IntersectionObserver;