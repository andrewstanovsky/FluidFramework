## API Report File for "@fluidframework/fluid-static"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import { BaseContainerRuntimeFactory } from '@fluidframework/aqueduct';
import { Container } from '@fluidframework/container-loader';
import { DataObject } from '@fluidframework/aqueduct';
import { DataObjectFactory } from '@fluidframework/aqueduct';
import { EventEmitter } from 'events';
import { IAudience } from '@fluidframework/container-definitions';
import { IChannelFactory } from '@fluidframework/datastore-definitions';
import { IClient } from '@fluidframework/protocol-definitions';
import { IContainerRuntime } from '@fluidframework/container-runtime-definitions';
import { IErrorEvent } from '@fluidframework/common-definitions';
import { IEvent } from '@fluidframework/common-definitions';
import { IEventProvider } from '@fluidframework/common-definitions';
import { IFluidDataStoreFactory } from '@fluidframework/runtime-definitions';
import { IFluidLoadable } from '@fluidframework/core-interfaces';
import { IInboundSignalMessage } from '@fluidframework/runtime-definitions';
import { Jsonable } from '@fluidframework/datastore-definitions';
import { TypedEventEmitter } from '@fluidframework/common-utils';

// @public (undocumented)
export interface ContainerSchema {
    dynamicObjectTypes?: LoadableObjectClass<any>[];
    initialObjects: LoadableObjectClassRecord;
    name: string;
}

// @public
export type DataObjectClass<T extends IFluidLoadable> = {
    readonly factory: IFluidDataStoreFactory;
} & LoadableObjectCtor<T>;

// @public
export class DOProviderContainerRuntimeFactory extends BaseContainerRuntimeFactory {
    constructor(schema: ContainerSchema);
    // (undocumented)
    protected containerInitializingFirstTime(runtime: IContainerRuntime): Promise<void>;
    }

// @public (undocumented)
export class FluidContainer extends TypedEventEmitter<IFluidContainerEvents> implements IFluidContainer {
    constructor(container: Container, rootDataObject: RootDataObject);
    // @deprecated (undocumented)
    get audience(): IAudience;
    // @deprecated (undocumented)
    get clientId(): string | undefined;
    // (undocumented)
    get connected(): boolean;
    // (undocumented)
    create<T extends IFluidLoadable>(objectClass: LoadableObjectClass<T>): Promise<T>;
    // (undocumented)
    dispose(): void;
    // (undocumented)
    get disposed(): boolean;
    // (undocumented)
    get initialObjects(): Record<string, IFluidLoadable>;
    }

// @public
export interface IConnection {
    // (undocumented)
    id: string;
    // (undocumented)
    mode: "write" | "read";
}

// @public (undocumented)
export interface IFluidContainer extends IEventProvider<IFluidContainerEvents> {
    // (undocumented)
    readonly connected: boolean;
    // (undocumented)
    create<T extends IFluidLoadable>(objectClass: LoadableObjectClass<T>): Promise<T>;
    // (undocumented)
    dispose(): void;
    // (undocumented)
    readonly disposed: boolean;
    // (undocumented)
    readonly initialObjects: LoadableObjectRecord;
}

// @public (undocumented)
export interface IFluidContainerEvents extends IEvent {
    // (undocumented)
    (event: "connected" | "dispose" | "disconnected", listener: () => void): void;
}

// @public
export interface IMember {
    // (undocumented)
    connections: IConnection[];
    // (undocumented)
    userId: string;
}

// @public
export interface IRuntimeSignaler {
    // (undocumented)
    connected: boolean;
    // (undocumented)
    on(event: "signal", listener: (message: IInboundSignalMessage, local: boolean) => void): any;
    // (undocumented)
    submitSignal(type: string, content: any): void;
}

// @public
export interface IServiceAudience<M extends IMember> extends IEventProvider<IServiceAudienceEvents<M>> {
    getMembers(): Map<string, M>;
    getMyself(): M | undefined;
}

// @public
export interface IServiceAudienceEvents<M extends IMember> extends IEvent {
    // (undocumented)
    (event: "membersChanged", listener: () => void): void;
    // (undocumented)
    (event: "memberAdded" | "memberRemoved", listener: (clientId: string, member: M) => void): void;
}

