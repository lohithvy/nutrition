import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useUI } from '../../context/UIContext';
import { useNutrition } from '../../context/NutritionContext';
import { formatDateDisplay } from '../../utils/date';
import { colors, spacing, radii, typography, shadows } from '../../constants/theme';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { Card, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  Scan,
  ShieldCheck,
  Plus,
  Minus,
  RotateCcw,
  Search,
  Barcode,
  Check,
} from 'lucide-react-native';

const mockPackagedProducts = [
  {
    code: '0737628064502',
    name: 'Organic Rolled Oats (Gluten-Free)',
    brand: "Bob's Red Mill",
    serving: '50g (1/2 cup)',
    calories: 190,
    protein: 7,
    carbs: 32,
    fat: 3.5,
    fiber: 5,
    category: 'Grains',
  },
  {
    code: '0852390147281',
    name: 'Raw California Almond Butter',
    brand: 'Artisana Organics',
    serving: '32g (2 tbsp)',
    calories: 200,
    protein: 7,
    carbs: 6,
    fat: 18,
    fiber: 4,
    category: 'Fats',
  },
  {
    code: '0412208945104',
    name: '100% Pure Whey Isolate Protein',
    brand: 'Optimum Nutrition',
    serving: '30g scoop',
    calories: 120,
    protein: 25,
    carbs: 1,
    fat: 1,
    fiber: 0,
    category: 'Protein',
  },
];

