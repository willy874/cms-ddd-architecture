import { SHA256 } from "crypto-js"
import { jwtVerify, SignJWT, errors } from 'jose'
import { HASH_SECRET } from "./constants"

class VerifyError extends Error {
  constructor() {
    super('JWT verification failed')
    this.name = "VerifyError"
  }
}

class ExpiredError extends Error {
  constructor() {
    super('JWT has expired')
    this.name = "ExpiredError"
  }
}

export class Jwt {
  static ExpiredError = ExpiredError
  static VerifyError = VerifyError

  private secret: Uint8Array
  constructor(secret: string) {
    this.secret = new TextEncoder().encode(secret)
  }

  async parse(token: string) {
    try {
      const { payload } = await jwtVerify(token, this.secret)
      return payload
    } catch (error) {
      if (error instanceof errors.JWTExpired) {
        throw new ExpiredError()
      }
      throw new VerifyError()
    }
  }

  async isExpired(token: string) {
    try {
      await this.parse(token)
      return false
    } catch (error) {
      if (error instanceof ExpiredError) {
        return true
      }
      throw error
    }
  }

  async verify(token: string) {
    try {
      await this.parse(token)
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
