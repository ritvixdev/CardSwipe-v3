/**
 * Script to measure the actual character capacity of cards
 * This helps determine the optimal content length for cards
 */

// Card dimensions and typography settings
const CARD_DIMENSIONS = {
  // Screen dimensions (typical mobile)
  screenWidth: 375, // iPhone standard width
  screenHeight: 812, // iPhone standard height
  
  // Card dimensions
  cardWidth: 375 - 32, // width - 32 (margins)
  cardHeight: 812 * 0.8, // 80% of screen height
  cardPadding: 24,
  
  // Content area after header
  headerHeight: 60, // Estimated header height (badge + icons + margins)
  titleHeight: 30, // Estimated title height
  bottomPadding: 20, // Added bottom padding
  
  // Typography
  fontSize: 16,
  lineHeight: 24,
};

// Calculate available content area
function calculateContentArea() {
  const availableHeight = CARD_DIMENSIONS.cardHeight 
    - (CARD_DIMENSIONS.cardPadding * 2) // Top and bottom padding
    - CARD_DIMENSIONS.headerHeight 
    - CARD_DIMENSIONS.titleHeight
    - CARD_DIMENSIONS.bottomPadding;
    
  const availableWidth = CARD_DIMENSIONS.cardWidth - (CARD_DIMENSIONS.cardPadding * 2);
  
  return {
    width: availableWidth,
    height: availableHeight,
    lines: Math.floor(availableHeight / CARD_DIMENSIONS.lineHeight),
    charactersPerLine: Math.floor(availableWidth / (CARD_DIMENSIONS.fontSize * 0.6)), // Rough estimate
  };
}

// Estimate character capacity
function estimateCharacterCapacity() {
  const contentArea = calculateContentArea();
  
  // Account for markdown formatting overhead
  const markdownOverhead = 0.15; // 15% overhead for markdown syntax
  const baseCapacity = contentArea.lines * contentArea.charactersPerLine;
  const adjustedCapacity = Math.floor(baseCapacity * (1 - markdownOverhead));
  
  return {
    contentArea,
    baseCapacity,
    adjustedCapacity,
    recommendedLimit: Math.floor(adjustedCapacity * 0.9), // 90% for safety margin
  };
}

// Test different content lengths
function testContentLengths() {
  const testLengths = [400, 600, 800, 1000, 1200];
  
  console.log('=== Content Length Test Results ===\n');
  
  testLengths.forEach(length => {
    const sampleContent = generateSampleContent(length);
    const displayLength = countDisplayCharacters(sampleContent);
    const estimatedLines = Math.ceil(displayLength / 45); // Rough chars per line
    
    console.log(`Length: ${length} chars`);
    console.log(`  Display chars: ${displayLength}`);
    console.log(`  Estimated lines: ${estimatedLines}`);
    console.log(`  Fits in card: ${estimatedLines <= 20 ? '✅ Yes' : '❌ No (overflow)'}`);
    console.log('  ---');
  });
}

// Generate sample content of specific length
function generateSampleContent(targetLength) {
  const baseContent = `## Sample Heading

### **Key Points**
- First important point with detailed explanation
- Second point with additional context and examples
- Third point with comprehensive information

### **Additional Details**
More content to reach the target length. This includes multiple paragraphs and various formatting elements to simulate real card content.

### **Implementation Notes**
- Technical detail one with explanation
- Technical detail two with context
- Technical detail three with examples`;

  // Repeat and trim to target length
  let content = baseContent;
  while (content.length < targetLength) {
    content += '\n\n' + baseContent;
  }
  
  return content.substring(0, targetLength);
}

// Count display characters (excluding markdown syntax)
function countDisplayCharacters(content) {
  return content
    .replace(/#{1,6}\s/g, '') // Remove headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold syntax
    .replace(/\*(.*?)\*/g, '$1') // Remove italic syntax
    .replace(/`(.*?)`/g, '$1') // Remove inline code syntax
    .replace(/^\s*[-*+]\s/gm, '') // Remove list markers
    .replace(/^\s*\d+\.\s/gm, '') // Remove numbered list markers
    .replace(/\n\s*\n/g, '\n') // Normalize line breaks
    .trim().length;
}

// Main execution
console.log('=== Card Character Capacity Analysis ===\n');

const capacity = estimateCharacterCapacity();

console.log('📐 Card Dimensions:');
console.log(`  Screen: ${CARD_DIMENSIONS.screenWidth}x${CARD_DIMENSIONS.screenHeight}px`);
console.log(`  Card: ${CARD_DIMENSIONS.cardWidth}x${CARD_DIMENSIONS.cardHeight}px`);
console.log(`  Content area: ${capacity.contentArea.width}x${capacity.contentArea.height}px`);
console.log(`  Available lines: ${capacity.contentArea.lines}`);
console.log(`  Chars per line: ~${capacity.contentArea.charactersPerLine}`);

console.log('\n📊 Character Capacity:');
console.log(`  Base capacity: ${capacity.baseCapacity} characters`);
console.log(`  Adjusted for markdown: ${capacity.adjustedCapacity} characters`);
console.log(`  Recommended limit: ${capacity.recommendedLimit} characters`);

console.log('\n🎯 Recommendations:');
console.log(`  ✅ Optimal range: 400-600 characters`);
console.log(`  ⚠️  Maximum safe: ${capacity.recommendedLimit} characters`);
console.log(`  ❌ Avoid exceeding: ${capacity.adjustedCapacity} characters`);

console.log('\n');
testContentLengths();

console.log('\n💡 Implementation Notes:');
console.log('- Current truncation is set to 800 characters');
console.log('- Consider reducing to 600-700 for better UX');
console.log('- Add "Read more" indicator for truncated content');
console.log('- Test on different screen sizes for validation');