export function BarcodeScannerScreen() {
  const { showToast } = useUI();
  const { addFood, selectedDate } = useNutrition();

  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'result'>('idle');
  const [selectedProductIndex, setSelectedProductIndex] = useState(0);
  const [manualCode, setManualCode] = useState('');
  const [targetMeal, setTargetMeal] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [quantity, setQuantity] = useState(1);

  const activeProduct = mockPackagedProducts[selectedProductIndex];

  const handleScanBarcode = (idx = selectedProductIndex) => {
    setSelectedProductIndex(idx);
    setScanState('scanning');
    setQuantity(1);

    setTimeout(() => {
      setScanState('result');
      showToast(`Barcode ${mockPackagedProducts[idx].code} recognized! 🏷️`, 'success');
    }, 900);
  };

  const handleManualSearch = () => {
    if (!manualCode.trim()) return;

    const foundIdx = mockPackagedProducts.findIndex(
      (p) =>
        p.code.includes(manualCode.trim()) ||
        p.name.toLowerCase().includes(manualCode.toLowerCase())
    );

    if (foundIdx !== -1) {
      handleScanBarcode(foundIdx);
    } else {
      handleScanBarcode(0);
    }
  };

  const handleAddToDiary = () => {
    addFood(
      {
        name: `${activeProduct.name} (${activeProduct.brand})`,
        portion: activeProduct.serving,
        calories: activeProduct.calories,
        protein: activeProduct.protein,
        carbs: activeProduct.carbs,
        fat: activeProduct.fat,
        fiber: activeProduct.fiber,
        category: activeProduct.category,
      },
      targetMeal,
      quantity,
      selectedDate
    );

    showToast(
      `Added ${quantity}x ${activeProduct.name} to ${targetMeal} on ${formatDateDisplay(selectedDate)}! 🥑`,
      'success'
    );
    setScanState('idle');
  };

  const scaledCalories = Math.round(activeProduct.calories * quantity);
  const scaledProtein = Math.round(activeProduct.protein * quantity * 10) / 10;
  const scaledCarbs = Math.round(activeProduct.carbs * quantity * 10) / 10;
  const scaledFat = Math.round(activeProduct.fat * quantity * 10) / 10;

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Smart Barcode Scanner"
        emoji="🏷️"
        subtitle={`Scan packaged food UPC barcodes to pull verified nutrition for ${formatDateDisplay(selectedDate)}.`}
        rightAction={
          <Badge variant="blue">
            UPC Database
          </Badge>
        }
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Laser Viewfinder Box */}
        <View style={styles.viewfinderContainer}>
          <View style={styles.viewfinderHeader}>
            <View style={styles.detectorBadge}>
              <Scan size={14} color={colors.sky[400]} />
              <Text style={styles.detectorText}>Barcode Laser Active</Text>
            </View>
            <Text style={styles.upcCode}>UPC: {activeProduct.code}</Text>
          </View>

          {/* Laser Scanner Frame */}
          <View style={styles.laserReticleArea}>
            <View style={styles.laserBox}>
              <Barcode size={80} color="rgba(255,255,255,0.08)" style={styles.barcodeBg} />

              {scanState === 'scanning' ? (
                <View style={styles.laserGreen} />
              ) : scanState === 'result' ? (
                <View style={styles.decodedRow}>
                  <Check size={18} color={colors.emerald[400]} strokeWidth={3} />
                  <Text style={styles.decodedText}>Barcode Decoded</Text>
                </View>
              ) : (
                <View style={styles.laserRed} />
              )}
            </View>
            <Text style={styles.laserHint}>
              {scanState === 'scanning'
                ? 'Decoding UPC barcode...'
                : 'Align barcode within the laser target'}
            </Text>
          </View>

          {/* Manual Input Search & Quick Barcode Pills */}
          <View style={styles.searchSection}>
            <View style={styles.searchBar}>
              <TextInput
                value={manualCode}
                onChangeText={setManualCode}
                placeholder="Enter UPC number or product name..."
                placeholderTextColor={colors.surface[500]}
                style={styles.searchInput}
                onSubmitEditing={handleManualSearch}
              />
              <TouchableOpacity onPress={handleManualSearch} style={styles.searchBtn}>
                <Search size={14} color={colors.white} />
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.pillScroll}
            >
              {mockPackagedProducts.map((p, idx) => {
                const isSelected = selectedProductIndex === idx && scanState !== 'idle';
                return (
                  <TouchableOpacity
                    key={p.code}
                    activeOpacity={0.7}
                    onPress={() => handleScanBarcode(idx)}
                    style={[
                      styles.productPill,
                      isSelected ? styles.productPillSelected : styles.productPillDefault,
                    ]}
                  >
                    <Text
                      style={[
                        styles.productPillText,
                        isSelected ? styles.productPillTextSelected : styles.productPillTextDefault,
                      ]}
                    >
                      {p.name.split(' ')[0]} {p.name.split(' ')[1]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>

        {/* Nutrition Facts Label Card */}
        <Card style={styles.resultCard}>
          <CardHeader
            title={scanState === 'result' ? activeProduct.name : 'Nutrition Facts Preview'}
            subtitle={
              scanState === 'result'
                ? `Brand: ${activeProduct.brand}`
                : 'Scan a packaged item to inspect details'
            }
            badge={
              scanState === 'result' ? (
                <Badge variant="emerald">
                  <ShieldCheck size={12} color={colors.emerald[700]} /> Verified Label
                </Badge>
              ) : (
                <Badge variant="slate">Awaiting Scan</Badge>
              )
            }
          />

          {scanState === 'result' ? (
            <View style={styles.resultBody}>
              {/* Product Fact Panel */}
              <View style={styles.factsPanel}>
                <View style={styles.servingRow}>
                  <Text style={styles.servingLabel}>SERVING SIZE</Text>
                  <Text style={styles.servingValue}>{activeProduct.serving}</Text>
                </View>

                {/* Macro Grid */}
                <View style={styles.macroGrid}>
                  <View style={styles.macroCell}>
                    <Text style={styles.macroCellVal}>{scaledCalories}</Text>
                    <Text style={styles.macroCellLbl}>kcal</Text>
                  </View>
                  <View style={styles.macroCell}>
                    <Text style={[styles.macroCellVal, { color: colors.nutrition.protein }]}>
                      {scaledProtein}g
                    </Text>
                    <Text style={styles.macroCellLbl}>Protein</Text>
                  </View>
                  <View style={styles.macroCell}>
                    <Text style={[styles.macroCellVal, { color: colors.nutrition.carbs }]}>
                      {scaledCarbs}g
                    </Text>
                    <Text style={styles.macroCellLbl}>Carbs</Text>
                  </View>
                  <View style={styles.macroCell}>
                    <Text style={[styles.macroCellVal, { color: colors.nutrition.fat }]}>
                      {scaledFat}g
                    </Text>
                    <Text style={styles.macroCellLbl}>Fat</Text>
                  </View>
                </View>

                <View style={styles.factsFooter}>
                  <Text style={styles.factsMeta}>
                    Dietary Fiber: {activeProduct.fiber * quantity}g
                  </Text>
                  <Text style={styles.factsMeta}>Category: {activeProduct.category}</Text>
                </View>
              </View>

              {/* Controls */}
              <View style={styles.controlsRow}>
                {/* Stepper */}
                <View style={styles.stepperContainer}>
                  <Text style={styles.controlLabel}>Serving Multiplier</Text>
                  <View style={styles.stepperBox}>
                    <TouchableOpacity
                      onPress={() => setQuantity((prev) => Math.max(0.5, prev - 0.5))}
                      style={styles.stepBtn}
                    >
                      <Minus size={14} color={colors.surface[700]} />
                    </TouchableOpacity>
                    <Text style={styles.stepVal}>{quantity}x</Text>
                    <TouchableOpacity
                      onPress={() => setQuantity((prev) => prev + 0.5)}
                      style={styles.stepBtn}
                    >
                      <Plus size={14} color={colors.surface[700]} />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Meal Selector */}
                <View style={styles.mealSlotContainer}>
                  <Text style={styles.controlLabel}>Log to Meal</Text>
                  <View style={styles.slotPills}>
                    {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((slot) => {
                      const isSel = targetMeal === slot;
                      return (
                        <TouchableOpacity
                          key={slot}
                          onPress={() => setTargetMeal(slot)}
                          style={[
                            styles.slotPill,
                            isSel && styles.slotPillSelected,
                          ]}
                        >
                          <Text
                            style={[
                              styles.slotPillText,
                              isSel && styles.slotPillTextSelected,
                            ]}
                          >
                            {slot[0].toUpperCase() + slot.slice(1)}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </View>

              {/* Actions */}
              <View style={styles.footerRow}>
                <Button
                  variant="outline"
                  size="sm"
                  style={styles.rescanBtn}
                  leftIcon={<RotateCcw size={16} color={colors.surface[700]} />}
                  onPress={() => setScanState('idle')}
                >
                  Rescan
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  style={styles.addBtn}
                  leftIcon={<Plus size={16} color={colors.white} />}
                  onPress={handleAddToDiary}
                >
                  Add to Diary ({scaledCalories} kcal)
                </Button>
              </View>
            </View>
          ) : (
            <View style={styles.emptyStateContainer}>
              <View style={styles.emptyIconCircle}>
                <Barcode size={24} color={colors.surface[400]} />
              </View>
              <Text style={styles.emptyText}>
                Scan a product barcode or pick a sample above to view verified nutrition facts.
              </Text>
              <Button
                variant="primary"
                size="md"
                leftIcon={<Scan size={18} color={colors.white} />}
                onPress={() => handleScanBarcode(0)}
                style={{ width: '100%', marginTop: spacing[3] }}
              >
                Scan Barcode
              </Button>
            </View>
          )}
        </Card>

        <View style={{ height: spacing[12] }} />
      </ScrollView>
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
  viewfinderContainer: {
    backgroundColor: colors.surface[900],
    borderRadius: radii['3xl'],
    padding: spacing[4],
    borderWidth: 1,
    borderColor: colors.surface[800],
    ...shadows.card,
  },
  viewfinderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detectorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface[800],
    paddingHorizontal: spacing[2.5],
    paddingVertical: spacing[1],
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.surface[700],
    gap: spacing[1.5],
  },
  detectorText: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.sky[400],
  },
  upcCode: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.mono,
    color: colors.surface[400],
  },
  laserReticleArea: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[6],
  },
  laserBox: {
    width: 220,
    height: 100,
    borderRadius: radii.xl,
    borderWidth: 2,
    borderColor: 'rgba(56, 189, 248, 0.6)',
    backgroundColor: 'rgba(12, 74, 110, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  barcodeBg: {
    position: 'absolute',
  },
  laserRed: {
    width: '100%',
    height: 2,
    backgroundColor: '#ef4444',
  },
  laserGreen: {
    width: '100%',
    height: 3,
    backgroundColor: '#34d399',
  },
  decodedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1.5],
  },
  decodedText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.emerald[400],
  },
  laserHint: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.mono,
    color: colors.sky[300],
    marginTop: spacing[3],
  },
  searchSection: {
    borderTopWidth: 1,
    borderTopColor: colors.surface[800],
    paddingTop: spacing[3],
    gap: spacing[2.5],
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  searchInput: {
    flex: 1,
    backgroundColor: colors.surface[800],
    borderWidth: 1,
    borderColor: colors.surface[700],
    borderRadius: radii.xl,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.normal,
    color: colors.white,
  },
  searchBtn: {
    backgroundColor: colors.brand.primary,
    padding: spacing[2.5],
    borderRadius: radii.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillScroll: {
    gap: spacing[2],
  },
  productPill: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1.5],
    borderRadius: radii.xl,
    borderWidth: 1,
  },
  productPillSelected: {
    backgroundColor: colors.brand.primary,
    borderColor: colors.brand.primary,
  },
  productPillDefault: {
    backgroundColor: colors.surface[800],
    borderColor: colors.surface[700],
  },
  productPillText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.semibold,
  },
  productPillTextSelected: {
    color: colors.white,
    fontFamily: typography.fontFamily.bold,
  },
  productPillTextDefault: {
    color: colors.surface[300],
  },
  resultCard: {
    padding: spacing[4],
  },
  resultBody: {
    gap: spacing[3.5],
    marginTop: spacing[2],
  },
  factsPanel: {
    backgroundColor: colors.surface[50],
    borderRadius: radii['2xl'],
    padding: spacing[3.5],
    borderWidth: 1,
    borderColor: colors.surface[200],
    gap: spacing[2.5],
  },
  servingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.surface[200],
    paddingBottom: spacing[2],
  },
  servingLabel: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface[500],
    letterSpacing: 0.5,
  },
  servingValue: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface[900],
  },
  macroGrid: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  macroCell: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    paddingVertical: spacing[2],
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.surface[200],
    ...shadows.xs,
  },
  macroCellVal: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface[900],
  },
  macroCellLbl: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.medium,
    color: colors.surface[400],
    marginTop: 1,
  },
  factsFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing[1],
  },
  factsMeta: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.medium,
    color: colors.surface[500],
  },
  controlsRow: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  stepperContainer: {
    flex: 1,
    gap: spacing[1],
  },
  mealSlotContainer: {
    flex: 2,
    gap: spacing[1],
  },
  controlLabel: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface[500],
  },
  stepperBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface[50],
    borderRadius: radii.xl,
    padding: spacing[1.5],
    borderWidth: 1,
    borderColor: colors.surface[200],
  },
  stepBtn: {
    padding: spacing[1.5],
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.surface[200],
  },
  stepVal: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface[900],
  },
  slotPills: {
    flexDirection: 'row',
    backgroundColor: colors.surface[50],
    borderRadius: radii.xl,
    padding: 3,
    borderWidth: 1,
    borderColor: colors.surface[200],
  },
  slotPill: {
    flex: 1,
    paddingVertical: spacing[1.5],
    alignItems: 'center',
    borderRadius: radii.lg,
  },
  slotPillSelected: {
    backgroundColor: colors.brand.primary,
  },
  slotPillText: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface[600],
  },
  slotPillTextSelected: {
    color: colors.white,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginTop: spacing[2],
  },
  rescanBtn: {
    flex: 1,
  },
  addBtn: {
    flex: 2,
  },
  emptyStateContainer: {
    paddingVertical: spacing[8],
    alignItems: 'center',
    gap: spacing[2],
  },
  emptyIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.normal,
    color: colors.surface[400],
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: spacing[4],
  },
});
