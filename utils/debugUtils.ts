import { useEffect, useRef, useState } from 'react';

// Development-only utilities for debugging React issues
const isDev = __DEV__;

/**
 * Hook to detect infinite re-renders
 * Usage: useRenderTracker('ComponentName');
 */
export function useRenderTracker(componentName: string, maxRenders = 50) {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(Date.now());
  
  if (isDev) {
    renderCount.current += 1;
    const now = Date.now();
    const timeSinceLastRender = now - lastRenderTime.current;
    
    // Detect rapid re-renders (potential infinite loop)
    if (renderCount.current > maxRenders) {
      console.error(`🚨 INFINITE RENDER DETECTED: ${componentName} has rendered ${renderCount.current} times!`);
      console.trace('Render stack trace:');
      
      // Reset counter to prevent spam
      renderCount.current = 0;
    }
    
    // Log suspicious rapid renders
    if (timeSinceLastRender < 16 && renderCount.current > 10) {
      console.warn(`⚠️ Rapid renders in ${componentName}: ${renderCount.current} renders in ${now - (lastRenderTime.current - (renderCount.current * 16))}ms`);
    }
    
    lastRenderTime.current = now;
    
    // Reset counter after a reasonable time
    setTimeout(() => {
      if (renderCount.current > 0) {
        renderCount.current = Math.max(0, renderCount.current - 1);
      }
    }, 1000);
  }
}

/**
 * Hook to track prop changes that might cause re-renders
 */
export function usePropChangeTracker(props: Record<string, any>, componentName: string) {
  const prevProps = useRef<Record<string, any>>();
  
  if (isDev) {
    useEffect(() => {
      if (prevProps.current) {
        const changedProps = Object.keys(props).filter(key => {
          const prevValue = prevProps.current![key];
          const currentValue = props[key];
          
          // Deep comparison for objects/arrays
          if (typeof prevValue === 'object' && typeof currentValue === 'object') {
            return JSON.stringify(prevValue) !== JSON.stringify(currentValue);
          }
          
          return prevValue !== currentValue;
        });
        
        if (changedProps.length > 0) {
          console.log(`🔄 ${componentName} props changed:`, changedProps.map(key => ({
            prop: key,
            from: prevProps.current![key],
            to: props[key]
          })));
        }
      }
      
      prevProps.current = { ...props };
    });
  }
}

/**
 * Hook to detect memory leaks from useEffect
 */
export function useEffectDebugger(effectHook: () => void | (() => void), deps: any[], name: string) {
  const renderCount = useRef(0);
  const cleanupCount = useRef(0);
  
  if (isDev) {
    return useEffect(() => {
      renderCount.current += 1;
      console.log(`🔧 Effect "${name}" running (${renderCount.current} times)`);
      
      const cleanup = effectHook();
      
      return () => {
        if (cleanup && typeof cleanup === 'function') {
          cleanupCount.current += 1;
          console.log(`🧹 Effect "${name}" cleanup (${cleanupCount.current} times)`);
          cleanup();
        }
      };
    }, deps);
  } else {
    return useEffect(effectHook, deps);
  }
}

/**
 * Hook to detect state updates that might cause loops
 */
export function useStateDebugger<T>(initialState: T, name: string): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState(initialState);
  const updateCount = useRef(0);
  const lastUpdate = useRef(Date.now());
  
  const debugSetState = (value: T | ((prev: T) => T)) => {
    if (isDev) {
      updateCount.current += 1;
      const now = Date.now();
      const timeSinceLastUpdate = now - lastUpdate.current;
      
      // Detect rapid state updates
      if (timeSinceLastUpdate < 16 && updateCount.current > 10) {
        console.warn(`⚠️ Rapid state updates in ${name}: ${updateCount.current} updates`);
        console.trace('State update stack trace:');
      }
      
      lastUpdate.current = now;
      
      // Log state changes
      const newValue = typeof value === 'function' ? (value as (prev: T) => T)(state) : value;
      console.log(`📊 State "${name}" updated:`, { from: state, to: newValue });
    }
    
    setState(value);
  };
  
  return [state, debugSetState];
}

