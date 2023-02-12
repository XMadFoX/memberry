import calcAge from '@/lib/age';
import { DatePicker } from '@mantine/dates';
import { useEffect, useState } from 'react';

export default function Birthday({
  fetching,
  value,
  setValue,
}: {
  fetching: boolean;
  value: Date | null;
  setValue: (value: Date | null) => void;
}) {
  const [error, setError] = useState<string | boolean>(false);

  useEffect(() => {
    const now = new Date();
    if (value && new Date(value) > now) {
      setError('Date cannot be in the future');
      return;
    }
    if (value && calcAge(value) < 2) {
      setError("You're too young to use this service");
      return;
    }
    setError(false);
  }, [value]);

  return (
    <div>
      <DatePicker
        allowFreeInput
        required
        value={value}
        name="birthday"
        onChange={setValue}
        placeholder="Choose date"
        disabled={fetching}
        error={error}
        label="Date of birth"
      />
      <small style={{ opacity: 0.5 }}>
        {/* TODO:  */}
        This information will be used to adapt the difficulty of the tasks
      </small>
    </div>
  );
}
