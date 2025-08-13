# 🚀 SwipeLearn JS - Master JavaScript with Tinder-Style Learning

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Expo SDK](https://img.shields.io/badge/Expo%20SDK-53.0.0-blue.svg)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.79.1-green.svg)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)

> **Transform your JavaScript learning journey with our revolutionary Tinder-style swipe interface!**

SwipeLearn JS is an innovative mobile application that makes learning JavaScript addictive and fun. Swipe through interactive lessons, take engaging quizzes, and track your progress with a gamified experience that keeps you motivated.

## ✨ Features

### 🎯 **Core Learning Experience**
- **Tinder-Style Interface**: Intuitive swipe gestures for seamless navigation
- **30-Day Curriculum**: Structured learning path from basics to advanced concepts
- **Interactive Quizzes**: Hands-on coding challenges with instant feedback
- **Code Examples**: Real-world JavaScript examples for every concept

### 🏆 **Gamification & Progress**
- **XP System**: Earn experience points for completing lessons and quizzes
- **Streak Tracking**: Maintain daily learning streaks for motivation
- **Achievement System**: Unlock badges and milestones
- **Progress Analytics**: Detailed insights into your learning journey

### 🎨 **User Experience**
- **Beautiful Design**: Modern, clean interface with smooth animations
- **Dark/Light Themes**: Customizable themes for comfortable learning
- **Offline Support**: Learn anywhere, anytime without internet
- **Haptic Feedback**: Tactile responses for engaging interactions

### 📱 **Mobile-First Design**
- **Responsive Layout**: Optimized for all screen sizes
- **Gesture Controls**: Natural swipe, tap, and scroll interactions
- **Performance Optimized**: Smooth 60fps animations and transitions
- **Accessibility**: Full support for screen readers and accessibility features

## 🎮 How to Use

### **Swipe Gestures**
- **👈 Swipe Left**: Mark lesson as completed (+50 XP)
- **👉 Swipe Right**: Bookmark lesson for later review
- **👆 Swipe Up**: Navigate to next lesson
- **👇 Swipe Down**: Go back to previous lesson
- **👆 Tap**: Expand lesson for detailed view

### **Learning Flow**
1. Start with Day 1 fundamentals
2. Swipe through lessons at your own pace
3. Take quizzes to test understanding
4. Bookmark important concepts
5. Track progress and maintain streaks
6. Advance through 30 days of content

## 🛠 Tech Stack

### **Frontend**
- **React Native 0.79.1**: Cross-platform mobile development
- **Expo SDK 53**: Development platform and tools
- **TypeScript**: Type-safe JavaScript development
- **React Navigation**: Navigation and routing
- **Zustand**: Lightweight state management

### **UI/UX**
- **NativeWind**: Tailwind CSS for React Native
- **Lucide Icons**: Beautiful, consistent iconography
- **React Native Gesture Handler**: Advanced gesture recognition
- **React Native Reanimated**: Smooth, performant animations

### **Services & Infrastructure**
- **Expo Notifications**: Push notifications and reminders
- **AsyncStorage**: Local data persistence
- **Expo Haptics**: Tactile feedback
- **Analytics Service**: User engagement tracking
- **Performance Monitoring**: App performance insights

### **Development & Testing**
- **Jest**: Unit and integration testing
- **React Native Testing Library**: Component testing
- **ESLint**: Code linting and formatting
- **TypeScript**: Static type checking

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### **Installation**
```bash
# Clone the repository
git clone https://github.com/yourusername/swipelearn-js.git
cd swipelearn-js

# Install dependencies
npm install

# Start the development server
npm start

# Run on specific platforms
npm run ios     # iOS Simulator
npm run android # Android Emulator
npm run web     # Web browser
```

### **Development Scripts**
```bash
# Development
npm start                    # Start Expo development server
npm run web                 # Start web development server
npm run start-web-dev       # Start web with debug mode

# Testing
npm test                    # Run test suite
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Generate coverage report
npm run test:ci            # Run tests for CI/CD

# Building & Deployment
npm run build:development  # Build development version
npm run build:preview      # Build preview version
npm run build:production   # Build production version
npm run submit:android     # Submit to Google Play Store
npm run submit:ios         # Submit to Apple App Store

# Code Quality
npm run lint               # Run ESLint
npm run type-check         # Run TypeScript checks
```

## 📱 Production Deployment

### **App Store Deployment**
1. **Configure EAS Build**
   ```bash
   npm install -g @expo/eas-cli
   eas login
   eas build:configure
   ```

2. **Generate App Icons**
   ```bash
   node scripts/generate-icons.js
   ```

3. **Build for Production**
   ```bash
   npm run build:production
   ```

4. **Submit to Stores**
   ```bash
   npm run submit:android  # Google Play Store
   npm run submit:ios      # Apple App Store
   ```

For detailed deployment instructions, see [Deployment Guide](docs/deployment-guide.md).

## 🧪 Testing

### **Test Coverage**
- **Unit Tests**: Core functionality and utilities
- **Integration Tests**: Component interactions and flows
- **Store Tests**: State management validation
- **Performance Tests**: App performance monitoring

### **Running Tests**
```bash
# Run all tests
npm test

# Run specific test suites
npm test -- --testPathPattern="store"        # Store tests
npm test -- --testPathPattern="components"   # Component tests
npm test -- --testPathPattern="integration"  # Integration tests

# Generate coverage report
npm run test:coverage
```

## 📊 Analytics & Monitoring

### **Built-in Analytics**
- User engagement tracking
- Learning progress analytics
- Performance monitoring
- Crash reporting
- Custom event tracking

### **Privacy-First Approach**
- All data stored locally on device
- No personal information collected
- GDPR and CCPA compliant
- Transparent privacy policy

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### **Development Workflow**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### **Code Style**
- Follow TypeScript best practices
- Use ESLint configuration
- Write comprehensive tests
- Document new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Asabeneh Yetayeh**: Creator of "30 Days of JavaScript" curriculum
- **Expo Team**: Amazing development platform and tools
- **React Native Community**: Excellent libraries and resources
- **Open Source Contributors**: All the amazing libraries that make this possible

## 📞 Support

### **Getting Help**
- 📧 Email: support@swipelearn.app
- 🌐 Website: https://swipelearn.app
- 📱 In-app support: Settings → Help & Support

### **Bug Reports**
Please report bugs through [GitHub Issues](https://github.com/yourusername/swipelearn-js/issues) with:
- Device information
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

### **Feature Requests**
We love hearing your ideas! Submit feature requests through GitHub Issues with the "enhancement" label.

---

**Made with ❤️ by the SwipeLearn team**

*Transform your coding journey, one swipe at a time! 🚀*
