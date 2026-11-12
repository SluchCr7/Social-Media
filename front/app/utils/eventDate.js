import dayjs from 'dayjs';

export const getEventDay = (value) => {
  if (value === undefined || value === null || value === '') return dayjs('');

  if (typeof value === 'string') {
    return dayjs(value.slice(0, 10));
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime())
      ? dayjs('')
      : dayjs(value.toISOString().slice(0, 10));
  }

  return dayjs(value);
};

export const getEventOccurrencesInRange = (event, rangeStart, rangeEnd) => {
  if (event.status === 'cancelled') return [];

  const originalDate = getEventDay(event.date).startOf('day');
  const start = getEventDay(rangeStart).startOf('day');
  const end = getEventDay(rangeEnd).endOf('day');
  if (!originalDate.isValid()) return [];

  const pattern =
    event.repeatPattern && event.repeatPattern !== 'none'
      ? event.repeatPattern
      : event.repeatYearly
        ? 'yearly'
        : 'none';

  if (pattern === 'none') {
    return originalDate.isBefore(start) || originalDate.isAfter(end)
      ? []
      : [{ ...event, occurrenceDate: originalDate.format('YYYY-MM-DD') }];
  }

  const repeatUntil = event.repeatUntil
    ? getEventDay(event.repeatUntil).endOf('day')
    : end;
  if (originalDate.isAfter(end) || repeatUntil.isBefore(start)) return [];

  let index = 0;
  if (pattern === 'daily' || pattern === 'weekly') {
    const interval = pattern === 'daily' ? 1 : 7;
    index = Math.max(0, Math.ceil(start.diff(originalDate, 'day') / interval));
  } else if (pattern === 'monthly') {
    index = Math.max(
      0,
      (start.year() - originalDate.year()) * 12 + start.month() - originalDate.month()
    );
  } else if (pattern === 'yearly') {
    index = Math.max(0, start.year() - originalDate.year());
  } else {
    return [];
  }

  const unit = {
    daily: 'day',
    weekly: 'week',
    monthly: 'month',
    yearly: 'year',
  }[pattern];
  const occurrences = [];
  let occurrence = originalDate.add(index, unit);
  while (occurrence.isBefore(start)) {
    index += 1;
    occurrence = originalDate.add(index, unit);
  }

  while (!occurrence.isAfter(end) && !occurrence.endOf('day').isAfter(repeatUntil)) {
    const occurrenceDate = occurrence.format('YYYY-MM-DD');
    occurrences.push({
      ...event,
      date: occurrenceDate,
      originalDate: event.date,
      occurrenceDate,
      occurrenceKey: `${event._id}-${occurrenceDate}`,
    });
    index += 1;
    occurrence = originalDate.add(index, unit);
  }

  return occurrences;
};
