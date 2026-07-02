import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import GenerateOrder from '..'

function makeEntry(state: unknown) {
  return { pathname: '/generate-purchase-order', state } as any
}

describe('GenerateOrder', () => {
  it('renders extra info settings per supplier+buyer group', () => {
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
      <MemoryRouter
        initialEntries={[
          makeEntry({
            selectedItems: [
              {
                id: 'x1',
                supplierName: '深圳优声电子有限公司',
                buyer: '张伟',
                sku: 'SKU-1',
                name: '商品1',
                purchasePrice: 10,
                deliveryDays: 10,
                suggestedQuantity: 1,
              },
              {
                id: 'x2',
                supplierName: '东莞市欣荣电子有限公司',
                buyer: '李娜',
                sku: 'SKU-2',
                name: '商品2',
                purchasePrice: 20,
                deliveryDays: 20,
                suggestedQuantity: 2,
              },
            ],
          }),
        ]}
      >
        <Routes>
          <Route path="/generate-purchase-order" element={<GenerateOrder />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getAllByText('其他信息').length).toBe(2)

    const fee1 = screen.getByTestId('shipping-fee-深圳优声电子有限公司||张伟')
    const fee2 = screen.getByTestId('shipping-fee-东莞市欣荣电子有限公司||李娜')

    fireEvent.change(fee1, { target: { value: '12.5' } })
    expect((fee1 as HTMLInputElement).value).toBe('12.5')
    expect((fee2 as HTMLInputElement).value).toBe('')
  })
})

