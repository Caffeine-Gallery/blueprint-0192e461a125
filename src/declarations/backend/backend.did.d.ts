import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Component {
  'x' : number,
  'y' : number,
  'id' : string,
  'styles' : StyleProperties,
  'content' : string,
  'type' : string,
}
export interface StyleProperties {
  'backgroundColor' : string,
  'color' : string,
  'fontSize' : string,
  'padding' : string,
}
export interface _SERVICE {
  'addComponent' : ActorMethod<[Component], undefined>,
  'deleteComponent' : ActorMethod<[string], undefined>,
  'getComponent' : ActorMethod<[string], [] | [Component]>,
  'loadLayout' : ActorMethod<[], Array<Component>>,
  'saveLayout' : ActorMethod<[Array<Component>], undefined>,
  'updateComponent' : ActorMethod<[Component], undefined>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
