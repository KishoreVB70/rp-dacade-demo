export const idlFactory = ({ IDL }) => {
  const SettingsInput = IDL.Record({
    'ii_canister_id' : IDL.Principal,
    'ic_root_key_der' : IDL.Vec(IDL.Nat8),
    'issuer_canister_id' : IDL.Principal,
  });
  const ArgumentValue = IDL.Variant({ 'Int' : IDL.Int32, 'String' : IDL.Text });
  const CredentialSpec = IDL.Record({
    'arguments' : IDL.Opt(IDL.Vec(IDL.Tuple(IDL.Text, ArgumentValue))),
    'credential_type' : IDL.Text,
  });
  const ValidateVpRequest = IDL.Record({
    'effective_vc_subject' : IDL.Principal,
    'issuer_origin' : IDL.Text,
    'vp_jwt' : IDL.Text,
    'credential_spec' : CredentialSpec,
  });
  return IDL.Service({
    'validate_vc_token' : IDL.Func([IDL.Text], [IDL.Text], []),
    'validate_vc_token_allinputs' : IDL.Func(
        [ValidateVpRequest],
        [IDL.Text],
        [],
      ),
  });
};
export const init = ({ IDL }) => {
  const SettingsInput = IDL.Record({
    'ii_canister_id' : IDL.Principal,
    'ic_root_key_der' : IDL.Vec(IDL.Nat8),
    'issuer_canister_id' : IDL.Principal,
  });
  return [SettingsInput];
};
