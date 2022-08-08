import { StorageController } from 'mobx-persist-store';
import { Constructor, Jsonify, JsonObject, JsonValue } from 'type-fest';

import { assignOwnProps } from '../utils';
import type { RootStore } from './root-store';

export abstract class StorableDomainObject {
  constructor(readonly rootStore: RootStore) {}

  static baseCreate<T extends StorableDomainObject>(
    type: Constructor<T, [RootStore]>,
    rootStore: RootStore,
  ): T {
    const obj = new type(rootStore);
    obj.makeObservable();
    return obj;
  }

  static fromJson<T extends StorableDomainObject, TJson extends Jsonify<T>>(
    type: Constructor<T, [RootStore]>,
    rootStore: RootStore,
    json: TJson,
  ): T {
    const obj = new type(rootStore);
    obj.hydrate(json);
    obj.makeObservable();
    return obj;
  }

  hydrate(json: Jsonify<this>) {
    assignOwnProps(this, json);
  }

  abstract makeObservable(): void;
}

type TransformFunc = (this: JsonObject, key: string, value: JsonValue) => any;

export class DomainObjectStorageController implements StorageController {
  #storage: Storage;
  #transformFunc: TransformFunc;

  constructor({
    storage,
    transform,
  }: {
    storage: Storage;
    transform: TransformFunc;
  }) {
    this.#storage = storage;
    this.#transformFunc = transform;
  }

  getItem(key: string): any {
    const rawJson = this.#storage.getItem(key);
    if (!rawJson) {
      return {};
    }

    try {
      return JSON.parse(rawJson, this.#transformFunc) || {};
    } catch (e) {
      console.error(`Error parsing storage`, { e, rawJson });
      return {};
    }
  }

  removeItem(key: string): void {
    this.#storage.removeItem(key);
  }
  setItem(key: string, value: string): void {
    this.#storage.setItem(key, value);
  }
}
