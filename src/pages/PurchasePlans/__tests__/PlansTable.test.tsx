import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import PlansTable from '../components/PlansTable'

describe('PlansTable', () => {
  it('hides supplier label next to plan number', () => {
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
      <MemoryRouter initialEntries={['/purchase-plans']}>
        <Routes>
          <Route path="/purchase-plans" element={<PlansTable />} />
        </Routes>
      </MemoryRouter>
    )

    const planLabels = screen.getAllByText(/计划号：/)
    expect(planLabels.length).toBeGreaterThan(0)
    planLabels.forEach((planLabel) => {
      const container = planLabel.closest('div')
      expect(container).toBeTruthy()
      expect(within(container!).queryByText(/供应商：/)).not.toBeInTheDocument()
    })
  })

  it('allows editing supplier in supplier column', async () => {
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
      <MemoryRouter initialEntries={['/purchase-plans']}>
        <Routes>
          <Route path="/purchase-plans" element={<PlansTable />} />
        </Routes>
      </MemoryRouter>
    )

    const supplierCell = screen.getByText('深圳优声电子有限公司')
    const row = supplierCell.closest('tr') as HTMLElement | null
    expect(row).toBeTruthy()
    fireEvent.click(within(row!).getByLabelText('编辑供应商'))

    const dialogTitle = await screen.findByText('更换供应商')
    const dialog = dialogTitle.closest('[data-slot="dialog-content"]') as HTMLElement | null
    expect(dialog).toBeTruthy()

    const input = within(dialog!).getByPlaceholderText('请输入供应商名称')
    fireEvent.change(input, { target: { value: '测试供应商X' } })

    fireEvent.click(within(dialog!).getByRole('button', { name: '确认' }))

    await waitFor(() => expect(screen.getByText('测试供应商X')).toBeInTheDocument())

    const raw = localStorage.getItem('purchase_plans_data_v2')
    expect(raw).toBeTruthy()
    const parsed = raw ? JSON.parse(raw) : []
    const allItems = parsed.flatMap((g: any) => g.items || [])
    expect(allItems.some((i: any) => i.id === 'plan-p1' && i.supplierName === '测试供应商X')).toBe(true)
  })

  it('does not auto-apply when choosing supplier, requires confirm', async () => {
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
      <MemoryRouter initialEntries={['/purchase-plans']}>
        <Routes>
          <Route path="/purchase-plans" element={<PlansTable />} />
        </Routes>
      </MemoryRouter>
    )

    const supplierCell = screen.getByText('深圳优声电子有限公司')
    const row = supplierCell.closest('tr') as HTMLElement | null
    expect(row).toBeTruthy()
    fireEvent.click(within(row!).getByLabelText('编辑供应商'))

    const dialogTitle = await screen.findByText('更换供应商')
    const dialog = dialogTitle.closest('[data-slot="dialog-content"]') as HTMLElement | null
    expect(dialog).toBeTruthy()

    fireEvent.click(within(dialog!).getAllByText('选择')[0])
    expect(screen.getByText('更换供应商')).toBeInTheDocument()
    expect(screen.queryByText('广州市贝衣情纺织品有限公司')).toBeInTheDocument()
    expect(screen.getByText('深圳优声电子有限公司')).toBeInTheDocument()

    fireEvent.click(within(dialog!).getByRole('button', { name: '确认' }))
    await waitFor(() => expect(screen.getByText('广州市贝衣情纺织品有限公司')).toBeInTheDocument())
  })
})
