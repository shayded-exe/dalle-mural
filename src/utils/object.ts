import { Jsonify } from 'type-fest';

export function isDefined<T>(value: T | null | undefined): value is T {
  return value != null;
}

export function assignOwnProps<T>(obj: T, values: Partial<Jsonify<T>>): T {
  return Object.assign(obj, values);
}
