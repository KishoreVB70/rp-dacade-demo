
export default function validateCredential(vcSpec, vcClaims) {
    const credentialType = vcSpec.credential_type;

    // 1. Check if 'type' claim exists and contains the expected credential type
    const vcTypeEntry = vcClaims.type;
    if (!vcTypeEntry) {
      throw new Error("Missing type-claim");
    }
    
    if (!Array.isArray(vcTypeEntry)) {
      throw new Error("Malformed types-claim");
    }
    
    if (!vcTypeEntry.includes(credentialType)) {
      throw new Error("Missing credential_type in type-claim");
    }
  
    // 2. Check if 'credentialSubject' contains the credential type and matches the arguments
    const credentialSubject = vcClaims.credentialSubject;
    if (!credentialSubject) {
      throw new Error("Missing credentialSubject-claim");
    }
  
    const verifiedClaimArguments = credentialSubject[credentialType];
    if (!verifiedClaimArguments) {
      throw new Error("Missing credential_type claim");
    }
  
    if (typeof verifiedClaimArguments !== 'object') {
      throw new Error("Malformed credential_type arguments");
    }
  
    // 3. Ensure the number of arguments match
    const specArguments = vcSpec.arguments || {};
    const specArgumentsCount = Object.keys(specArguments).length;
    const verifiedArgumentsCount = Object.keys(verifiedClaimArguments).length;
  
    if (specArgumentsCount !== verifiedArgumentsCount) {
      throw new Error("Wrong number of credential_type arguments");
    }
  
    // 4. Validate each argument's key and value
    for (const [key, value] of Object.entries(specArguments)) {
      if (!(key in verifiedClaimArguments)) {
        throw new Error(`Missing key in credential_type arguments: ${key}`);
      }
      if (verifiedClaimArguments[key] !== value) {
        throw new Error(`Wrong value in credential_type argument: ${key}`);
      }
    }
  
    return true;  // If all checks pass
}