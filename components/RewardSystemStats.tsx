// Component to display reward system statistics
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { rewardSystem } from '@/services/RewardSystem';
import { Trophy, Target, Zap, TrendingUp, Calendar, Award } from 'lucide-react-native';

interface RewardStatsProps {
  style?: any;
}

export default function RewardSystemStats({ style }: RewardStatsProps) {
  const themeColors = useThemeColors();
  const [stats, setStats] = useState({
    totalCardsInteracted: 0,
    totalXpFromCards: 0,
    averageXpPerCard: 0,
    dailyStreak: 0,
    todayInteractions: 0,
    topActions: [] as Array<{ action: string; count: number }>
  });
  
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      await rewardSystem.initialize();
      const rewardStats = rewardSystem.getRewardStats();
      setStats(rewardStats);
    } catch (error) {
      console.error('Failed to load reward stats:', error);
    }
  };

  const getActionDisplayName = (action: string): string => {
    const actionNames: { [key: string]: string } = {
      'swipe_up': 'Card Navigation',
      'swipe_left': 'Completion Swipe',
      'swipe_right': 'Like Swipe',
      'card_opened': 'Card Details',
      'quiz_completed': 'Quiz Completion'
    };
    return actionNames[action] || action;
  };

  const getActionIcon = (action: string) => {
    const iconProps = { size: 16, color: themeColors.primary };
    switch (action) {
      case 'swipe_up':
        return <TrendingUp {...iconProps} />;
      case 'swipe_left':
        return <Target {...iconProps} />;
      case 'swipe_right':
        return <Award {...iconProps} />;
      case 'card_opened':
        return <Zap {...iconProps} />;
      case 'quiz_completed':
        return <Trophy {...iconProps} />;
      default:
        return <Trophy {...iconProps} />;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.card }, style]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Trophy size={20} color={themeColors.primary} />
          <Text style={[styles.title, { color: themeColors.text }]}>
            Card Interaction Rewards
          </Text>
        </View>
        <TouchableOpacity 
          onPress={() => setShowDetails(!showDetails)}
          style={[styles.toggleButton, { backgroundColor: themeColors.primary + '20' }]}
        >
          <Text style={[styles.toggleText, { color: themeColors.primary }]}>
            {showDetails ? 'Hide' : 'Details'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: themeColors.primary }]}>
            {stats.totalXpFromCards}
          </Text>
          <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
            Card XP
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: themeColors.primary }]}>
            {stats.totalCardsInteracted}
          </Text>
          <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
            Cards
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: themeColors.primary }]}>
            {stats.dailyStreak}
          </Text>
          <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
            Streak
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: themeColors.primary }]}>
            {stats.todayInteractions}
          </Text>
          <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
            Today
          </Text>
        </View>
      </View>

      {/* Detailed Stats */}
      {showDetails && (
        <View style={styles.detailsContainer}>
          <View style={[styles.separator, { backgroundColor: themeColors.border }]} />
          
          {/* Average XP */}
          <View style={styles.detailRow}>
            <View style={styles.detailLabel}>
              <Calendar size={16} color={themeColors.textSecondary} />
              <Text style={[styles.detailText, { color: themeColors.textSecondary }]}>
                Average XP per card
              </Text>
            </View>
            <Text style={[styles.detailValue, { color: themeColors.text }]}>
              {stats.averageXpPerCard.toFixed(1)} XP
            </Text>
          </View>

          {/* Top Actions */}
          {stats.topActions.length > 0 && (
            <View style={styles.actionsContainer}>
              <Text style={[styles.actionsTitle, { color: themeColors.text }]}>
                Most Common Actions
              </Text>
              {stats.topActions.slice(0, 3).map((actionStat, index) => (
                <View key={actionStat.action} style={styles.actionRow}>
                  <View style={styles.actionLabel}>
                    {getActionIcon(actionStat.action)}
                    <Text style={[styles.actionText, { color: themeColors.textSecondary }]}>
                      {getActionDisplayName(actionStat.action)}
                    </Text>
                  </View>
                  <View style={styles.actionCount}>
                    <Text style={[styles.actionCountText, { color: themeColors.text }]}>
                      {actionStat.count}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* XP Breakdown */}
          <View style={styles.xpBreakdown}>
            <Text style={[styles.breakdownTitle, { color: themeColors.text }]}>
              XP Sources
            </Text>
            <View style={styles.breakdownGrid}>
              <View style={styles.breakdownItem}>
                <Text style={[styles.breakdownLabel, { color: themeColors.textSecondary }]}>
                  Swipes
                </Text>
                <Text style={[styles.breakdownValue, { color: themeColors.primary }]}>
                  1 XP
                </Text>
              </View>
              <View style={styles.breakdownItem}>
                <Text style={[styles.breakdownLabel, { color: themeColors.textSecondary }]}>
                  Card Opens
                </Text>
                <Text style={[styles.breakdownValue, { color: themeColors.primary }]}>
                  2 XP
                </Text>
              </View>
              <View style={styles.breakdownItem}>
                <Text style={[styles.breakdownLabel, { color: themeColors.textSecondary }]}>
                  Quiz Complete
                </Text>
                <Text style={[styles.breakdownValue, { color: themeColors.primary }]}>
                  5 XP
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  detailsContainer: {
    marginTop: 16,
  },
  separator: {
    height: 1,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  actionsContainer: {
    marginVertical: 16,
  },
  actionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    fontSize: 13,
  },
  actionCount: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  actionCountText: {
    fontSize: 12,
    fontWeight: '500',
  },
  xpBreakdown: {
    marginTop: 16,
  },
  breakdownTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  breakdownGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  breakdownItem: {
    alignItems: 'center',
  },
  breakdownLabel: {
    fontSize: 11,
    textAlign: 'center',
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
});