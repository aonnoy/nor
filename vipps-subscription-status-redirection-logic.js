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

// Function to check conditions and handle redirection
const checkUserStatusAndRedirect = () => {
    const authToken = getCookie('auth_token');

    // If auth_token doesn't exist, redirect immediately to the main page
    if (!authToken) {
        handleRedirection('/');
        return; // Exit the function to avoid any further checks
    }

    // Proceed with other checks if the auth_token is present
    const vippsInitiated = localStorage.getItem('vipps-initiated') === 'true';
    const verificationStatus = localStorage.getItem('verification-status') === 'true';
    const dashboardAccess = localStorage.getItem('dashboard-access') === 'true';
    const onboardingStatus = localStorage.getItem('onboarding-status') === 'true';

    // Check if vipps-initiated is true
    if (vippsInitiated) {
        return; // Do nothing, remain on the current page
    } else if (!localStorage.getItem('vipps-initiated')) {
        // If vipps-initiated doesn't exist, check the verification status
        if (!verificationStatus) {
            handleRedirection('/auth/verification');
        } else if (verificationStatus && !dashboardAccess) {
            // If verification-status is true and dashboard-access is false
            handleRedirection('/membership/pick-a-plan');
        } else if (verificationStatus && dashboardAccess && !onboardingStatus) {
            // If onboarding-status is false
            handleRedirection('/auth/onboarding');
        } else if (verificationStatus && dashboardAccess && onboardingStatus) {
            // If all statuses are true
            handleRedirection('/dashboard/home');
        }
    }
};

// Call the function to check for the auth_token and handle redirection
checkUserStatusAndRedirect();
