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
      setError('Дата рождения не может быть больше текущей');
      return;
    }
    if (value && calcAge(value) < 2) {
      setError('Вы слишком молоды');
      return;
    }
    setError(false);
  }, [value]);

  return (
    <div>
      <DatePicker
        locale="ru"
        allowFreeInput
        required
        value={value}
        name="birthday"
        onChange={setValue}
        placeholder="Выберите дату"
        disabled={fetching}
        error={error}
        label="Дата рождения"
      />
      <small style={{ opacity: 0.5 }}>
        Эта информация будет использована для адаптации сложности
      </small>
    </div>
  );
}
