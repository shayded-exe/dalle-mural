import { Jsonify } from 'type-fest';

export function assignOwnProps<T>(obj: T, values: Partial<Jsonify<T>>): T {
  return Object.assign(obj, values);
}
