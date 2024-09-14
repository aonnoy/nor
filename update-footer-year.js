// Select the text element with the 'footer-text-update' attribute
const footerTextElement = document.querySelector('[footer-text-update]');

// Get the current year
const currentYear = new Date().getFullYear();

// Update the element's text content with the current year
footerTextElement.textContent = `© ${currentYear} Nor Agency. All rights reserved.`;
