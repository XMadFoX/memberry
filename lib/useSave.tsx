import { useLocalStorageValue } from '@mantine/hooks';

const useSave = () => {
  const [completed, setCompleted] = useLocalStorageValue({
    key: 'levelsCompleted',
    defaultValue: 0,
    serialize: (value: number) => value.toString(),
    deserialize: (value: string) => (value ? parseInt(value, 10) : 0),
  });
  const [storyMode, setStoryMode] = useLocalStorageValue({
    key: 'story',
    defaultValue: false,
  });

  return {
    completed,
    setCompleted: () => {
      if (!storyMode) return;
      if (completed >= 10) return;
      setCompleted(completed + 1);
    },
    storyMode,
    setStoryMode,
  };
};

export default useSave;