// @public
export interface ISignaler {
    offBroadcastRequested(signalName: string, listener: SignalListener): ISignaler;
    offSignal(signalName: string, listener: SignalListener | ((message: any) => void)): ISignaler;
    onBroadcastRequested(signalName: string, listener: SignalListener): ISignaler;
    onSignal(signalName: string, listener: SignalListener): ISignaler;
    requestBroadcast(signalName: string, payload?: Jsonable): any;
    submitSignal(signalName: string, payload?: Jsonable): any;
}

// @public
export type LoadableObjectClass<T extends IFluidLoadable> = DataObjectClass<T> | SharedObjectClass<T>;

// @public (undocumented)
export type LoadableObjectClassRecord = Record<string, LoadableObjectClass<any>>;

// @public
export type LoadableObjectCtor<T extends IFluidLoadable> = new (...args: any[]) => T;

// @public (undocumented)
export type LoadableObjectRecord = Record<string, IFluidLoadable>;

// @public (undocumented)
export class RootDataObject extends DataObject<{}, RootDataObjectProps> {
    // (undocumented)
    create<T extends IFluidLoadable>(objectClass: LoadableObjectClass<T>): Promise<T>;
    // (undocumented)
    protected hasInitialized(): Promise<void>;
    // (undocumented)
    protected initializingFirstTime(props: RootDataObjectProps): Promise<void>;
    // (undocumented)
    get initialObjects(): LoadableObjectRecord;
    }

// @public (undocumented)
export interface RootDataObjectProps {
    // (undocumented)
    initialObjects: LoadableObjectClassRecord;
}

// @public (undocumented)
export abstract class ServiceAudience<M extends IMember = IMember> extends TypedEventEmitter<IServiceAudienceEvents<M>> implements IServiceAudience<M> {
    constructor(container: Container);
    // (undocumented)
    protected readonly audience: IAudience;
    // (undocumented)
    protected readonly container: Container;
    // (undocumented)
    protected abstract createServiceMember(audienceMember: IClient): M;
    getMembers(): Map<string, M>;
    getMyself(): M | undefined;
    protected lastMembers: Map<string, M>;
    // (undocumented)
    protected shouldIncludeAsMember(member: IClient): boolean;
}

// @public
export type SharedObjectClass<T extends IFluidLoadable> = {
    readonly getFactory: () => IChannelFactory;
} & LoadableObjectCtor<T>;

// @public
export class Signaler extends TypedEventEmitter<IErrorEvent> implements ISignaler {
    constructor(
    signaler: IRuntimeSignaler,
    managerId?: string);
    // (undocumented)
    offBroadcastRequested(signalName: string, listener: SignalListener): ISignaler;
    // (undocumented)
    offSignal(signalName: string, listener: SignalListener): ISignaler;
    // (undocumented)
    onBroadcastRequested(signalName: string, listener: SignalListener): ISignaler;
    // (undocumented)
    onSignal(signalName: string, listener: SignalListener): ISignaler;
    // (undocumented)
    requestBroadcast(signalName: string, payload?: Jsonable): void;
    // (undocumented)
    submitSignal(signalName: string, payload?: Jsonable): void;
}

// @public (undocumented)
export type SignalListener = (clientId: string, local: boolean, payload: Jsonable) => void;

// @public
export class SignalManager extends DataObject<{}, undefined, IErrorEvent> implements EventEmitter, ISignaler {
    // (undocumented)
    static readonly factory: DataObjectFactory<SignalManager, undefined, undefined, IErrorEvent>;
    // (undocumented)
    protected hasInitialized(): Promise<void>;
    // (undocumented)
    static get Name(): string;
    // (undocumented)
    offBroadcastRequested(signalName: string, listener: SignalListener): ISignaler;
    // (undocumented)
    offSignal(signalName: string, listener: SignalListener): ISignaler;
    // (undocumented)
    onBroadcastRequested(signalName: string, listener: SignalListener): ISignaler;
    // (undocumented)
    onSignal(signalName: string, listener: SignalListener): ISignaler;
    // (undocumented)
    requestBroadcast(signalName: string, payload?: Jsonable): void;
    // (undocumented)
    submitSignal(signalName: string, payload?: Jsonable): void;
}


// (No @packageDocumentation comment for this package)

```