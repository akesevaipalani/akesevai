/**
 * AK e-Sevai Central Business Hours Configuration
 * Standard Operating Hours: Monday to Saturday, 10:00 AM – 8:00 PM (10:00 - 20:00)
 */

export const BUSINESS_HOURS_CONFIG = {
  startHour: 10,       // 10:00 AM
  startMinute: 0,
  endHour: 20,         // 8:00 PM (20:00)
  endMinute: 0,
  openDays: [1, 2, 3, 4, 5, 6], // Monday (1) to Saturday (6)
  dayNamesEn: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesTa: ['திங்கள்', 'செவ்வாய்', 'புதன்', 'வியாழன்', 'வெள்ளி', 'சனி'],
  displayHoursEn: 'Monday - Saturday, 10:00 AM - 8:00 PM',
  displayHoursTa: 'திங்கள் – சனி: காலை 10:00 – இரவு 8:00',
  timingSummaryEn: '10:00 AM – 8:00 PM',
  timingSummaryTa: 'காலை 10:00 – இரவு 8:00',
  closedDayEn: 'Sunday Closed',
  closedDayTa: 'ஞாயிறு விடுமுறை'
};

/**
 * Standard Appointment / Token Booking Time Slots from 10:00 AM to 8:00 PM
 */
export const APPOINTMENT_TIME_SLOTS = [
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '12:00 PM - 01:00 PM',
  '01:00 PM - 02:00 PM',
  '02:00 PM - 03:00 PM',
  '03:00 PM - 04:00 PM',
  '04:00 PM - 05:00 PM',
  '05:00 PM - 06:00 PM',
  '06:00 PM - 07:00 PM',
  '07:00 PM - 08:00 PM'
];

/**
 * 30-Minute Interval Appointment Slots from 10:00 AM to 8:00 PM (20 Slots)
 */
export const APPOINTMENT_SLOTS_30MIN = Array.from({ length: 20 }, (_, index) => {
  const formatTime = (minutes) => {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${String(minute).padStart(2, '0')} ${suffix}`;
  };
  const start = 10 * 60 + index * 30; // Starts at 10:00 AM (600 mins)
  return `${formatTime(start)} - ${formatTime(start + 30)}`;
});


/**
 * Check if the given date/time is within business hours (10:00 AM - 8:00 PM, Mon-Sat)
 */
export const isWithinBusinessHours = (date = new Date()) => {
  const day = date.getDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday
  if (!BUSINESS_HOURS_CONFIG.openDays.includes(day)) {
    return false;
  }
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const currentTotalMin = hours * 60 + minutes;
  const startTotalMin = BUSINESS_HOURS_CONFIG.startHour * 60 + BUSINESS_HOURS_CONFIG.startMinute;
  const endTotalMin = BUSINESS_HOURS_CONFIG.endHour * 60 + BUSINESS_HOURS_CONFIG.endMinute;

  return currentTotalMin >= startTotalMin && currentTotalMin < endTotalMin;
};

/**
 * Get comprehensive operational status object for UI rendering
 */
export const getOperationalStatus = (lang = 'ta', date = new Date()) => {
  const isTa = lang === 'ta';
  const isOpen = isWithinBusinessHours(date);

  const statusText = isOpen
    ? (isTa ? '🟢 மையம் திறந்துள்ளது (Open Now)' : '🟢 Centre Open Now')
    : (isTa ? '🔴 மையம் தற்போது மூடப்பட்டுள்ளது (Closed Now)' : '🔴 Centre Closed Now');

  const badgeText = isOpen
    ? (isTa ? 'திறந்துள்ளது (Open)' : 'Open Now')
    : (isTa ? 'மூடப்பட்டுள்ளது (Closed)' : 'Closed');

  const hoursText = isTa ? BUSINESS_HOURS_CONFIG.displayHoursTa : BUSINESS_HOURS_CONFIG.displayHoursEn;
  const timingText = isTa ? BUSINESS_HOURS_CONFIG.timingSummaryTa : BUSINESS_HOURS_CONFIG.timingSummaryEn;

  return {
    isOpen,
    statusText,
    badgeText,
    hoursText,
    timingText,
    displayHours: hoursText,
    openTiming: '10:00 AM',
    closeTiming: '8:00 PM'
  };
};
