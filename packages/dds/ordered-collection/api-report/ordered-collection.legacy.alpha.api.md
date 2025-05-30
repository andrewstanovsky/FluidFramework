## Alpha API Report File for "@fluidframework/ordered-collection"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

// @alpha @legacy
export type ConsensusCallback<T> = (value: T) => Promise<ConsensusResult>;

// @alpha @legacy
export class ConsensusOrderedCollection<T = any> extends SharedObject<IConsensusOrderedCollectionEvents<T>> implements IConsensusOrderedCollection<T> {
    protected constructor(id: string, runtime: IFluidDataStoreRuntime, attributes: IChannelAttributes, data: IOrderedCollection<T>);
    acquire(callback: ConsensusCallback<T>): Promise<boolean>;
    add(value: T): Promise<void>;
    // (undocumented)
    protected applyStashedOp(): void;
    // (undocumented)
    protected complete(acquireId: string): Promise<void>;
    // (undocumented)
    protected completeCore(acquireId: string): void;
    // (undocumented)
    protected isActive(): boolean;
    protected loadCore(storage: IChannelStorageService): Promise<void>;
    // (undocumented)
    protected onDisconnect(): void;
    // (undocumented)
    protected processCore(message: ISequencedDocumentMessage, local: boolean, localOpMetadata: unknown): void;
    // (undocumented)
    protected release(acquireId: string): void;
    // (undocumented)
    protected releaseCore(acquireId: string): void;
    // (undocumented)
    protected summarizeCore(serializer: IFluidSerializer): ISummaryTreeWithStats;
    waitAndAcquire(callback: ConsensusCallback<T>): Promise<void>;
}

// @alpha @legacy
export const ConsensusQueue: ISharedObjectKind<IConsensusOrderedCollection<any>> & SharedObjectKind<IConsensusOrderedCollection<any>>;

// @alpha @legacy
export type ConsensusQueue<T = any> = ConsensusQueueClass<T>;

// @alpha @legacy
export class ConsensusQueueClass<T = any> extends ConsensusOrderedCollection<T> {
    constructor(id: string, runtime: IFluidDataStoreRuntime, attributes: IChannelAttributes);
}

// @alpha @legacy (undocumented)
export enum ConsensusResult {
    // (undocumented)
    Complete = 1,
    // (undocumented)
    Release = 0
}

// @alpha @legacy
export interface IConsensusOrderedCollection<T = any> extends ISharedObject<IConsensusOrderedCollectionEvents<T>> {
    acquire(callback: ConsensusCallback<T>): Promise<boolean>;
    add(value: T): Promise<void>;
    waitAndAcquire(callback: ConsensusCallback<T>): Promise<void>;
}

// @alpha @legacy
export interface IConsensusOrderedCollectionEvents<T> extends ISharedObjectEvents {
    (event: "add", listener: (value: T, newlyAdded: boolean) => void): this;
    (event: "acquire", listener: (value: T, clientId?: string) => void): this;
    (event: "complete", listener: (value: T) => void): this;
    (event: "localRelease", listener: (value: T, intentional: boolean) => void): this;
}

// @alpha @legacy
export interface IOrderedCollection<T = any> extends ISnapshotable<T> {
    add(value: T): any;
    remove(): T;
    size(): number;
}

// @alpha @legacy
export interface ISnapshotable<T> {
    // (undocumented)
    asArray(): T[];
    // (undocumented)
    loadFrom(values: T[]): void;
}

// (No @packageDocumentation comment for this package)

```
