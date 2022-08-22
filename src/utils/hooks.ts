import { DependencyList, useCallback } from 'react';

export function useOnInitRef<T>(
  callback: ((ref: T) => void) | undefined,
  deps: DependencyList = [],
) {
  return useCallback((ref: T | null) => {
    if (ref) {
      callback?.(ref);
    }
  }, deps);
}

export function useMouseCallback<TElement = Element>({
  callback,
  deps,
  button,
  buttons,
}: {
  callback: (e: React.MouseEvent<TElement>) => void;
  deps: DependencyList;
  button?: number;
  buttons?: number;
}) {
  return useCallback((e: React.MouseEvent<TElement>) => {
    if (
      (button == undefined || e.button === button) &&
      (buttons == undefined || e.buttons === buttons)
    ) {
      callback(e);
    }
  }, deps);
}
