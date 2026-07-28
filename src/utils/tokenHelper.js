/**
 * Daily Sequential Token Generator for AkEsevai Platform
 * 1. Tokens are generated in sequential order: TOK-001, TOK-002, TOK-003...
 * 2. Counter resets automatically to 1 (TOK-001) every new calendar day!
 */

export const getTodayDateKey = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getNextDailyTokenNumber = (existingBookings = []) => {
  const todayKey = getTodayDateKey();
  const lastSavedDate = localStorage.getItem('akesevai_token_date');
  let currentCount = parseInt(localStorage.getItem('akesevai_token_count') || '0', 10);

  // If a new day has arrived, reset daily counter to 0!
  if (lastSavedDate !== todayKey) {
    currentCount = 0;
    localStorage.setItem('akesevai_token_date', todayKey);
  }

  // Also inspect active token bookings to ensure no duplicates if page refreshed
  let maxNumberFromBookings = 0;
  if (Array.isArray(existingBookings)) {
    existingBookings.forEach((b) => {
      if (b && b.tokenNo) {
        const match = String(b.tokenNo).match(/\d+/);
        if (match) {
          const num = parseInt(match[0], 10);
          if (!isNaN(num) && num > maxNumberFromBookings && num < 9999) {
            maxNumberFromBookings = num;
          }
        }
      }
    });
  }

  const nextNum = Math.max(currentCount, maxNumberFromBookings) + 1;
  localStorage.setItem('akesevai_token_count', String(nextNum));

  // Format as TOK-001, TOK-002, TOK-003...
  const padded = String(nextNum).padStart(3, '0');
  return `TOK-${padded}`;
};
