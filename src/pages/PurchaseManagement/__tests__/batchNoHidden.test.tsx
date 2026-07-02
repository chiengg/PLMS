import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import PurchaseManagement from '..'

describe('PurchaseManagement', () => {
  it('hides purchase plan batch number in plan details dialog', async () => {
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
      <MemoryRouter>
        <PurchaseManagement />
      </MemoryRouter>
    )

    const expands = await screen.findAllByText('⊕ 展开')
    fireEvent.click(expands[0])

    const openHistoryButtons = await screen.findAllByTestId('open-plan-history')
    fireEvent.click(openHistoryButtons[0])

    const dialog = await screen.findByRole('dialog')
    fireEvent.click(within(dialog).getByText('采购计划'))

    expect(within(dialog).queryByText('采购计划批次号')).not.toBeInTheDocument()
    expect(within(dialog).queryByText('BATCH-001')).not.toBeInTheDocument()
    expect(within(dialog).queryByText('BATCH-002')).not.toBeInTheDocument()
  })
})
