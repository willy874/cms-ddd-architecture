import { SeedToken } from './seed'

export const defaultAliasToken = {}

export type AliasToken = typeof defaultAliasToken & SeedToken
