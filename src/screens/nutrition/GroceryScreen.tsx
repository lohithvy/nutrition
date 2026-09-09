import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useUI } from '../../context/UIContext';
import { colors, spacing, radii, typography, shadows } from '../../constants/theme';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { Card, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import {
  ShoppingCart,
  CheckCircle2,
  Check,
  Trash2,
  Truck,
  PackageCheck,
  Store,
} from 'lucide-react-native';

export function GroceryScreen() {
  const { groceryList, toggleGroceryItem, clearCompletedGrocery, showToast } = useUI();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const categories = [
    'All',
    'Dairy & Eggs',
    'Fresh Produce',
    'Fresh Seafood',
    'Pantry & Grains',
  ];

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
    showToast('Grocery order submitted for 1-hour delivery! 🛒', 'success');
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Smart Grocery List"
        emoji="🛒"
        subtitle="Automated ingredient consolidation from your active weekly meal plans."
        rightAction={
          <Badge variant="blue" dot>
            {groceryList.length} Items Total
          </Badge>
        }
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Actions Header Row */}
        <View style={styles.actionRow}>
          {checkedCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              style={styles.actionButton}
              leftIcon={<Trash2 size={16} color={colors.surface[700]} />}
              onPress={clearCompletedGrocery}
            >
              Clear Checked ({checkedCount})
            </Button>
          )}
          <Button
            variant="primary"
            size="sm"
            style={styles.actionButton}
            leftIcon={<Truck size={16} color={colors.white} />}
            onPress={() => setIsOrderModalOpen(true)}
          >
            Order Delivery (${totalPrice})
          </Button>
        </View>

        {/* Category Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
          style={styles.categoryContainer}
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                activeOpacity={0.7}
                onPress={() => setSelectedCategory(cat)}
                style={[
                  styles.categoryPill,
                  isSelected ? styles.categoryPillSelected : styles.categoryPillDefault,
                ]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    isSelected ? styles.categoryTextSelected : styles.categoryTextDefault,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Grocery Items List Card */}
        <Card style={styles.listCard}>
          <CardHeader
            title="Consolidated Weekly Grocery Items"
            subtitle={`${checkedCount} of ${groceryList.length} items checked off`}
            badge={<Badge variant="emerald">${totalPrice} Est. Total</Badge>}
          />

          <View style={styles.divider} />

          <View style={styles.itemsList}>
            {filteredItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.7}
                onPress={() => toggleGroceryItem(item.id)}
                style={[
                  styles.itemRow,
                  item.checked && styles.itemRowChecked,
                ]}
              >
                <View style={styles.itemLeft}>
                  <View
                    style={[
                      styles.checkbox,
                      item.checked ? styles.checkboxChecked : styles.checkboxDefault,
                    ]}
                  >
                    {item.checked && <Check size={14} color={colors.white} strokeWidth={3} />}
                  </View>
                  <View>
                    <Text
                      style={[
                        styles.itemName,
                        item.checked && styles.itemNameChecked,
                      ]}
                    >
                      {item.name}
                    </Text>
                    <Text style={styles.itemMeta}>
                      {item.quantity} • {item.category}
                    </Text>
                  </View>
                </View>

                <Text style={styles.itemPrice}>${item.price?.toFixed(2)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <View style={{ height: spacing[12] }} />
      </ScrollView>

      {/* Order Delivery Confirmation Modal */}
      <Modal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        title="Confirm Smart Grocery Delivery"
        description="Deliver active weekly ingredients to Elena Vance (342 Wellness Blvd, Austin TX)."
        footer={
          <View style={styles.modalFooter}>
            <Button
              variant="outline"
              size="sm"
              style={styles.modalFooterBtn}
              onPress={() => setIsOrderModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              style={styles.modalFooterBtn}
              leftIcon={<CheckCircle2 size={16} color={colors.white} />}
              onPress={handleOrder}
            >
              Submit Order (${totalPrice})
            </Button>
          </View>
        }
      >
        <View style={styles.modalBody}>
          <View style={styles.storeMatchBox}>
            <View style={styles.storeLeft}>
              <Store size={20} color={colors.brand.primary} />
              <View>
                <Text style={styles.storeName}>Instant Store Match</Text>
                <Text style={styles.storeDist}>Whole Foods Market (1.2 miles away)</Text>
              </View>
            </View>
            <Badge variant="emerald">In Stock</Badge>
          </View>

          <Text style={styles.modalDescription}>
            {groceryList.filter((item) => !item.checked).length} items will be packaged and delivered in insulated temperature-controlled bags.
          </Text>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface[50],
  },
  scrollContent: {
    padding: spacing[4],
    gap: spacing[4],
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  actionButton: {
    flex: 1,
  },
  categoryContainer: {
    backgroundColor: colors.white,
    borderRadius: radii['2xl'],
    borderWidth: 1,
    borderColor: colors.surface[200],
    ...shadows.xs,
  },
  categoryScroll: {
    padding: spacing[2],
    gap: spacing[1.5],
  },
  categoryPill: {
    paddingVertical: spacing[1.5],
    paddingHorizontal: spacing[3],
    borderRadius: radii.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryPillSelected: {
    backgroundColor: colors.brand.primary,
    ...shadows.xs,
  },
  categoryPillDefault: {
    backgroundColor: colors.surface[50],
  },
  categoryText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.semibold,
    fontWeight: typography.fontWeight.semibold,
  },
  categoryTextSelected: {
    color: colors.white,
    fontFamily: typography.fontFamily.bold,
  },
  categoryTextDefault: {
    color: colors.surface[600],
  },
  listCard: {
    padding: 0,
    overflow: 'hidden',
  },
  divider: {
    height: 1,
    backgroundColor: colors.surface[100],
  },
  itemsList: {
    paddingVertical: spacing[1],
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.surface[100],
  },
  itemRowChecked: {
    backgroundColor: colors.surface[50],
    opacity: 0.6,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    flex: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: radii.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.brand.primary,
    borderColor: colors.brand.primary,
  },
  checkboxDefault: {
    backgroundColor: colors.white,
    borderColor: colors.surface[300],
  },
  itemName: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface[900],
  },
  itemNameChecked: {
    textDecorationLine: 'line-through',
    color: colors.surface[400],
  },
  itemMeta: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.medium,
    color: colors.surface[500],
    marginTop: 1,
  },
  itemPrice: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface[700],
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  modalFooterBtn: {
    flex: 1,
  },
  modalBody: {
    gap: spacing[3],
    paddingVertical: spacing[2],
  },
  storeMatchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing[3.5],
    backgroundColor: colors.emerald[50],
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.emerald[100],
  },
  storeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2.5],
  },
  storeName: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.emerald[950],
  },
  storeDist: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.medium,
    color: colors.emerald[700],
    marginTop: 1,
  },
  modalDescription: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.normal,
    color: colors.surface[600],
    lineHeight: 18,
  },
});