/**
 * Performance monitoring hook
 */
export function usePerformanceMonitor(componentName: string) {
  const renderStart = useRef(0);
  const mountTime = useRef(0);
  
  if (isDev) {
    // Track render performance
    renderStart.current = performance.now();
    
    useEffect(() => {
      const renderEnd = performance.now();
      const renderTime = renderEnd - renderStart.current;
      
      if (renderTime > 16) { // Longer than one frame
        console.warn(`⏱️ Slow render in ${componentName}: ${renderTime.toFixed(2)}ms`);
      }
      
      // Track mount time
      if (mountTime.current === 0) {
        mountTime.current = renderEnd;
        console.log(`🚀 ${componentName} mounted in ${renderTime.toFixed(2)}ms`);
      }
      
      return () => {
        console.log(`💀 ${componentName} unmounting`);
      };
    });
  }
}

/**
 * Hook to detect and prevent infinite loops in useEffect
 */
export function useSafeEffect(
  effect: () => void | (() => void),
  deps: any[],
  name: string,
  maxExecutions = 10
) {
  const executionCount = useRef(0);
  const lastExecution = useRef(0);
  
  if (isDev) {
    return useEffect(() => {
      const now = Date.now();
      
      // Reset counter if enough time has passed
      if (now - lastExecution.current > 1000) {
        executionCount.current = 0;
      }
      
      executionCount.current += 1;
      lastExecution.current = now;
      
      if (executionCount.current > maxExecutions) {
        console.error(`🚨 POTENTIAL INFINITE LOOP: Effect "${name}" has executed ${executionCount.current} times in quick succession!`);
        console.trace('Effect stack trace:');
        return; // Prevent execution
      }
      
      console.log(`🔧 Safe effect "${name}" executing (${executionCount.current}/${maxExecutions})`);
      return effect();
    }, deps);
  } else {
    return useEffect(effect, deps);
  }
}

/**
 * Component wrapper to catch and log render errors
 */
export function withRenderErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) {
  if (!isDev) return Component;
  
  return function DebugWrapper(props: P) {
    try {
      useRenderTracker(componentName);
      usePropChangeTracker(props as Record<string, any>, componentName);
      usePerformanceMonitor(componentName);
      
      return <Component {...props} />;
    } catch (error) {
      console.error(`💥 Render error in ${componentName}:`, error);
      return null;
    }
  };
}

/**
 * Utility to log component lifecycle
 */
export function useLifecycleLogger(componentName: string) {
  if (isDev) {
    console.log(`🎬 ${componentName} rendering`);
    
    useEffect(() => {
      console.log(`🚀 ${componentName} mounted`);
      
      return () => {
        console.log(`💀 ${componentName} unmounting`);
      };
    }, []);
  }
}

/**
 * Hook to detect dependency array issues
 */
export function useDependencyDebugger(deps: any[], name: string) {
  const prevDeps = useRef<any[]>();
  
  if (isDev) {
    useEffect(() => {
      if (prevDeps.current) {
        const changedDeps = deps.map((dep, index) => {
          const prevDep = prevDeps.current![index];
          const changed = dep !== prevDep;
          
          return {
            index,
            changed,
            prev: prevDep,
            current: dep
          };
        }).filter(dep => dep.changed);
        
        if (changedDeps.length > 0) {
          console.log(`🔄 Dependencies changed for "${name}":`, changedDeps);
        }
      }
      
      prevDeps.current = [...deps];
    });
  }
}

// Export all debugging utilities
export const DebugUtils = {
  useRenderTracker,
  usePropChangeTracker,
  useEffectDebugger,
  useStateDebugger,
  usePerformanceMonitor,
  useSafeEffect,
  withRenderErrorBoundary,
  useLifecycleLogger,
  useDependencyDebugger
};

export default DebugUtils;
