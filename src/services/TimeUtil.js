export default function timeAgo(date) {
    const now = new Date();
    const seconds = Math.floor((now - new Date(date)) / 1000);
  
    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) return `${interval} years ago`;
  
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return `${interval} months ago`;
  
    interval = Math.floor(seconds / 86400);
    if (interval > 1) return `${interval} days ago`;
  
    interval = Math.floor(seconds / 3600);
    if (interval > 1) return `${interval} hours ago`;
  
    interval = Math.floor(seconds / 60);
    if (interval > 1) return `${interval} minutes ago`;
  
    return `${seconds} seconds ago`;
  }
  
//   // Example usage
//   const someDate = new Date('2025-01-29T10:00:00'); // Replace with your date
//   console.log(timeAgo(someDate));
  