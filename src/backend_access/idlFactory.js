export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'verify_credential': IDL.Func([IDL.Text], [IDL.Text], ['query']),
  });
};