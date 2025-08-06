import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Animated, Dimensions, Alert, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useProgressStore } from '@/store/useProgressStore';
import { getAllLessons } from '@/data/processors/dataLoader';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
// Gamified Progress Page with Achievements and Rewards
import {
  Calendar,
  CheckCircle2,
  Trophy,
  Target,
  Flame,
  Star,
  Award,
  TrendingUp,
  Clock,
  Zap,
  Crown,
  Gift,
  Book
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function ProgressScreen() {
  const {
    progress,
    streak,
    maxStreak,
    xp,
    level,
    achievements,
    weeklyGoal,
    totalTimeSpent,
    quizzesTaken,
    averageQuizScore,
    getLevel,
    getXpForNextLevel,
  } = useProgressStore();

  const themeColors = useThemeColors();
  const insets = useSafeAreaInsets();

  const [selectedTab, setSelectedTab] = useState<'overview' | 'achievements' | 'stats'>('overview');
  const [animatedValue] = useState(new Animated.Value(0));
  const [lessons, setLessons] = useState<any[]>([]);

  // Load lessons on component mount
  useEffect(() => {
    const loadLessons = async () => {
      try {
        const allLessons = await getAllLessons();
        setLessons(allLessons);
      } catch (error) {
        console.error('Failed to load lessons:', error);
        setLessons([]);
      }
    };
    loadLessons();
  }, []);

  // Calculate stats
  const completedCount = Object.values(progress).filter(p => p.completed).length;
  const totalLessons = lessons.length;
  const completionPercentage = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;
  const currentLevel = getLevel();
  const xpForNextLevel = getXpForNextLevel();
  const xpProgress = ((xp % 100) / 100) * 100; // Progress within current level

  // Recent achievements (last 3)
  const recentAchievements = achievements
    .sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime())
    .slice(0, 3);

  // Weekly goal progress
  const weeklyLessonsProgress = weeklyGoal.lessonsTarget > 0 ? (weeklyGoal.currentLessons / weeklyGoal.lessonsTarget) * 100 : 0;
  const weeklyXpProgress = weeklyGoal.xpTarget > 0 ? (weeklyGoal.currentXp / weeklyGoal.xpTarget) * 100 : 0;

  // Format time spent
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  // Generate calendar data (last 12 weeks)
  const generateCalendarData = () => {
    const weeks = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 83); // 12 weeks back

    for (let week = 0; week < 12; week++) {
      const weekData = [];
      for (let day = 0; day < 7; day++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + (week * 7) + day);

        const dateString = currentDate.toISOString().split('T')[0];
        const hasActivity = Object.values(progress).some(p =>
          p.completedAt && p.completedAt.split('T')[0] === dateString
        );

        weekData.push({
          date: currentDate,
          hasActivity,
          isToday: dateString === today.toISOString().split('T')[0],
          isFuture: currentDate > today,
        });
      }
      weeks.push(weekData);
    }
    return weeks;
  };

  const calendarData = generateCalendarData();

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, []);

  // Handler functions
  const handleStartLearning = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // Find the next incomplete lesson
    const nextLesson = lessons.find(lesson => !progress[lesson.id]?.completed);

    if (nextLesson) {
      router.push(`/lesson/${nextLesson.id}`);
    } else {
      Alert.alert(
        "🎉 Congratulations!",
        "You've completed all lessons! Try taking a quiz to test your knowledge.",
        [
          { text: "Take Quiz", onPress: () => router.push('/explore/practice-quiz') },
          { text: "OK", style: "cancel" }
        ]
      );
    }
  };

  const handleTakeQuiz = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push('/explore/practice-quiz');
  };

  const handleViewAchievements = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    if (achievements.length === 0) {
      Alert.alert(
        "🎁 No Achievements Yet",
        "Complete lessons and maintain streaks to unlock achievements!",
        [{ text: "Start Learning", onPress: handleStartLearning }]
      );
    } else {
      const achievementList = achievements
        .map(a => `${a.icon} ${a.title}`)
        .join('\n');

      Alert.alert(
        "🏆 Your Achievements",
        `You've unlocked ${achievements.length} achievements:\n\n${achievementList}`,
        [{ text: "Amazing!", style: "default" }]
      );
    }
  };

  const handleMotivationTap = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const motivationalMessages = [
      "🔥 You're doing amazing! Keep the momentum going!",
      "💪 Every lesson brings you closer to mastery!",
      "🚀 Your consistency is building something incredible!",
      "⭐ Small daily progress leads to big results!",
      "🎯 You're on the path to becoming a JavaScript expert!"
    ];

    const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
    Alert.alert("Daily Motivation", randomMessage);
  };
  


  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]} testID="progress-screen">
      {/* Header with Level and XP */}
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.header, { backgroundColor: themeColors.background }]}>
          <View style={styles.headerContent}>
            <View style={styles.levelSection}>
              <View style={[styles.levelBadge, { backgroundColor: themeColors.primary }]}>
                <Crown size={16} color="#ffffff" />
                <Text style={styles.levelText}>Level {currentLevel}</Text>
              </View>
              <Text style={[styles.xpText, { color: themeColors.textSecondary }]}>
                {xp} XP • {xpForNextLevel} to next level
              </Text>
            </View>

            <View style={styles.streakSection}>
              <View style={styles.streakBadge}>
                <Flame size={16} color="#ff6b35" />
                <Text style={[styles.streakText, { color: themeColors.text }]}>{streak}</Text>
              </View>
            </View>
          </View>

          {/* XP Progress Bar */}
          <View style={[styles.xpProgressContainer, { backgroundColor: themeColors.border }]}>
            <Animated.View
              style={[
                styles.xpProgressFill,
                {
                  backgroundColor: themeColors.primary,
                  width: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', `${xpProgress}%`],
                  }),
                }
              ]}
            />
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={[styles.tabContainer, { backgroundColor: themeColors.card }]}>
          {[
            { key: 'overview', label: 'Overview', icon: TrendingUp },
            { key: 'achievements', label: 'Achievements', icon: Trophy },
            { key: 'stats', label: 'Stats', icon: Target },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tab,
                selectedTab === tab.key && { backgroundColor: themeColors.primary + '20' }
              ]}
              onPress={() => setSelectedTab(tab.key as any)}
            >
              <tab.icon
                size={18}
                color={selectedTab === tab.key ? themeColors.primary : themeColors.textSecondary}
              />
              <Text style={[
                styles.tabText,
                { color: selectedTab === tab.key ? themeColors.primary : themeColors.textSecondary }
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {selectedTab === 'overview' && (
          <>
            {/* Daily Motivation Hero */}
            <TouchableOpacity
              style={[styles.motivationCard, { backgroundColor: themeColors.primary }]}
              onPress={handleMotivationTap}
              activeOpacity={0.9}
            >
              <View style={styles.motivationContent}>
                <View style={styles.motivationLeft}>
                  <Text style={styles.motivationGreeting}>
                    {streak > 0 ? `🔥 ${streak} Day Streak!` : '👋 Ready to Learn?'}
                  </Text>
                  <Text style={styles.motivationMessage}>
                    {streak >= 7 ? "You're on fire! Keep it up!" :
                     streak >= 3 ? "Great consistency! Don't break the chain!" :
                     streak > 0 ? "Building momentum! One more day!" :
                     "Start your learning journey today!"}
                  </Text>
                  <TouchableOpacity
                    style={styles.todayGoal}
                    onPress={handleStartLearning}
                  >
                    <Target size={16} color="#ffffff" />
                    <Text style={styles.todayGoalText}>
                      Today's Goal: {weeklyGoal.currentLessons < weeklyGoal.lessonsTarget ? 'Complete 1 lesson' : 'Goal achieved! 🎉'}
                    </Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.motivationRight}
                  onPress={handleMotivationTap}
                >
                  <View style={styles.streakCircle}>
                    <Flame size={28} color="#ffffff" />
                    <Text style={styles.streakNumber}>{streak}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>

            {/* Today's Focus */}
            <View style={[styles.focusCard, { backgroundColor: themeColors.card }]}>
              <View style={styles.focusHeader}>
                <Calendar size={20} color={themeColors.primary} />
                <Text style={[styles.focusTitle, { color: themeColors.text }]}>Today's Focus</Text>
                <Text style={[styles.focusDate, { color: themeColors.textSecondary }]}>
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </Text>
              </View>

              <View style={styles.focusContent}>
                <View style={styles.focusItem}>
                  <View style={[styles.focusIcon, { backgroundColor: '#10b981' + '20' }]}>
                    <Book size={18} color="#10b981" />
                  </View>
                  <View style={styles.focusText}>
                    <Text style={[styles.focusItemTitle, { color: themeColors.text }]}>
                      Continue Learning
                    </Text>
                    <Text style={[styles.focusItemDesc, { color: themeColors.textSecondary }]}>
                      {completedCount < totalLessons ? `${totalLessons - completedCount} lessons remaining` : 'All lessons completed! 🎉'}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.focusButton, { backgroundColor: themeColors.primary }]}
                    onPress={handleStartLearning}
                  >
                    <Text style={styles.focusButtonText}>Start</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.focusItem}>
                  <View style={[styles.focusIcon, { backgroundColor: '#8b5cf6' + '20' }]}>
                    <Zap size={18} color="#8b5cf6" />
                  </View>
                  <View style={styles.focusText}>
                    <Text style={[styles.focusItemTitle, { color: themeColors.text }]}>
                      Practice Quiz
                    </Text>
                    <Text style={[styles.focusItemDesc, { color: themeColors.textSecondary }]}>
                      Test your knowledge
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.focusButton, { backgroundColor: '#8b5cf6' }]}
                    onPress={handleTakeQuiz}
                  >
                    <Text style={styles.focusButtonText}>Quiz</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Activity Calendar */}
            <TouchableOpacity
              style={[styles.calendarCard, { backgroundColor: themeColors.card }]}
              onPress={() => {
                if (Platform.OS !== 'web') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                Alert.alert(
                  "📅 Learning Activity",
                  `You've been learning for ${Math.max(streak, 1)} days!\n\nTotal lessons completed: ${completedCount}\nBest streak: ${maxStreak} days\n\nKeep up the great work!`
                );
              }}
              activeOpacity={0.9}
            >
              <View style={styles.calendarHeader}>
                <View style={styles.calendarHeaderLeft}>
                  <Calendar size={20} color={themeColors.primary} />
                  <Text style={[styles.calendarTitle, { color: themeColors.text }]}>Learning Activity</Text>
                </View>
                <Text style={[styles.calendarSubtitle, { color: themeColors.textSecondary }]}>
                  Last 12 weeks
                </Text>
              </View>

              <View style={styles.calendarMainContainer}>
                <View style={styles.calendarGridContainer}>
                  <View style={styles.calendarGrid}>
                    {calendarData?.map((week, weekIndex) => (
                      <View key={weekIndex} style={styles.calendarWeek}>
                        {week?.map((day, dayIndex) => (
                          <View
                            key={`${weekIndex}-${dayIndex}`}
                            style={[
                              styles.calendarDay,
                              {
                                backgroundColor: day.isFuture
                                  ? themeColors.border + '30'
                                  : day.hasActivity
                                    ? themeColors.primary
                                    : themeColors.border + '60',
                              },
                              day.isToday && {
                                borderColor: '#fbbf24',
                                borderWidth: 2,
                                backgroundColor: day.hasActivity ? themeColors.primary : '#fbbf24' + '40'
                              }
                            ]}
                          />
                        ))}
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.calendarFooter}>
                  <View style={styles.calendarStats}>
                    <View style={styles.calendarStat}>
                      <Text style={[styles.calendarStatValue, { color: themeColors.text }]}>
                        {Object.values(progress).filter(p => p.completed).length}
                      </Text>
                      <Text style={[styles.calendarStatLabel, { color: themeColors.textSecondary }]}>
                        Total lessons
                      </Text>
                    </View>
                    <View style={styles.calendarStat}>
                      <Text style={[styles.calendarStatValue, { color: themeColors.text }]}>
                        {streak}
                      </Text>
                      <Text style={[styles.calendarStatLabel, { color: themeColors.textSecondary }]}>
                        Current streak
                      </Text>
                    </View>
                    <View style={styles.calendarStat}>
                      <Text style={[styles.calendarStatValue, { color: themeColors.text }]}>
                        {maxStreak}
                      </Text>
                      <Text style={[styles.calendarStatLabel, { color: themeColors.textSecondary }]}>
                        Best streak
                      </Text>
                    </View>
                  </View>

                  <View style={styles.calendarLegend}>
                    <Text style={[styles.legendText, { color: themeColors.textSecondary }]}>Less</Text>
                    <View style={styles.legendDots}>
                      <View style={[styles.legendDot, { backgroundColor: themeColors.border + '60' }]} />
                      <View style={[styles.legendDot, { backgroundColor: themeColors.primary + '40' }]} />
                      <View style={[styles.legendDot, { backgroundColor: themeColors.primary + '70' }]} />
                      <View style={[styles.legendDot, { backgroundColor: themeColors.primary }]} />
                    </View>
                    <Text style={[styles.legendText, { color: themeColors.textSecondary }]}>More</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>

            {/* Weekly Goals */}
            <View style={[styles.card, { backgroundColor: themeColors.card }]}>
              <View style={styles.cardHeader}>
                <Target size={20} color={themeColors.primary} />
                <Text style={[styles.cardTitle, { color: themeColors.text }]}>Weekly Goals</Text>
                <View style={[styles.goalBadge, { backgroundColor: weeklyLessonsProgress >= 100 ? '#10b981' : themeColors.primary }]}>
                  <Text style={styles.goalBadgeText}>
                    {Math.round(Math.max(weeklyLessonsProgress, weeklyXpProgress))}%
                  </Text>
                </View>
              </View>

              <View style={styles.goalContainer}>
                <View style={styles.goalItem}>
                  <View style={styles.goalHeader}>
                    <Text style={[styles.goalLabel, { color: themeColors.text }]}>
                      📚 Lessons
                    </Text>
                    <Text style={[styles.goalValue, { color: themeColors.text }]}>
                      {weeklyGoal.currentLessons}/{weeklyGoal.lessonsTarget}
                    </Text>
                  </View>
                  <View style={[styles.goalProgress, { backgroundColor: themeColors.border }]}>
                    <Animated.View
                      style={[
                        styles.goalProgressFill,
                        {
                          backgroundColor: '#10b981',
                          width: animatedValue.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0%', `${Math.min(weeklyLessonsProgress, 100)}%`],
                          }),
                        }
                      ]}
                    />
                  </View>
                </View>

                <View style={styles.goalItem}>
                  <View style={styles.goalHeader}>
                    <Text style={[styles.goalLabel, { color: themeColors.text }]}>
                      ⚡ Experience Points
                    </Text>
                    <Text style={[styles.goalValue, { color: themeColors.text }]}>
                      {weeklyGoal.currentXp}/{weeklyGoal.xpTarget}
                    </Text>
                  </View>
                  <View style={[styles.goalProgress, { backgroundColor: themeColors.border }]}>
                    <Animated.View
                      style={[
                        styles.goalProgressFill,
                        {
                          backgroundColor: themeColors.primary,
                          width: animatedValue.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0%', `${Math.min(weeklyXpProgress, 100)}%`],
                          }),
                        }
                      ]}
                    />
                  </View>
                </View>
              </View>
            </View>

            {/* Streak Momentum */}
            <View style={[styles.momentumCard, { backgroundColor: themeColors.card }]}>
              <View style={styles.momentumHeader}>
                <TrendingUp size={20} color="#10b981" />
                <Text style={[styles.momentumTitle, { color: themeColors.text }]}>Learning Momentum</Text>
                <View style={[styles.momentumBadge, { backgroundColor: streak >= 7 ? '#10b981' : streak >= 3 ? '#fbbf24' : '#ef4444' }]}>
                  <Text style={styles.momentumBadgeText}>
                    {streak >= 7 ? '🔥 Hot' : streak >= 3 ? '⚡ Good' : '🌱 Building'}
                  </Text>
                </View>
              </View>

              <View style={styles.momentumGrid}>
                <View style={styles.momentumStat}>
                  <Text style={[styles.momentumNumber, { color: themeColors.text }]}>{streak}</Text>
                  <Text style={[styles.momentumLabel, { color: themeColors.textSecondary }]}>Current</Text>
                  <View style={[styles.momentumBar, { backgroundColor: themeColors.border }]}>
                    <View
                      style={[
                        styles.momentumBarFill,
                        {
                          backgroundColor: '#ff6b35',
                          width: `${Math.min((streak / Math.max(maxStreak, 7)) * 100, 100)}%`
                        }
                      ]}
                    />
                  </View>
                </View>

                <View style={styles.momentumStat}>
                  <Text style={[styles.momentumNumber, { color: themeColors.text }]}>{maxStreak}</Text>
                  <Text style={[styles.momentumLabel, { color: themeColors.textSecondary }]}>Best Ever</Text>
                  <View style={[styles.momentumBar, { backgroundColor: themeColors.border }]}>
                    <View
                      style={[
                        styles.momentumBarFill,
                        {
                          backgroundColor: '#fbbf24',
                          width: '100%'
                        }
                      ]}
                    />
                  </View>
                </View>

                <View style={styles.momentumStat}>
                  <Text style={[styles.momentumNumber, { color: themeColors.text }]}>{weeklyGoal.currentLessons}</Text>
                  <Text style={[styles.momentumLabel, { color: themeColors.textSecondary }]}>This Week</Text>
                  <View style={[styles.momentumBar, { backgroundColor: themeColors.border }]}>
                    <View
                      style={[
                        styles.momentumBarFill,
                        {
                          backgroundColor: '#10b981',
                          width: `${Math.min((weeklyGoal.currentLessons / weeklyGoal.lessonsTarget) * 100, 100)}%`
                        }
                      ]}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.nextMilestone}>
                <Text style={[styles.milestoneLabel, { color: themeColors.textSecondary }]}>Next Milestone:</Text>
                <Text style={[styles.milestoneText, { color: themeColors.text }]}>
                  {streak < 3 ? '3-day streak 🎯' :
                   streak < 7 ? '7-day streak 🔥' :
                   streak < 30 ? '30-day streak 👑' :
                   'Streak Master! 🏆'}
                </Text>
              </View>
            </View>

            {/* Recent Achievements */}
            {recentAchievements.length > 0 && (
              <View style={[styles.card, { backgroundColor: themeColors.card }]}>
                <View style={styles.cardHeader}>
                  <Trophy size={20} color="#fbbf24" />
                  <Text style={[styles.cardTitle, { color: themeColors.text }]}>Recent Achievements</Text>
                </View>

                <View style={styles.achievementsList}>
                  {recentAchievements?.map((achievement) => (
                    <View key={achievement.id} style={styles.achievementItem}>
                      <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                      <View style={styles.achievementContent}>
                        <Text style={[styles.achievementTitle, { color: themeColors.text }]}>
                          {achievement.title}
                        </Text>
                        <Text style={[styles.achievementDesc, { color: themeColors.textSecondary }]}>
                          {achievement.description}
                        </Text>
                      </View>
                      <View style={[styles.xpBadge, { backgroundColor: themeColors.primary + '20' }]}>
                        <Text style={[styles.xpBadgeText, { color: themeColors.primary }]}>
                          +{achievement.xpReward} XP
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Overall Progress */}
            <View style={[styles.card, { backgroundColor: themeColors.card }]}>
              <View style={styles.cardHeader}>
                <TrendingUp size={20} color={themeColors.primary} />
                <Text style={[styles.cardTitle, { color: themeColors.text }]}>Learning Progress</Text>
              </View>

              <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                  <Text style={[styles.progressPercentage, { color: themeColors.text }]}>
                    {Math.round(completionPercentage)}%
                  </Text>
                  <Text style={[styles.progressSubtext, { color: themeColors.textSecondary }]}>
                    {completedCount} of {totalLessons} lessons
                  </Text>
                </View>

                <View style={[styles.progressBar, { backgroundColor: themeColors.border }]}>
                  <Animated.View
                    style={[
                      styles.progressBarFill,
                      {
                        backgroundColor: themeColors.primary,
                        width: animatedValue.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0%', `${completionPercentage}%`],
                        }),
                      }
                    ]}
                  />
                </View>
              </View>
            </View>
          </>
        )}

        {selectedTab === 'achievements' && (
          <View style={[styles.card, { backgroundColor: themeColors.card }]}>
            <View style={styles.cardHeader}>
              <Trophy size={20} color="#fbbf24" />
              <Text style={[styles.cardTitle, { color: themeColors.text }]}>All Achievements</Text>
              <Text style={[styles.cardSubtitle, { color: themeColors.textSecondary }]}>
                {achievements.length} unlocked
              </Text>
            </View>

            {achievements.length > 0 ? (
              <View style={styles.achievementsList}>
                {achievements?.map((achievement) => (
                  <View key={achievement.id} style={styles.achievementItem}>
                    <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                    <View style={styles.achievementContent}>
                      <Text style={[styles.achievementTitle, { color: themeColors.text }]}>
                        {achievement.title}
                      </Text>
                      <Text style={[styles.achievementDesc, { color: themeColors.textSecondary }]}>
                        {achievement.description}
                      </Text>
                      <Text style={[styles.achievementDate, { color: themeColors.textSecondary }]}>
                        Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </Text>
                    </View>
                    <View style={[styles.xpBadge, { backgroundColor: themeColors.primary + '20' }]}>
                      <Text style={[styles.xpBadgeText, { color: themeColors.primary }]}>
                        +{achievement.xpReward} XP
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyAchievements}>
                <Gift size={48} color={themeColors.textSecondary} />
                <Text style={[styles.emptyTitle, { color: themeColors.text }]}>No Achievements Yet</Text>
                <Text style={[styles.emptyDesc, { color: themeColors.textSecondary }]}>
                  Complete lessons and maintain streaks to unlock achievements!
                </Text>
              </View>
            )}
          </View>
        )}

        {selectedTab === 'stats' && (
          <>
            {/* Detailed Stats */}
            <View style={[styles.card, { backgroundColor: themeColors.card }]}>
              <View style={styles.cardHeader}>
                <Target size={20} color={themeColors.primary} />
                <Text style={[styles.cardTitle, { color: themeColors.text }]}>Detailed Statistics</Text>
              </View>

              <View style={styles.detailedStats}>
                <View style={styles.statRow}>
                  <Text style={[styles.statRowLabel, { color: themeColors.textSecondary }]}>Total XP Earned</Text>
                  <Text style={[styles.statRowValue, { color: themeColors.text }]}>{xp}</Text>
                </View>

                <View style={styles.statRow}>
                  <Text style={[styles.statRowLabel, { color: themeColors.textSecondary }]}>Current Level</Text>
                  <Text style={[styles.statRowValue, { color: themeColors.text }]}>Level {currentLevel}</Text>
                </View>

                <View style={styles.statRow}>
                  <Text style={[styles.statRowLabel, { color: themeColors.textSecondary }]}>Current Streak</Text>
                  <Text style={[styles.statRowValue, { color: themeColors.text }]}>{streak} days</Text>
                </View>

                <View style={styles.statRow}>
                  <Text style={[styles.statRowLabel, { color: themeColors.textSecondary }]}>Best Streak</Text>
                  <Text style={[styles.statRowValue, { color: themeColors.text }]}>{maxStreak} days</Text>
                </View>

                <View style={styles.statRow}>
                  <Text style={[styles.statRowLabel, { color: themeColors.textSecondary }]}>Total Time Spent</Text>
                  <Text style={[styles.statRowValue, { color: themeColors.text }]}>{formatTime(totalTimeSpent)}</Text>
                </View>

                <View style={styles.statRow}>
                  <Text style={[styles.statRowLabel, { color: themeColors.textSecondary }]}>Quizzes Taken</Text>
                  <Text style={[styles.statRowValue, { color: themeColors.text }]}>{quizzesTaken}</Text>
                </View>

                <View style={styles.statRow}>
                  <Text style={[styles.statRowLabel, { color: themeColors.textSecondary }]}>Average Quiz Score</Text>
                  <Text style={[styles.statRowValue, { color: themeColors.text }]}>{Math.round(averageQuizScore)}%</Text>
                </View>

                <View style={styles.statRow}>
                  <Text style={[styles.statRowLabel, { color: themeColors.textSecondary }]}>Achievements Unlocked</Text>
                  <Text style={[styles.statRowValue, { color: themeColors.text }]}>{achievements.length}</Text>
                </View>
              </View>
            </View>

            {/* Learning Insights */}
            <View style={[styles.card, { backgroundColor: themeColors.card }]}>
              <View style={styles.cardHeader}>
                <Star size={20} color="#fbbf24" />
                <Text style={[styles.cardTitle, { color: themeColors.text }]}>Learning Insights</Text>
              </View>

              <View style={styles.insightsList}>
                {completedCount > 0 && (
                  <View style={styles.insightItem}>
                    <Text style={[styles.insightText, { color: themeColors.text }]}>
                      🎯 You've completed {Math.round(completionPercentage)}% of all lessons!
                    </Text>
                  </View>
                )}

                {streak > 0 && (
                  <View style={styles.insightItem}>
                    <Text style={[styles.insightText, { color: themeColors.text }]}>
                      🔥 You're on a {streak}-day learning streak!
                    </Text>
                  </View>
                )}

                {totalTimeSpent > 3600 && (
                  <View style={styles.insightItem}>
                    <Text style={[styles.insightText, { color: themeColors.text }]}>
                      ⏰ You've spent over {Math.floor(totalTimeSpent / 3600)} hours learning!
                    </Text>
                  </View>
                )}

                {averageQuizScore >= 80 && quizzesTaken > 0 && (
                  <View style={styles.insightItem}>
                    <Text style={[styles.insightText, { color: themeColors.text }]}>
                      🧠 Your quiz average is {Math.round(averageQuizScore)}% - excellent work!
                    </Text>
                  </View>
                )}

                {achievements.length === 0 && (
                  <View style={styles.insightItem}>
                    <Text style={[styles.insightText, { color: themeColors.text }]}>
                      🎁 Complete your first lesson to unlock your first achievement!
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    backgroundColor: 'transparent',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  levelSection: {
    flex: 1,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  levelText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  xpText: {
    fontSize: 12,
  },
  streakSection: {
    alignItems: 'flex-end',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    borderRadius: 20,
  },
  streakText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  xpProgressContainer: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  xpProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginHorizontal: 2,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  motivationCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  motivationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  motivationLeft: {
    flex: 1,
  },
  motivationGreeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  motivationMessage: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
    lineHeight: 20,
  },
  todayGoal: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  todayGoalText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  motivationRight: {
    marginLeft: 20,
  },
  streakCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  streakNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 4,
  },
  focusCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  focusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  focusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    flex: 1,
  },
  focusDate: {
    fontSize: 12,
  },
  focusContent: {
    gap: 12,
  },
  focusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  focusIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  focusText: {
    flex: 1,
  },
  focusItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  focusItemDesc: {
    fontSize: 13,
  },
  focusButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  focusButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    flex: 1,
  },
  cardSubtitle: {
    fontSize: 12,
    marginLeft: 'auto',
  },
  calendarCard: {
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  calendarHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  calendarSubtitle: {
    fontSize: 12,
  },
  calendarMainContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  calendarGridContainer: {
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  calendarGrid: {
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
  },
  calendarWeek: {
    gap: 4,
  },
  calendarDay: {
    width: 16,
    height: 16,
    borderRadius: 3,
  },
  calendarFooter: {
    gap: 16,
  },
  calendarStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 12,
  },
  calendarStat: {
    alignItems: 'center',
  },
  calendarStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  calendarStatLabel: {
    fontSize: 11,
    marginTop: 2,
    textAlign: 'center',
  },
  calendarLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  legendText: {
    fontSize: 11,
    fontWeight: '500',
  },
  legendDots: {
    flexDirection: 'row',
    gap: 3,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
  goalBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  goalBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  goalContainer: {
    gap: 20,
  },
  goalItem: {
    gap: 12,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  goalValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  goalProgress: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  goalProgressFill: {
    height: '100%',
    borderRadius: 5,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    minWidth: (width - 64) / 2,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },
  statCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakBadgeSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakBadgeText: {
    fontSize: 10,
  },
  timeBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeBadgeText: {
    fontSize: 10,
  },
  perfectBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  perfectBadgeText: {
    fontSize: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
  },
  statSubtext: {
    fontSize: 11,
    marginTop: 4,
  },
  statProgress: {
    height: 4,
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  statProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  achievementsList: {
    gap: 16,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  achievementIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  achievementDesc: {
    fontSize: 14,
    lineHeight: 20,
  },
  achievementDate: {
    fontSize: 12,
    marginTop: 4,
  },
  xpBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  xpBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressContainer: {
    gap: 12,
  },
  progressHeader: {
    alignItems: 'center',
  },
  progressPercentage: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  progressSubtext: {
    fontSize: 14,
    marginTop: 4,
  },
  progressBar: {
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  emptyAchievements: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  detailedStats: {
    gap: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statRowLabel: {
    fontSize: 14,
    flex: 1,
  },
  statRowValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  insightsList: {
    gap: 12,
  },
  insightItem: {
    paddingVertical: 8,
  },
  insightText: {
    fontSize: 14,
    lineHeight: 20,
  },
  momentumCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  momentumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  momentumTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    flex: 1,
  },
  momentumBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  momentumBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  momentumGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  momentumStat: {
    flex: 1,
    alignItems: 'center',
  },
  momentumNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  momentumLabel: {
    fontSize: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  momentumBar: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  momentumBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  nextMilestone: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.02)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  milestoneLabel: {
    fontSize: 14,
  },
  milestoneText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});