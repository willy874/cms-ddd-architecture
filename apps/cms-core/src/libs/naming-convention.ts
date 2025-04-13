export type KebabCaseToSnakeCase<S extends string> =
  S extends `${infer T}-${infer U}`
    ? `${T}_${KebabCaseToSnakeCase<U>}`
    : S

export type KebabToCamelCase<S extends string> =
  S extends `${infer T}-${infer U}`
    ? `${T}${Capitalize<KebabToCamelCase<U>>}`
    : S

export type KebabToScreamingSnakeCase<S extends string> =
  S extends `${infer T}-${infer U}`
    ? `${Uppercase<T>}_${KebabToScreamingSnakeCase<U>}`
    : Uppercase<S>

export type CamelCaseToKebabCase<S extends string> =
  S extends `${infer T}${infer U}`
    ? T extends Uppercase<T>
      ? `-${Lowercase<T>}${CamelCaseToKebabCase<U>}`
      : `${T}${CamelCaseToKebabCase<U>}`
    : S

export function camelCaseToKebabCase<S extends string>(str: S): CamelCaseToKebabCase<S> {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() as CamelCaseToKebabCase<S>
}

export type CamelToSnakeCase<S extends string> =
  S extends `${infer T}${infer U}`
    ? T extends Uppercase<T>
      ? `_${Lowercase<T>}${CamelToSnakeCase<U>}`
      : `${T}${CamelToSnakeCase<U>}`
    : S

export type CamelToScreamingSnakeCase<S extends string> =
  S extends `${infer T}${infer U}`
    ? T extends Uppercase<T>
      ? `_${Uppercase<T>}${CamelToScreamingSnakeCase<U>}`
      : `${T}${CamelToScreamingSnakeCase<U>}`
    : Uppercase<S>

export type SnakeToKebabCase<S extends string> =
  S extends `${infer T}_${infer U}`
    ? `${T}-${SnakeToKebabCase<U>}`
    : S

export type SnakeToCamelCase<S extends string> =
  S extends `${infer T}_${infer U}`
    ? `${T}${Capitalize<SnakeToCamelCase<U>>}`
    : S

export type SnakeToScreamingSnakeCase<S extends string> =
  S extends `${infer T}_${infer U}`
    ? `${Uppercase<T>}_${SnakeToScreamingSnakeCase<U>}`
    : Uppercase<S>

export type ScreamingSnakeToKebabCase<S extends string> =
  S extends `${infer T}_${infer U}`
    ? `${Lowercase<T>}-${ScreamingSnakeToKebabCase<U>}`
    : Lowercase<S>

export type ScreamingSnakeToCamelCase<S extends string> =
  S extends `${infer T}_${infer U}`
    ? `${T}${Capitalize<ScreamingSnakeToCamelCase<U>>}`
    : S

export type ScreamingSnakeToSnakeCase<S extends string> =
  S extends `${infer T}_${infer U}`
    ? `${Lowercase<T>}_${ScreamingSnakeToSnakeCase<U>}`
    : Lowercase<S>
