import crypto from "crypto";


const Encrypt = (type: string, data: any) => {
  return crypto.createHash(type).update(data, "binary").digest("hex");
}


export {Encrypt}