import { z } from 'zod'

export const NoneMenuItemSchema = z.object({
  type: z.literal('none'),
})

export const NormalMenuItemSchema = z.object({
  key: z.string(),
  type: z.literal('normal'),
  label: z.union([z.string(), z.function()]).optional(),
  action: z.union([z.string(), z.function()]).optional(),
  auth: z.union([z.string(), z.boolean()]).optional(),
})

export const DividerMenuItemSchema = z.object({
  key: z.string(),
  type: z.literal('divider'),
})

export const MenuSubItemSchema = z.union([NormalMenuItemSchema, DividerMenuItemSchema, NoneMenuItemSchema])

export const GroupMenuItemSchema = z.object({
  key: z.string(),
  type: z.literal('group'),
  label: z.union([z.string(), z.function()]).optional(),
  auth: z.union([z.string(), z.boolean()]).optional(),
  children: z.array(MenuSubItemSchema).optional(),
})

export const MenuItemSchema = z.union([NormalMenuItemSchema, DividerMenuItemSchema, GroupMenuItemSchema, NoneMenuItemSchema])
export const MenuListSchema = z.array(MenuItemSchema)
