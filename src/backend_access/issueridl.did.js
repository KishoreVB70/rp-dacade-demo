export const issuerIdl = ({ IDL }) => {
    return IDL.Service({
      derivation_origin: IDL.Func(
        [IDL.Record({ frontend_hostname: IDL.Text })], // Input is a record with `frontend_hostname` field (text)
        [
          IDL.Variant({
            Ok: IDL.Record({ origin: IDL.Text }), // On success, returns a record with `origin` (text)
            Err: IDL.Variant({
              Internal: IDL.Text,              // Possible error: Internal error (text)
              UnsupportedOrigin: IDL.Text,     // Possible error: Unsupported origin (text)
            }),
          }),
        ],
        [],
      ),
    });
  };
  