import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, CheckCircle, Circle, ArrowDown, Code, Database, Globe } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { getLearningRoadmap, LearningRoadmap } from '@/data/processors/dataLoader';

const { width } = Dimensions.get('window');

export default function LearningRoadmapScreen() {
  const themeColors = useThemeColors();
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [nodes, setNodes] = useState<any[]>([]);

  useEffect(() => {
    const loadRoadmap = async () => {
      try {
        const data = await getLearningRoadmap();
        setNodes(data.nodes || []);
      } catch (error) {
        console.error('Failed to load learning roadmap:', error);
        setNodes([]);
      }
    };
    loadRoadmap();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'in-progress': return '#f59e0b';
      case 'locked': return themeColors.textSecondary;
      default: return themeColors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in-progress': return Circle;
      case 'locked': return Circle;
      default: return Circle;
    }
  };

  const getNodeIcon = (iconType: string) => {
    switch (iconType) {
      case 'code': return Code;
      case 'globe': return Globe;
      case 'database': return Database;
      default: return Code;
    }
  };

  const RoadmapNode = ({ node, index }: { node: any; index: number }) => {
    const StatusIcon = getStatusIcon(node.status);
    const NodeIcon = getNodeIcon(node.icon || 'code');
    const isSelected = selectedNode === node.id;
    const isEven = index % 2 === 0;

    return (
      <View style={styles.nodeContainer}>
        {/* Connection Line */}
        {index > 0 && (
          <View style={[styles.connectionLine, { backgroundColor: themeColors.border }]} />
        )}
        
        {/* Node */}
        <View style={[styles.nodeWrapper, { alignItems: isEven ? 'flex-start' : 'flex-end' }]}>
          <TouchableOpacity
            style={[
              styles.node,
              { 
                backgroundColor: themeColors.card,
                borderColor: getStatusColor(node.status),
                borderWidth: isSelected ? 3 : 2,
                marginLeft: isEven ? 0 : 40,
                marginRight: isEven ? 40 : 0,
              }
            ]}
            onPress={() => setSelectedNode(isSelected ? null : node.id)}
          >
            <View style={styles.nodeHeader}>
              <View style={[styles.nodeIconContainer, { backgroundColor: getStatusColor(node.status) }]}>
                <NodeIcon size={20} color="#ffffff" />
              </View>
              <View style={styles.nodeStatus}>
                <StatusIcon size={16} color={getStatusColor(node.status)} />
              </View>
            </View>
            
            <Text style={[styles.nodeTitle, { color: themeColors.text }]}>
              {node.title}
            </Text>
            
            <Text style={[styles.nodeDescription, { color: themeColors.textSecondary }]}>
              {node.description}
            </Text>
            
            <Text style={[styles.nodeTime, { color: getStatusColor(node.status) }]}>
              {node.estimatedTime}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Expanded Details */}
        {isSelected && (
          <View style={[styles.nodeDetails, { backgroundColor: themeColors.background }]}>
            <Text style={[styles.detailsTitle, { color: themeColors.text }]}>
              Topics Covered:
            </Text>
            <View style={styles.topicsList}>
              {node.topics?.map((topic: string, topicIndex: number) => (
                <View key={topicIndex} style={[styles.topicItem, { backgroundColor: themeColors.card }]}>
                  <Text style={[styles.topicText, { color: themeColors.text }]}>
                    {topic}
                  </Text>
                </View>
              ))}
            </View>
            
            <View style={styles.detailsActions}>
              <TouchableOpacity
                style={[
                  styles.startButton,
                  { 
                    backgroundColor: node.status === 'locked' ? themeColors.textSecondary : themeColors.primary,
                    opacity: node.status === 'locked' ? 0.5 : 1
                  }
                ]}
                disabled={node.status === 'locked'}
              >
                <Text style={styles.startButtonText}>
                  {node.status === 'completed' ? 'Review' : 
                   node.status === 'in-progress' ? 'Continue' : 
                   node.status === 'locked' ? 'Locked' : 'Start'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Arrow to next node */}
        {index < nodes.length - 1 && (
          <View style={styles.arrowContainer}>
            <ArrowDown size={24} color={themeColors.textSecondary} />
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back button and title in scrollable content */}
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.headerRow}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color={themeColors.text} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: themeColors.text }]}>Learning Roadmap</Text>
          </View>
        </SafeAreaView>
        
        <View style={styles.pageHeader}>
          <Text style={[styles.summary, { color: themeColors.textSecondary }]}>
            Your path to JavaScript mastery
          </Text>
        </View>

        {/* Progress Overview */}
        <View style={[styles.progressOverview, { backgroundColor: themeColors.card }]}>
          <Text style={[styles.progressTitle, { color: themeColors.text }]}>Your Progress</Text>
          <View style={styles.progressStats}>
            <View style={styles.progressStat}>
              <Text style={[styles.progressNumber, { color: '#10b981' }]}>{nodes.filter(n => n.status === 'completed').length}</Text>
              <Text style={[styles.progressLabel, { color: themeColors.textSecondary }]}>Completed</Text>
            </View>
            <View style={styles.progressStat}>
              <Text style={[styles.progressNumber, { color: '#f59e0b' }]}>{nodes.filter(n => n.status === 'current' || n.status === 'in-progress').length}</Text>
              <Text style={[styles.progressLabel, { color: themeColors.textSecondary }]}>In Progress</Text>
            </View>
            <View style={styles.progressStat}>
              <Text style={[styles.progressNumber, { color: themeColors.textSecondary }]}>{nodes.filter(n => n.status === 'locked').length}</Text>
              <Text style={[styles.progressLabel, { color: themeColors.textSecondary }]}>Remaining</Text>
            </View>
          </View>
        </View>

        {/* Roadmap */}
        <View style={styles.roadmapContainer}>
          {nodes.map((node, index) => (
            <RoadmapNode key={node.id} node={node} index={index} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 20,
    marginLeft: -4,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  pageHeader: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  summary: {
    fontSize: 16,
    lineHeight: 24,
  },
  progressOverview: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  progressStat: {
    alignItems: 'center',
  },
  progressNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  progressLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  roadmapContainer: {
    paddingHorizontal: 20,
  },
  nodeContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  connectionLine: {
    position: 'absolute',
    left: '50%',
    top: -20,
    width: 2,
    height: 40,
    marginLeft: -1,
  },
  nodeWrapper: {
    width: '100%',
  },
  node: {
    width: width - 120,
    padding: 16,
    borderRadius: 16,
    gap: 8,
  },
  nodeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nodeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nodeStatus: {
    // Status icon positioning
  },
  nodeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  nodeDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  nodeTime: {
    fontSize: 12,
    fontWeight: '600',
  },
  nodeDetails: {
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  topicsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  topicItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  topicText: {
    fontSize: 12,
    fontWeight: '500',
  },
  detailsActions: {
    alignItems: 'center',
  },
  startButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  arrowContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
});
