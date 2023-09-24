import { renderHook, act } from "@testing-library/react-hooks";
import useTimer from "../useTimer.js";


describe("useTimer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("should start with the initial time", () => {
    const initialTime = 10;

    const { result } = renderHook(() => useTimer(initialTime));

    expect(result.current[0]).toBe(initialTime);
  });

  test("should decrement timeLeft by 1 every second", () => {
    const { result } = renderHook(() => useTimer(10));

    expect(result.current[0]).toBe(10);

    act(() => {
      const startTimer = result.current[2];
      startTimer();
    });

    const isRunning = result.current[4];
    expect(isRunning).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current[0]).toBe(9);
  });

  test("should reset the timer back to initial time and stop the timer", () => {
    const { result } = renderHook(() => useTimer(10));

    act(() => {
      const startTimer = result.current[2];
      startTimer();
    });

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current[0]).toBe(7);

    act(() => {
      const resetTimer = result.current[1];
      resetTimer();
    });

    expect(result.current[0]).toBe(10);
    expect(result.current[4]).toBe(false);
  });

  test("should reset to initial time even after multiple decrements", () => {
    const { result } = renderHook(() => useTimer(10));

    act(() => {
      result.current[2](); // Start timer
    });

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current[0]).toBe(7);

    act(() => {
      result.current[1](); // Reset timer
    });

    expect(result.current[0]).toBe(10);

    act(() => {
      result.current[2](); // Start timer
    });

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current[0]).toBe(8);
  });

  test("should not allow the timer to go below 0 when time is longer than the initial timer", () => {
    const { result } = renderHook(() => useTimer(2));

    act(() => {
      result.current[2](); // Start timer
    });

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current[0]).toBe(0);
  });

  test("should call onTimeout function when timer reaches 0", () => {
    const onTimeout = vi.fn();
    const initialTime = 3;

    const { result } = renderHook(() => useTimer(initialTime, onTimeout));

    act(() => {
      result.current[2](); // Start timer
    });

    act(() => {
      vi.advanceTimersByTime(4000);
    });

    expect(onTimeout).toHaveBeenCalledTimes(1);
  });

  test("should have the timer stopped when time is ticking", () => {
    const { result } = renderHook(() => useTimer(10));

    expect(result.current[0]).toBe(10);

    const isRunningBefore = result.current[4];
    expect(isRunningBefore).toBe(false);

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    const isRunningAfter = result.current[4];
    expect(isRunningAfter).toBe(false);

    expect(result.current[0]).toBe(10);
  });

  test("should stop the timer before is reaching 0 - external stop", () => {
    const { result } = renderHook(() => useTimer(10));

    act(() => {
      result.current[2](); // Start timer
    });

    act(() => {
      vi.advanceTimersByTime(4000);
    });

    expect(result.current[4]).toBe(true);
    expect(result.current[0]).toBe(6);

    act(() => {
      result.current[3](); // Stop timer
    });

    act(() => {
      vi.advanceTimersByTime(4000);
    });

    expect(result.current[4]).toBe(false);
    expect(result.current[0]).toBe(6);
  });
});
