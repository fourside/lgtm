export const Env = {
  bucketName: process.env.BUCKET_NAME || requiredError("BUCKET_NAME"),
  accountId: process.env.ACCOUNT_ID || requiredError("ACCOUNT_ID"),
  accessKeyId: process.env.ACCESS_KEY_ID || requiredError("ACCESS_KEY_ID"),
  secretAccessKey:
    process.env.SECRET_ACCESS_KEY || requiredError("SECRET_ACCESS_KEY"),
} as const;

function requiredError(name: string): never {
  throw new Error(`${name} is not set in environment variable`);
}
