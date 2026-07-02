import { useState } from 'react'
import BrandManagerDialog from './addProduct/BrandManagerDialog'
import CategoryManagerDialog from './addProduct/CategoryManagerDialog'
import AddProductForm from './addProduct/AddProductForm'

export default function AddProduct() {
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [brandDialogOpen, setBrandDialogOpen] = useState(false)

  return (
    <div className="flex flex-col h-full bg-white rounded shadow-sm border border-gray-200">
      <AddProductForm
        onOpenCategoryManager={() => setCategoryDialogOpen(true)}
        onOpenBrandManager={() => setBrandDialogOpen(true)}
      />

      <CategoryManagerDialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen} />
      <BrandManagerDialog open={brandDialogOpen} onOpenChange={setBrandDialogOpen} />
    </div>
  )
}
