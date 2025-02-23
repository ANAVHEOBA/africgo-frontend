"use client"

import { useState } from 'react'
import { ProductVariant } from '@/lib/products/types'

interface ProductVariantsProps {
  variants: ProductVariant[]
  onChange: (variants: ProductVariant[]) => void
}

export default function ProductVariants({ variants, onChange }: ProductVariantsProps) {
  const [newVariantName, setNewVariantName] = useState('')
  const [newOptionValue, setNewOptionValue] = useState('')

  const addVariant = () => {
    if (!newVariantName.trim()) return
    
    onChange([
      ...variants,
      {
        name: newVariantName.trim(),
        options: [],
        prices: []
      }
    ])
    setNewVariantName('')
  }

  const removeVariant = (index: number) => {
    onChange(variants.filter((_, i) => i !== index))
  }

  const addOption = (variantIndex: number) => {
    if (!newOptionValue.trim()) return

    const newVariants = [...variants]
    newVariants[variantIndex].options.push(newOptionValue.trim())
    if (newVariants[variantIndex].prices) {
      newVariants[variantIndex].prices?.push(0)
    }
    onChange(newVariants)
    setNewOptionValue('')
  }

  const removeOption = (variantIndex: number, optionIndex: number) => {
    const newVariants = [...variants]
    newVariants[variantIndex].options.splice(optionIndex, 1)
    newVariants[variantIndex].prices?.splice(optionIndex, 1)
    onChange(newVariants)
  }

  const updateOptionPrice = (variantIndex: number, optionIndex: number, price: number) => {
    const newVariants = [...variants]
    if (!newVariants[variantIndex].prices) {
      newVariants[variantIndex].prices = newVariants[variantIndex].options.map(() => 0)
    }
    const validPrice = Number(price) || 0
    newVariants[variantIndex].prices![optionIndex] = validPrice
    onChange(newVariants)
  }

  return (
    <div className="bg-dark-secondary p-6 rounded-lg shadow-sm border border-white/10">
      <h3 className="text-lg font-medium text-white mb-4">Product Variants</h3>

      {/* Add New Variant */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newVariantName}
          onChange={(e) => setNewVariantName(e.target.value)}
          placeholder="Enter variant name (e.g., Size, Color)"
          className="flex-1 px-4 py-2 bg-dark-primary border border-white/10 rounded-lg 
            text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-primary"
        />
        <button
          type="button"
          onClick={addVariant}
          className="px-4 py-2 bg-gradient-to-r from-gold-primary to-gold-secondary text-dark-primary 
            rounded-lg hover:shadow-lg hover:shadow-gold-primary/20"
        >
          Add Variant
        </button>
      </div>

      {/* Variants List */}
      <div className="space-y-6">
        {variants.map((variant, variantIndex) => (
          <div key={variantIndex} className="border border-white/10 rounded-lg p-4 bg-dark-primary">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-white">{variant.name}</h4>
              <button
                type="button"
                onClick={() => removeVariant(variantIndex)}
                className="text-red-400 hover:text-red-300"
              >
                Remove Variant
              </button>
            </div>

            {/* Options List */}
            <div className="space-y-2">
              {variant.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center gap-2">
                  <span className="flex-1 text-text-secondary">{option}</span>
                  <input
                    type="number"
                    value={variant.prices?.[optionIndex] || 0}
                    onChange={(e) => updateOptionPrice(variantIndex, optionIndex, parseFloat(e.target.value))}
                    placeholder="Price adjustment"
                    className="w-32 px-2 py-1 bg-dark-primary border border-white/10 rounded 
                      text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-primary"
                  />
                  <button
                    type="button"
                    onClick={() => removeOption(variantIndex, optionIndex)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Add Option */}
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={newOptionValue}
                onChange={(e) => setNewOptionValue(e.target.value)}
                placeholder={`Enter ${variant.name.toLowerCase()} option`}
                className="flex-1 px-2 py-1 bg-dark-primary border border-white/10 rounded 
                  text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-primary"
              />
              <button
                type="button"
                onClick={() => addOption(variantIndex)}
                className="px-3 py-1 bg-dark-primary border border-white/10 rounded 
                  text-text-secondary hover:bg-dark-secondary"
              >
                Add Option
              </button>
            </div>
          </div>
        ))}
      </div>

      {variants.length === 0 && (
        <p className="text-text-secondary text-center py-4">
          No variants added yet. Add variants like Size or Color to create product options.
        </p>
      )}
    </div>
  )
} 