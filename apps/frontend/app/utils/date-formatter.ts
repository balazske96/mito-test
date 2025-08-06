/**
 * Formats a date to display in the format: "Mon, 11 Aug 2025"
 * @param date - The date to format
 * @returns A formatted date string
 */
export function formatDate(date: Date): string {
  // Create the options for formatting
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short', // "Mon"
    day: 'numeric',   // "11"
    month: 'short',   // "Aug"
    year: 'numeric'   // "2025"
  };
  
  // Format the date
  const formattedDate = date.toLocaleDateString('en-US', options);
  
  // Convert format from "Mon, Aug 11, 2025" to "Mon, 11 Aug 2025"
  const parts = formattedDate.split(', ');
  if (parts.length === 3) {
    const weekday = parts[0];
    const monthDay = parts[1]!.split(' ');
    const month = monthDay[0];
    const day = monthDay[1]!.replace(',', '');
    const year = parts[2];
    
    return `${weekday}, ${day} ${month} ${year}`;
  }
  
  // Fallback to the original format if parsing fails
  return formattedDate;
}

/**
 * Formats flight time from milliseconds to a displayable format: "2h 30m"
 * @param milliseconds - The flight time in milliseconds
 * @returns A formatted time string
 */
export function formatFlightTime(milliseconds: number): string {
  // Convert milliseconds to minutes
  const totalMinutes = Math.floor(milliseconds / (1000 * 60));
  
  // Calculate hours and remaining minutes
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  // Format as "2h 30m" or just "30m" if less than an hour
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}
