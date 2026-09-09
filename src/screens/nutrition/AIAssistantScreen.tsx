import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useUI } from '../../context/UIContext';
import { useAuth } from '../../context/AuthContext';
import { useNutrition } from '../../context/NutritionContext';
import { formatDateDisplay } from '../../utils/date';
import { colors, spacing, radii, typography, shadows } from '../../constants/theme';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  Bot,
  Send,
  Sparkles,
  Plus,
  User as UserIcon,
  RotateCcw,
} from 'lucide-react-native';

interface Recommendation {
  title: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
}

interface ChatMessage {
  id: number;
  sender: 'ai' | 'user';
  text: string;
  time: string;
  recommendation?: Recommendation | null;
}

export function AIAssistantScreen() {
  const { user } = useAuth();
  const { showToast } = useUI();
  const { selectedDate, targets, totals, addFood } = useNutrition();
  const scrollViewRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: 'ai',
      text: `Hello ${user.firstName}! For ${formatDateDisplay(selectedDate)}, you currently have ${totals.remainingCalories} kcal remaining out of your ${targets.calories} kcal budget, with ${Math.max(0, Math.round((targets.protein - totals.protein) * 10) / 10)}g of protein needed. What would you like me to formulate or analyze?`,
      time: 'Just now',
      recommendation: {
        title: 'Pan-Seared Alaskan Salmon with Asparagus',
        calories: 380,
        protein: 36,
        carbs: 6,
        fat: 18,
        fiber: 4,
      },
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const suggestionPrompts = [
    `What should I eat for dinner? (under ${Math.min(600, totals.remainingCalories || 500)} kcal)`,
    'Am I on track for protein today?',
    'Suggest high-fiber snacks with low glycemic index',
    'How is my hydration pacing today?',
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputVal;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      text,
      time: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    setTimeout(() => {
      let aiResponseText = `Based on your glucose stability index and ${totals.remainingCalories} kcal remaining budget for ${formatDateDisplay(selectedDate)}, I recommend prioritizing lean protein and complex micronutrients.`;
      let rec: Recommendation | null = null;

      const lower = text.toLowerCase();
      if (lower.includes('dinner')) {
        aiResponseText = `Here is a chef-formulated dinner that fits your remaining ${totals.remainingCalories} kcal and provides 42g of clean protein:`;
        rec = {
          title: 'Lemon Herb Chicken & Quinoa Bowl',
          calories: Math.min(460, totals.remainingCalories || 460),
          protein: 42,
          carbs: 38,
          fat: 12,
          fiber: 6,
        };
      } else if (lower.includes('snack')) {
        aiResponseText = `Here is a high-protein, zero-added-sugar snack to stabilize your afternoon energy:`;
        rec = {
          title: 'Organic Greek Yogurt with Chia & Blueberries',
          calories: 160,
          protein: 18,
          carbs: 14,
          fat: 2,
          fiber: 4,
        };
      } else if (lower.includes('protein')) {
        aiResponseText = `You've logged ${totals.protein}g of protein out of your ${targets.protein}g target (${Math.round((totals.protein / targets.protein) * 100)}%). Adding a 25-30g protein source at your next meal will hit your metabolic pacing goal.`;
      } else if (lower.includes('hydration') || lower.includes('water')) {
        aiResponseText = `You have consumed ${totals.water}L out of your ${targets.water}L target (${totals.waterPercent}%). Drinking a glass with electrolytes will ensure cellular recovery.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: aiResponseText,
          time: 'Just now',
          recommendation: rec,
        },
      ]);
      setIsTyping(false);

      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 800);
  };

  const handleLogRecommendation = (rec: Recommendation) => {
    addFood(
      {
        name: rec.title,
        calories: rec.calories,
        protein: rec.protein,
        carbs: rec.carbs,
        fat: rec.fat,
        fiber: rec.fiber || 0,
        portion: '1 serving',
      },
      'dinner',
      1,
      selectedDate
    );
    showToast(`Logged "${rec.title}" to Dinner! 🥑`, 'success');
  };

  const handleReset = () => {
    setMessages([
      {
        id: Date.now(),
        sender: 'ai',
        text: `New session started! You have ${totals.remainingCalories} kcal remaining for ${formatDateDisplay(selectedDate)}. How can I assist?`,
        time: 'Just now',
      },
    ]);
    showToast('Conversation reset', 'info');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScreenHeader
        title="Nutri AI Assistant"
        emoji="🤖"
        subtitle={`24/7 personalized metabolic nutritionist for ${formatDateDisplay(selectedDate)}.`}
        rightAction={
          <Button
            variant="outline"
            size="xs"
            leftIcon={<RotateCcw size={12} color={colors.surface[700]} />}
            onPress={handleReset}
          >
            Reset
          </Button>
        }
      />

      {/* Suggestion Chips */}
      <View style={styles.chipsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsScroll}
        >
          {suggestionPrompts.map((prompt, idx) => (
            <TouchableOpacity
              key={idx}
              activeOpacity={0.7}
              onPress={() => handleSend(prompt)}
              style={styles.promptChip}
            >
              <Text style={styles.promptChipText}>✨ {prompt}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Chat Messages Stream */}
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.chatScroll}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <View
              key={msg.id}
              style={[
                styles.messageRow,
                isUser && styles.messageRowUser,
              ]}
            >
              {/* Avatar */}
              <View
                style={[
                  styles.avatar,
                  isUser ? styles.avatarUser : styles.avatarAi,
                ]}
              >
                {isUser ? (
                  <UserIcon size={14} color={colors.white} />
                ) : (
                  <Bot size={14} color={colors.white} />
                )}
              </View>

              {/* Message Bubble */}
              <View
                style={[
                  styles.bubble,
                  isUser ? styles.bubbleUser : styles.bubbleAi,
                ]}
              >
                <Text
                  style={[
                    styles.bubbleText,
                    isUser ? styles.bubbleTextUser : styles.bubbleTextAi,
                  ]}
                >
                  {msg.text}
                </Text>

                {/* Recommendation Card */}
                {msg.recommendation && (
                  <View style={styles.recCard}>
                    <View style={styles.recHeader}>
                      <Text style={styles.recTitle}>{msg.recommendation.title}</Text>
                      <Badge variant="emerald" size="sm">
                        {msg.recommendation.calories} kcal
                      </Badge>
                    </View>

                    <View style={styles.recMacros}>
                      <Text style={styles.recMacro}>P: {msg.recommendation.protein}g</Text>
                      <Text style={styles.recMacro}>C: {msg.recommendation.carbs}g</Text>
                      <Text style={styles.recMacro}>F: {msg.recommendation.fat}g</Text>
                    </View>

                    <View style={styles.recActionRow}>
                      <Button
                        variant="primary"
                        size="xs"
                        leftIcon={<Plus size={12} color={colors.white} />}
                        onPress={() => handleLogRecommendation(msg.recommendation!)}
                      >
                        Log to Diary
                      </Button>
                    </View>
                  </View>
                )}

                <Text
                  style={[
                    styles.timestamp,
                    isUser ? styles.timestampUser : styles.timestampAi,
                  ]}
                >
                  {msg.time}
                </Text>
              </View>
            </View>
          );
        })}

        {isTyping && (
          <View style={styles.typingRow}>
            <Bot size={14} color={colors.brand.primary} />
            <Text style={styles.typingText}>NutriPure AI is formulating response...</Text>
          </View>
        )}
      </ScrollView>

      {/* Chat Input Bar */}
      <View style={styles.inputBar}>
        <TextInput
          value={inputVal}
          onChangeText={setInputVal}
          placeholder="Ask about meal plans, biomarkers..."
          placeholderTextColor={colors.surface[400]}
          style={styles.chatInput}
          onSubmitEditing={() => handleSend()}
        />
        <Button
          variant="primary"
          size="sm"
          disabled={!inputVal.trim()}
          leftIcon={<Send size={14} color={colors.white} />}
          onPress={() => handleSend()}
        >
          Send
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface[50],
  },
  chipsContainer: {
    paddingVertical: spacing[2],
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface[200],
  },
  chipsScroll: {
    paddingHorizontal: spacing[4],
    gap: spacing[2],
  },
  promptChip: {
    backgroundColor: colors.surface[50],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1.5],
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.surface[200],
  },
  promptChipText: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.medium,
    color: colors.surface[700],
  },
  chatScroll: {
    padding: spacing[4],
    gap: spacing[3.5],
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[2.5],
    maxWidth: '88%',
  },
  messageRowUser: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  avatarAi: {
    backgroundColor: colors.brand.primary,
    ...shadows.xs,
  },
  avatarUser: {
    backgroundColor: colors.surface[900],
  },
  bubble: {
    borderRadius: radii['2xl'],
    padding: spacing[3.5],
    gap: spacing[2],
    flex: 1,
  },
  bubbleAi: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.surface[200],
    borderTopLeftRadius: radii.xs,
    ...shadows.xs,
  },
  bubbleUser: {
    backgroundColor: colors.surface[900],
    borderTopRightRadius: radii.xs,
  },
  bubbleText: {
    fontSize: typography.fontSize.xs,
    lineHeight: 18,
  },
  bubbleTextAi: {
    color: colors.surface[900],
    fontFamily: typography.fontFamily.normal,
  },
  bubbleTextUser: {
    color: colors.white,
    fontFamily: typography.fontFamily.normal,
  },
  recCard: {
    backgroundColor: colors.surface[50],
    borderRadius: radii.xl,
    padding: spacing[3],
    borderWidth: 1,
    borderColor: colors.surface[200],
    gap: spacing[1.5],
    marginTop: spacing[1],
  },
  recHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[2],
  },
  recTitle: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface[900],
    flex: 1,
  },
  recMacros: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  recMacro: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.medium,
    color: colors.surface[500],
  },
  recActionRow: {
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: colors.surface[200],
    paddingTop: spacing[2],
    marginTop: spacing[1],
  },
  timestamp: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.medium,
    textAlign: 'right',
  },
  timestampAi: {
    color: colors.surface[400],
  },
  timestampUser: {
    color: colors.surface[400],
  },
  typingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    paddingVertical: spacing[2],
  },
  typingText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.italic,
    color: colors.surface[400],
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[3],
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.surface[200],
    gap: spacing[2],
  },
  chatInput: {
    flex: 1,
    backgroundColor: colors.surface[50],
    borderWidth: 1,
    borderColor: colors.surface[200],
    borderRadius: radii.xl,
    paddingHorizontal: spacing[3.5],
    paddingVertical: spacing[2.5],
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.normal,
    color: colors.surface[900],
  },
});
