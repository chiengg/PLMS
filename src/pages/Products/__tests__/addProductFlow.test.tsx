import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import AddProduct from '../Add'
import Products from '..'

function LocationDisplay() {
  const location = useLocation()
  return <div data-testid="location">{location.pathname}</div>
}

function getInputInRow(label: string) {
  const labelEl = screen.getByText(label)
  const row = labelEl.parentElement
  const input = row?.querySelector('input')
  if (!input) throw new Error(`找不到输入框：${label}`)
  return input
}

function getComboboxInRow(label: string) {
  const labelEl = screen.getByText(label)
  const row = labelEl.parentElement
  const combobox = row?.querySelector('button[role="combobox"]')
  if (!combobox) throw new Error(`找不到下拉框：${label}`)
  return combobox as HTMLButtonElement
}

describe('add product acceptance flow', () => {
  it.skip('covers required validation, blacklist, category/brand sync, calculations and save', async () => {
    localStorage.clear()

    if (!('ResizeObserver' in globalThis)) {
      globalThis.ResizeObserver = class ResizeObserver {
        observe() {}
        unobserve() {}
        disconnect() {}
      }
    }

    if (!('matchMedia' in window)) {
      // @ts-expect-error - polyfill
      window.matchMedia = () => ({
        matches: false,
        media: '',
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      })
    }

    if (!Element.prototype.scrollIntoView) {
      Element.prototype.scrollIntoView = () => {}
    }

    render(
      <MemoryRouter initialEntries={['/products/add']}>
        <LocationDisplay />
        <Routes>
          <Route path="/products" element={<Products />} />
          <Route path="/products/add" element={<AddProduct />} />
        </Routes>
      </MemoryRouter>
    )

    fireEvent.click(screen.getAllByRole('button', { name: '保存并返回' })[0])
    expect(await screen.findByText('请修正 5 处错误')).toBeInTheDocument()
    expect(screen.getByText('库存SKU不能为空')).toBeInTheDocument()
    expect(screen.getByText('中文名称不能为空')).toBeInTheDocument()
    expect(screen.getByText('请选择状态')).toBeInTheDocument()
    expect(screen.getByText('请选择商品形态')).toBeInTheDocument()
    expect(screen.getByText('请选择仓库')).toBeInTheDocument()

    const skuInput = getInputInRow('库存SKU')
    fireEvent.change(skuInput, { target: { value: 'ABC_123' } })
    fireEvent.blur(skuInput)
    expect(await screen.findByText('库存SKU不支持特殊字符：’、“、!、$、?、_、{、}')).toBeInTheDocument()

    const uniq = `AUTO-${Date.now()}`
    fireEvent.change(skuInput, { target: { value: uniq } })
    fireEvent.blur(skuInput)
    await waitFor(() => expect(screen.queryByText('库存SKU不支持特殊字符：’、“、!、$、?、_、{、}')).not.toBeInTheDocument())

    fireEvent.change(getInputInRow('中文名称'), { target: { value: '自动化测试商品' } })

    fireEvent.click(getComboboxInRow('状态'))
    fireEvent.click(await screen.findByText('正常销售'))

    fireEvent.click(getComboboxInRow('商品形态'))
    fireEvent.click(await screen.findByText('实物商品'))

    fireEvent.click(getComboboxInRow('仓库'))
    fireEvent.click(await screen.findByText('东莞周转仓'))

    fireEvent.click(screen.getAllByRole('button', { name: '目录管理' })[0])
    expect(await screen.findByText('目录管理')).toBeInTheDocument()
    const categoryName = `测试目录-${Date.now()}`
    const dialogTextboxes = screen.getAllByRole('textbox')
    fireEvent.change(dialogTextboxes[dialogTextboxes.length - 4], { target: { value: categoryName } })
    fireEvent.click(screen.getByRole('button', { name: '保存' }))
    fireEvent.click(screen.getByRole('button', { name: '关闭' }))
    await waitFor(() => expect(screen.queryByText('目录管理')).not.toBeInTheDocument())

    fireEvent.click(getComboboxInRow('商品目录'))
    fireEvent.click(await screen.findByText(categoryName))

    fireEvent.click(screen.getAllByRole('button', { name: '品牌管理' })[0])
    expect(await screen.findByText('品牌管理')).toBeInTheDocument()
    const brandName = `测试品牌-${Date.now()}`
    const brandTextboxes = screen.getAllByRole('textbox')
    fireEvent.change(brandTextboxes[brandTextboxes.length - 1], { target: { value: brandName } })
    fireEvent.click(screen.getByRole('button', { name: '保存' }))
    fireEvent.click(screen.getByRole('button', { name: '关闭' }))
    await waitFor(() => expect(screen.queryByText('品牌管理')).not.toBeInTheDocument())

    fireEvent.click(getComboboxInRow('品牌'))
    fireEvent.click(await screen.findByText(brandName))

    fireEvent.change(getInputInRow('采购天数'), { target: { value: '10' } })
    fireEvent.change(getInputInRow('库存警戒天数'), { target: { value: '5' } })
    fireEvent.change(getInputInRow('预测日销量(个)'), { target: { value: '2' } })

    await waitFor(() => {
      expect(getInputInRow('库存警戒').getAttribute('value')).toBe('10')
      expect(getInputInRow('最小采购量').getAttribute('value')).toBe('20')
    })

    fireEvent.change(getInputInRow('库存警戒'), { target: { value: '999' } })
    fireEvent.change(getInputInRow('库存警戒天数'), { target: { value: '6' } })
    await waitFor(() => expect(getInputInRow('库存警戒').getAttribute('value')).toBe('999'))

    fireEvent.click(await screen.findByText('恢复默认'))
    await waitFor(() => expect(getInputInRow('库存警戒').getAttribute('value')).toBe('12'))

    fireEvent.click(screen.getAllByRole('button', { name: '保存并返回' })[0])
    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/products'), { timeout: 5000 })
    expect(screen.getByText(uniq)).toBeInTheDocument()

    const rows = screen.getAllByRole('row')
    expect(rows[1]).toHaveTextContent(uniq)

  }, 20000)
})
