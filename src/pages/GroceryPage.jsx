import React, { useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardHeader, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { useUI } from '../context/UIContext';
import { ShoppingCart, CheckCircle2, Check, Trash2, Plus, Sparkles, Truck } from 'lucide-react';

export function GroceryPage() {
  const { groceryList, toggleGroceryItem, clearCompletedGrocery, showToast } = useUI();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const categories = ['All', 'Dairy & Eggs', 'Fresh Produce', 'Fresh Seafood', 'Pantry & Grains'];

  const filteredItems = groceryList.filter(
    (item) => selectedCategory === 'All' || item.category === selectedCategory
  );

  const checkedCount = groceryList.filter((item) => item.checked).length;
  const totalPrice = groceryList
    .filter((item) => !item.checked)
    .reduce((sum, item) => sum + (item.price || 0), 0)
    .toFixed(2);

  const handleOrder = () => {
    setIsOrderModalOpen(false);
    showToast('Grocery order submitted for 1-hour delivery! 🛒');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Smart Grocery List"
        emoji="🛒"
        subtitle="Automated ingredient consolidation from your active weekly meal plans."
        badge={<Badge variant="blue" dot>{groceryList.length} Items Total</Badge>}
        actions={
          <div className="flex items-center gap-2">
            {checkedCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Trash2 className="w-4 h-4" />}
                onClick={clearCompletedGrocery}
              >
                Clear Checked ({checkedCount})
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Truck className="w-4 h-4" />}
              onClick={() => setIsOrderModalOpen(true)}
            >
              Order Delivery (${totalPrice})
            </Button>
          </div>
        }
      />

      {/* Category Filter Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-white p-2 rounded-2xl border border-surface-200/80 shadow-2xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-brand-primary text-white shadow-xs font-bold'
                : 'bg-surface-50 hover:bg-surface-100 text-surface-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Checklist Card */}
      <Card hover>
        <CardHeader
          title="Consolidated Weekly Grocery Items"
          subtitle={`${checkedCount} of ${groceryList.length} items checked off`}
          badge={<Badge variant="emerald">${totalPrice} Est. Total</Badge>}
        />
        <CardContent className="divide-y divide-surface-100 p-0">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleGroceryItem(item.id)}
              className={`flex items-center justify-between p-4 transition-colors cursor-pointer ${
                item.checked ? 'bg-surface-50/60 opacity-60' : 'hover:bg-surface-50/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                    item.checked
                      ? 'bg-brand-primary border-brand-primary text-white'
                      : 'border-surface-300 bg-white'
                  }`}
                >
                  {item.checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <div>
                  <span
                    className={`text-xs font-bold block ${
                      item.checked ? 'line-through text-surface-400' : 'text-surface-900'
                    }`}
                  >
                    {item.name}
                  </span>
                  <span className="text-[11px] text-surface-500 block">
                    {item.quantity} • {item.category}
                  </span>
                </div>
              </div>

              <span className="text-xs font-bold text-surface-700">
                ${item.price?.toFixed(2)}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Order Delivery Confirmation Modal */}
      <Modal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        title="Confirm Smart Grocery Delivery"
        description="Deliver active weekly ingredients to Elena Vance (342 Wellness Blvd, Austin TX)."
        size="md"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsOrderModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleOrder} leftIcon={<CheckCircle2 className="w-4 h-4" />}>
              Submit Order (${totalPrice})
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-950 block">Instant Store Match</span>
              <span className="text-[11px] text-emerald-700">Whole Foods Market (1.2 miles away)</span>
            </div>
            <Badge variant="emerald">In Stock</Badge>
          </div>
          <p className="text-xs text-surface-600">
            {groceryList.filter((item) => !item.checked).length} items will be packaged and delivered in insulated temperature-controlled bags.
          </p>
        </div>
      </Modal>
    </div>
  );
}
