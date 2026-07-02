import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import ScanReceive from '../components/ScanReceive'

function ensureDomPolyfills() {
  if (!('ResizeObserver' in globalThis)) {
    ;(globalThis as any).ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  }

  if (!('matchMedia' in window)) {
    ;(window as any).matchMedia = () => ({
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
}

describe('ScanReceive', () => {
  it('searches purchase order by orderNo when status is 采购中', () => {
    ensureDomPolyfills()
    localStorage.clear()
    ;(window as any).alert = () => {}

    const orderNo = 'PO-SEARCH-001'
    localStorage.setItem(
      'purchase_orders_data_v11',
      JSON.stringify([
        {
          id: '1',
          orderNo,
          status: '采购中',
          warehouse: '东莞厚街仓',
          buyer: '采购员A',
          items: [
            { id: 'i1', sku: 'SKU-1', name: '商品1', quantity: 2, receivedQty: 0, image: 'x' },
          ],
        },
      ])
    )

    render(
      <MemoryRouter initialEntries={['/receiving/scan']}>
        <Routes>
          <Route path="/receiving/scan" element={<ScanReceive />} />
        </Routes>
      </MemoryRouter>
    )

    const input = screen.getByPlaceholderText('物流单号/采购单号/自定义单号')
    fireEvent.change(input, { target: { value: orderNo } })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(screen.getByText(orderNo)).toBeInTheDocument()
    expect(screen.getByText('采购中')).toBeInTheDocument()
  })
})
