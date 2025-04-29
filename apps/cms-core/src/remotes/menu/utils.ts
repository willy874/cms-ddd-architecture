export function filterTree<Tree extends object>(cKey: string, tree: Tree[], fn: (t: Tree) => boolean): Tree[] {
  return tree.reduce((acc: Tree[], item: Tree) => {
    if (fn(item)) {
      const children = Reflect.has(item, cKey) ? filterTree<Tree>(cKey, Reflect.get(item, cKey) as any, fn) : []
      acc.push({ ...item, [cKey]: children })
    }
    else if (Reflect.get(item, cKey)) {
      const children = filterTree<Tree>(cKey, Reflect.get(item, cKey) as any, fn)
      if (children.length > 0) {
        acc.push({ ...item, [cKey]: children })
      }
    }
    return acc
  }, [])
}

export function mapTree<Origin extends object, Target extends object>(key: string, origin: Origin[], fn: (item: Origin) => Target): Target[] {
  return origin.map((item) => {
    const children = Reflect.has(item, key) ? mapTree<Origin, Target>(key, Reflect.get(item, key) as any, fn) : []
    const newItem = fn(item)
    if (Object.is(newItem, item)) {
      return item as unknown as Target
    }
    return { ...newItem, [key]: children }
  })
}
