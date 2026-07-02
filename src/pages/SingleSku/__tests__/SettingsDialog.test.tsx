import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import SettingsDialog, { type ActivitySettings, type ColumnConfig, type ColumnItem } from '../SettingsDialog'

describe('SingleSku SettingsDialog', () => {
  it('does not show sync alert days copy in activity tab', () => {
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

    const lockedColumns: ColumnItem[] = [{ key: 'sku', label: '库存SKU编码', locked: true }]
    const columns: ColumnItem[] = [{ key: 'status', label: '状态', defaultWidth: 100 }]
    const columnConfig: ColumnConfig = { order: ['status'], visibility: { status: true }, widths: { status: 100 } }

    const activityValue: ActivitySettings = {
      enabled: true,
      rules: [
        { type: '爆款', timeValue: 3, timeUnit: '天', salesMin: 10, salesMax: 500, syncAlertDays: true },
        { type: '滞销款', timeValue: 1, timeUnit: '周', salesMin: 0, salesMax: 5, monthStockMin: 10, monthStockMax: 200, syncAlertDays: true },
        { type: '新款', createdDaysMin: 1, createdDaysMax: 10, syncAlertDays: true },
      ],
    }

    render(
      <SettingsDialog
        open
        onOpenChange={() => {}}
        lockedColumns={lockedColumns}
        columns={columns}
        columnConfig={columnConfig}
        defaultColumnConfig={columnConfig}
        onClearColumns={() => {}}
        activityValue={activityValue}
        defaultActivityValue={activityValue}
        onConfirm={vi.fn()}
      />
    )

    fireEvent.click(screen.getByRole('tab', { name: '活跃度设置' }))
    expect(screen.queryByText('同时修改【警戒天数】')).not.toBeInTheDocument()
  })
})

