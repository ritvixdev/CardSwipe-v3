// Hook for integrating reward system with components
import { useState, useCallback } from 'react';
import { useProgressStore } from '@/store/useProgressStore';
import { rewardSystem } from '@/services/RewardSystem';
import { LearnCard } from '@/data/processors/dataLoader';

export interface UseRewardSystemReturn {
  awardQuizXP: (cardId: string, lesson: LearnCard, onXPAwarded?: (xp: number, description: string) => void) => Promise<number>;
  awardSwipeXP: (cardId: string, action: 'swipe_up' | 'swipe_left' | 'swipe_right', lesson: LearnCard, onXPAwarded?: (xp: number, description: string) => void) => Promise<number>;
  awardCardOpenXP: (cardId: string, lesson: LearnCard, onXPAwarded?: (xp: number, description: string) => void) => Promise<number>;
  getCardProgress: (cardId: string) => {
    completedActions: number;
    totalActions: number;
    totalXpEarned: number;
    isFullyCompleted: boolean;
  };
  getRewardStats: () => {
    totalCardsInteracted: number;
    totalXpFromCards: number;
    averageXpPerCard: number;
    dailyStreak: number;
    todayInteractions: number;
  };
}

export function useRewardSystem(): UseRewardSystemReturn {
  const progressStore = useProgressStore();

  const awardQuizXP = useCallback(async (
    cardId: string,
    lesson: LearnCard,
    onXPAwarded?: (xp: number, description: string) => void
  ): Promise<number> => {
    const xp = await rewardSystem.awardXP(
      cardId,
      'quiz_completed',
      lesson,
      (earnedXP, description, bonuses) => {
        if (earnedXP > 0) {
          progressStore.addXp(earnedXP);
          if (onXPAwarded) {
            const fullDescription = description + (bonuses.length > 0 ? ` (${bonuses.join(', ')})` : '');
            onXPAwarded(earnedXP, fullDescription);
          }
        }
      }
    );
    return xp;
  }, [progressStore]);

  const awardSwipeXP = useCallback(async (
    cardId: string,
    action: 'swipe_up' | 'swipe_left' | 'swipe_right',
    lesson: LearnCard,
    onXPAwarded?: (xp: number, description: string) => void
  ): Promise<number> => {
    const xp = await rewardSystem.awardXP(
      cardId,
      action,
      lesson,
      (earnedXP, description, bonuses) => {
        if (earnedXP > 0) {
          progressStore.addXp(earnedXP);
          if (onXPAwarded) {
            const fullDescription = description + (bonuses.length > 0 ? ` (${bonuses.join(', ')})` : '');
            onXPAwarded(earnedXP, fullDescription);
          }
        }
      }
    );
    return xp;
  }, [progressStore]);

  const awardCardOpenXP = useCallback(async (
    cardId: string,
    lesson: LearnCard,
    onXPAwarded?: (xp: number, description: string) => void
  ): Promise<number> => {
    const xp = await rewardSystem.awardXP(
      cardId,
      'card_opened',
      lesson,
      (earnedXP, description, bonuses) => {
        if (earnedXP > 0) {
          progressStore.addXp(earnedXP);
          if (onXPAwarded) {
            const fullDescription = description + (bonuses.length > 0 ? ` (${bonuses.join(', ')})` : '');
            onXPAwarded(earnedXP, fullDescription);
          }
        }
      }
    );
    return xp;
  }, [progressStore]);

  const getCardProgress = useCallback((cardId: string) => {
    return rewardSystem.getCardCompletionStatus(cardId);
  }, []);

  const getRewardStats = useCallback(() => {
    return rewardSystem.getRewardStats();
  }, []);

  return {
    awardQuizXP,
    awardSwipeXP,
    awardCardOpenXP,
    getCardProgress,
    getRewardStats,
  };
}

// Helper function to be used in lesson detail screens for quiz completion
export async function awardQuizCompletionXP(
  lessonId: string,
  lesson: LearnCard,
  progressStore: ReturnType<typeof useProgressStore>,
  onXPAwarded?: (xp: number, description: string) => void
): Promise<number> {
  const xp = await rewardSystem.awardXP(
    lessonId,
    'quiz_completed',
    lesson,
    (earnedXP, description, bonuses) => {
      if (earnedXP > 0) {
        progressStore.addXp(earnedXP);
        if (onXPAwarded) {
          const fullDescription = description + (bonuses.length > 0 ? ` (${bonuses.join(', ')})` : '');
          onXPAwarded(earnedXP, fullDescription);
        }
      }
    }
  );
  return xp;
}