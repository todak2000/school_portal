export const getPosition = (n:number) =>{
    // Convert the number to a string
    const numString = n.toString();
    
    // Get the last digit of the number
    const lastDigit = n % 10;
    
    // Handle special cases for 11, 12, 13 (teen numbers)
    if (numString.endsWith("11") || numString.endsWith("12") || numString.endsWith("13")) {
      return `${n}th`;
    }
  
    // Determine the suffix based on the last digit
    let suffix;
    switch (lastDigit) {
      case 1:
        suffix = "st";
        break;
      case 2:
        suffix = "nd";
        break;
      case 3:
        suffix = "rd";
        break;
      default:
        suffix = "th";
    }
  
    return `${n}${suffix}`;
  }
