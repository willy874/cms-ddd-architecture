import { defaultSeedTokenKey, SeedToken } from './seed'

export interface AliasToken extends SeedToken {}

export interface ComponentsToken {}

export interface GlobalToken extends AliasToken, ComponentsToken {}

export { defaultSeedTokenKey }
