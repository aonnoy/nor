// Function to get a specific cookie value by name
const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop().split(';').shift();
    }
    return null;
};

// Function to handle redirection based on the origin
const handleRedirection = (path) => {
    const currentOrigin = window.location.origin;

    // If origin is server.wized.com, use Wized redirection with n.path
    if (currentOrigin === 'https://server.wized.com') {
        window.Wized = window.Wized || [];
        window.Wized.push((Wized) => {
            Wized.data.n.path = path; // Use n.path for Wized environment
        });
    } else {
        // Use regular redirection for other origins
        window.location.href = path;
    }
};

// Function to clear localStorage and handle redirection if auth_token is missing
const clearLocalStorageAndRedirect = () => {
    localStorage.clear(); // Clear all localStorage data
    handleRedirection('/'); // Redirect to the homepage
};

// Function to check conditions and handle redirection on the /auth/onboarding page
const checkUserStatusAndRedirect = () => {
    const authToken = getCookie('auth_token');

    // If auth_token doesn't exist, clear localStorage and redirect immediately to the main page
    if (!authToken) {
        clearLocalStorageAndRedirect();
        return; // Exit the function to avoid further checks
    }

    // Proceed with other checks if the auth_token is present
    const verificationStatus = localStorage.getItem('verification-status') === 'true';
    const onboardingStatus = localStorage.getItem('onboarding-status') === 'true';
    const dashboardAccess = localStorage.getItem('dashboard-access') === 'true';

    // Logic for redirection based on localStorage values
    if (!verificationStatus && !onboardingStatus && !dashboardAccess) {
        // If verification-status, onboarding-status, and dashboard-access are all false
        handleRedirection('/auth/verification');
    } else if (verificationStatus && !onboardingStatus && !dashboardAccess) {
        // If verification-status is true, but onboarding-status and dashboard-access are false
        handleRedirection('/membership/pick-a-plan');
    } else if (verificationStatus && !dashboardAccess && onboardingStatus) {
        // If verification-status and onboarding-status are true, but dashboard-access is false
        handleRedirection('/membership/subscription-error');  // Redirect to subscription error page
    } else if (verificationStatus && dashboardAccess && !onboardingStatus) {
        // If verification-status and dashboard-access are true, but onboarding-status is false
        // Stay on the current page, no redirection needed
        return;
    } else if (verificationStatus && dashboardAccess && onboardingStatus) {
        // If all statuses are true, redirect to the dashboard home
        handleRedirection('/dashboard/home');
    }
};

// Call the function to check for the auth_token and handle redirection
checkUserStatusAndRedirect();

