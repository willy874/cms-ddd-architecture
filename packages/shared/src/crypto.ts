import { SHA256 } from "crypto-js"
import { jwtVerify, SignJWT, errors } from 'jose'
import { HASH_SECRET } from "./constants"

export class Jwt {
  private secret: Uint8Array
  constructor(secret: string) {
    this.secret = new TextEncoder().encode(secret)
  }

  async isExpired(token: string) {
    try {
      await jwtVerify(token, this.secret)
      return false
    } catch (error) {
      if (error instanceof errors.JWTExpired) {
        return true
      }
      throw error
    }
  }

  async verify(token: string) {
    try {
      await jwtVerify(token, this.secret)
      return true
    } catch (error) {
      return false
    }
  }

  sign(payload: object, expiresIn: string) {
    return new SignJWT({ ...payload })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(expiresIn)
      .sign(this.secret);
  }
}

export const hash = (str: string) => {
  return SHA256(str + HASH_SECRET).toString()
}
