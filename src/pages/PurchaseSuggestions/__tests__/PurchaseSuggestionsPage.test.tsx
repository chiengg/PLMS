import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import PurchaseSuggestions from '..'

describe('PurchaseSuggestions page', () => {
  it('does not display supplier information', () => {
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
      <MemoryRouter initialEntries={['/purchase-suggestions']}>
        <Routes>
          <Route path="/purchase-suggestions" element={<PurchaseSuggestions />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.queryByText('全部供应商')).not.toBeInTheDocument()
    expect(screen.queryByText('涉及供应商：')).not.toBeInTheDocument()
    expect(screen.queryByText('深圳优声电子有限公司')).not.toBeInTheDocument()
    expect(screen.queryByText(/供应商：/)).not.toBeInTheDocument()
  })
})

