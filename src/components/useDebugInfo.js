import { useEffect, useRef } from 'react';

const useRenderCount = () => {
  const count = useRef(0);
  count.current += 1;
  return count.current;
};

export function useDebugInfo(componentName, props) {
  const count = useRenderCount();
  const changedProps = useRef({});
  const previousProps = useRef(props);
  const lastRenderTimestamp = useRef(Date.now());

  const propKeys = Object.keys({ ...props, ...previousProps });
  changedProps.current = propKeys.reduce((obj, key) => {
    if (props[key] === previousProps.current[key]) return obj;
    return {
      ...obj,
      [key]: { previous: previousProps.current[key], current: props[key] },
    };
  }, {});
  const info = {
    count,
    changedProps: changedProps.current,
    timeSinceLastRender: Date.now() - lastRenderTimestamp.current,
    lastRenderTimestamp: lastRenderTimestamp.current,
  };
  const { timeSinceLastRender } = info;

  useEffect(() => {
    previousProps.current = props;
    lastRenderTimestamp.current = Date.now();
    console.group(
      `Render ${count}: timeSinceLastRender: ${timeSinceLastRender}: lastRenderTimestamp: ${lastRenderTimestamp.current}`
    );
    console.log(`[Debug Info]`, { 'Prop changes': changedProps.current });
    console.groupEnd();
  });

  return info;
}
