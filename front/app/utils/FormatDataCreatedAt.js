import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'
import 'dayjs/locale/en'

dayjs.extend(relativeTime)
dayjs.extend(updateLocale)
dayjs.locale('en')

dayjs.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: 'just now',
    m: '1m',
    mm: '%dm',
    h: '1h',
    hh: '%dh',
    d: '1d',
    dd: '%dd',
    M: '1mo',
    MM: '%dmo',
    y: '1y',
    yy: '%dy',
  },
})

/**
 * 🕒 تنسيق الوقت النسبي لعرضه مثل "2h ago"
 * @param {string|Date} date - وقت الإنشاء (createdAt)
 * @returns {string} الوقت بشكل نسبي
 */
export const formatRelativeTime = (date) => {
  if (!date) return ''
  return dayjs(date).fromNow()
}
