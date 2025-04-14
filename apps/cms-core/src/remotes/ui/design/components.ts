import { GetDeepProperty } from '@/libs/getDeepProperty'

export interface ComponentsToken {}

export type GetComponentsTokenByPath<
  Path extends string | string[],
> = GetDeepProperty<ComponentsToken, Path extends string[] ? Path : [Path], {}>
