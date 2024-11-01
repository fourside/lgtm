import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { parseArgs } from "node:util";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import clipboard from "clipboardy";
import { v4 as uuid } from "uuid";
import { Env } from "./env";

async function main() {
  const { positionals } = parseArgs({ allowPositionals: true });
  if (positionals.length === 0) {
    console.error("no file path");
    process.exit(-1);
  }
  const filePath = positionals[0];
  if (!fs.existsSync(filePath)) {
    console.error("file does not exist");
    process.exit(-1);
  }

  const ext = path.extname(filePath);
  const fileName = `${uuid()}${ext}`;
  const binary = fs.readFileSync(filePath);
  const s3 = new S3Client({
    region: "auto",
    endpoint: `https://${Env.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: Env.accessKeyId,
      secretAccessKey: Env.secretAccessKey,
    },
  });
  const putCommand = new PutObjectCommand({
    Bucket: Env.bucketName,
    Key: fileName,
    Body: binary,
    ContentType: `image/${ext.slice(1)}`,
  });
  await s3.send(putCommand);

  const text = `![LGTM](https://lgtm.fourside.dev/${fileName})`;
  clipboard.writeSync(text);
  console.log(`copied to clipboard: ${text}`);
}

async function put(fileName: string, binary: Buffer): Promise<void> {}

await main();
