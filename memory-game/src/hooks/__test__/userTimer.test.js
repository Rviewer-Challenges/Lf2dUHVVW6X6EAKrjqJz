import { renderHook, act } from "@testing-library/react-hooks";
import useTimer from "../useTimer.js";

describe("useTimer", () => {

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should decrement timeLeft by 1 every second", () => {
    const { result } = renderHook(() => useTimer(10));

    expect(result.current[0]).toBe(10);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current[0]).toBe(9);
  });

  it("should reset the timer back to initial time", () => {
    const { result } = renderHook(() => useTimer(10));

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current[0]).toBe(7);

    act(() => {
      const resetTimer = result.current[1];
      resetTimer();
    });

    expect(result.current[0]).toBe(10);
  });

  it("should reset to initial time even after multiple decrements", () => {
    const { result } = renderHook(() => useTimer(10));

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current[0]).toBe(7);

    act(() => {
      const resetTimer = result.current[1];
      resetTimer();
    });

    expect(result.current[0]).toBe(10);

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current[0]).toBe(8);
  });

  it("should not allow the timer to go below 0 when time is longer than the initial timer", () => {
    const { result } = renderHook(() => useTimer(2));

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current[0]).toBe(0);
  });
});
