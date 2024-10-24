import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type ArgumentValue = { 'Int' : number } |
  { 'String' : string };
export interface CredentialSpec {
  'arguments' : [] | [Array<[string, ArgumentValue]>],
  'credential_type' : string,
}
export interface SettingsInput {
  'ii_canister_id' : Principal,
  'ic_root_key_der' : Uint8Array | number[],
  'issuer_canister_id' : Principal,
}
export interface ValidateVpRequest {
  'effective_vc_subject' : Principal,
  'issuer_origin' : string,
  'vp_jwt' : string,
  'credential_spec' : CredentialSpec,
}
export interface _SERVICE {
  'verify_credential' : ActorMethod<[ValidateVpRequest], string>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
