export function isShopOpenNow(openingHoursStr) {
  // Return true if we can't parse or empty
  if (!openingHoursStr || typeof openingHoursStr !== 'string') return true;

  // Assuming format "07:00 - 22:00"
  let parts = openingHoursStr.split('-');
  if (parts.length !== 2) return true;

  let startStr = parts[0].trim();
  let endStr = parts[1].trim();
  
  // Extract hh:mm
  const timeRegex = /^(\d{1,2}):(\d{2})$/;
  const startMatch = startStr.match(timeRegex);
  const endMatch = endStr.match(timeRegex);

  if (!startMatch || !endMatch) return true;

  const startH = parseInt(startMatch[1], 10);
  const startM = parseInt(startMatch[2], 10);
  const endH = parseInt(endMatch[1], 10);
  const endM = parseInt(endMatch[2], 10);

  // Get current time in Vietnam timezone
  const now = new Date();
  const options = { timeZone: 'Asia/Ho_Chi_Minh', hour12: false, hour: 'numeric', minute: 'numeric' };
  const formatter = new Intl.DateTimeFormat('en-US', options);
  const timeParts = formatter.formatToParts(now);
  
  let currentH = 0;
  let currentM = 0;

  timeParts.forEach(part => {
    if (part.type === 'hour') currentH = parseInt(part.value, 10);
    if (part.type === 'minute') currentM = parseInt(part.value, 10);
  });
  
  // Special case: 24h format midnight is 24 on some browsers, or 0. Treat "24" as "0"
  if (currentH === 24) currentH = 0;

  const currentMinutes = currentH * 60 + currentM;
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  if (startMinutes <= endMinutes) {
    // Standard case: 07:00 to 22:00
    return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
  } else {
    // Overnight case: 18:00 to 02:00 (next day)
    return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
  }
}
