import {
  autorun,
  IAutorunOptions,
  IReactionOptions,
  IReactionPublic,
  reaction,
} from 'mobx';
import { DependencyList, useCallback, useEffect } from 'react';

export function useAutorun(
  view: (r: IReactionPublic) => any,
  opts?: IAutorunOptions,
): void {
  useEffect(() => autorun(view, opts), []);
}

export function useReaction<T, FireImmediately extends boolean = false>(
  expression: (r: IReactionPublic) => T,
  effect: (
    arg: T,
    prev: FireImmediately extends true ? T | undefined : T,
    r: IReactionPublic,
  ) => void,
  opts?: IReactionOptions<T, FireImmediately>,
): void {
  return useEffect(() => reaction(expression, effect, opts), []);
}

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
