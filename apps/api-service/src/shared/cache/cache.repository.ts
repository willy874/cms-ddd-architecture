export abstract class ICacheRepository {
  abstract set(key: string, value: string, ttl?: number): Promise<string>
  abstract get(key: string): Promise<string | null>
  abstract del(key: string): Promise<boolean>
}
