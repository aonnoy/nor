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

// Function to check conditions and handle redirection for /membership/pick-a-plan page
const checkUserStatusAndRedirect = () => {
    const authToken = getCookie('auth_token');

    // If auth_token doesn't exist, redirect to the main page
    if (!authToken) {
        handleRedirection('/');
    } else {
        // auth_token is present, check localStorage keys
        const verificationStatus = localStorage.getItem('verification-status') === 'true';
        const dashboardAccess = localStorage.getItem('dashboard-access') === 'true';
        const onboardingStatus = localStorage.getItem('onboarding-status') === 'true';

        // Handle redirection logic based on localStorage values
        if (!verificationStatus && !dashboardAccess && !onboardingStatus) {
            // If verification-status, dashboard-access, and onboarding-status are all false
            handleRedirection('/auth/verification');
        } else if (verificationStatus && !dashboardAccess && !onboardingStatus) {
            // If verification-status is true, but dashboard-access and onboarding-status are false
            // Keep the user on the current page (/membership/pick-a-plan)
            return;
        } else if (dashboardAccess && onboardingStatus && verificationStatus) {
            // If dashboard-access, onboarding-status, and verification-status are all true
            handleRedirection('/dashboard/home');
        } else if (verificationStatus && dashboardAccess && !onboardingStatus) {
            // If verification-status and dashboard-access are true, but onboarding-status is false
            handleRedirection('/auth/onboarding');
        }
    }
};

// Call the function to check for the auth_token and handle redirection
checkUserStatusAndRedirect();
