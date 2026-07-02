const blacklist = ["’", "、", "“", "!", "$", "?", "_", "{", "}"] as const

export function validateSku(params: { sku: string; existingSkus: string[] }) {
  const sku = params.sku.trim()
  if (!sku) return { ok: false as const, message: '库存SKU不能为空' }
  if (blacklist.some((c) => sku.includes(c))) {
    return {
      ok: false as const,
      message: '库存SKU不支持特殊字符：’、“、!、$、?、_、{、}',
    }
  }
  if (params.existingSkus.includes(sku)) return { ok: false as const, message: '库存SKU已存在，请更换' }
  return { ok: true as const, value: sku }
}

export function validateUpperLimit(v: number) {
  if (Number.isNaN(v)) return { ok: false as const, message: '采购上限必须为数字' }
  if (v < 0 || v > 100000) return { ok: false as const, message: '采购上限范围为 0~100000' }
  return { ok: true as const }
}
