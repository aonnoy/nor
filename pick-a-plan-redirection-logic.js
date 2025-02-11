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

// Function to clear localStorage and redirect to homepage
const clearLocalStorageAndRedirect = () => {
    localStorage.clear(); // Clear all localStorage data
    handleRedirection('/auth/redirect-to-login'); // Redirect to the homepage
};

// Function to check conditions and handle redirection for /membership/pick-a-plan page
const checkUserStatusAndRedirect = () => {
    const authToken = getCookie('auth_token');

    // If auth_token doesn't exist, clear localStorage and redirect to the homepage
    if (!authToken) {
        clearLocalStorageAndRedirect();
    } else {
        // auth_token is present, check localStorage keys
        const dashboardAccess = localStorage.getItem('dashboard-access') === 'true';
        const onboardingStatus = localStorage.getItem('onboarding-status') === 'true';

        // Handle redirection logic based on localStorage values
        if (!dashboardAccess && !onboardingStatus) {
            // If dashboard-access and onboarding-status are both false, keep the user where they are
            return;
        } else if (dashboardAccess && !onboardingStatus) {
            // If dashboard-access is true and onboarding-status is false, redirect to onboarding page
            handleRedirection('/auth/onboarding');
        } else if (!dashboardAccess && onboardingStatus) {
            // If dashboard-access is false and onboarding-status is true, keep the user where they are
            return;
        } else if (dashboardAccess && onboardingStatus) {
            // If dashboard-access and onboarding-status are both true, redirect to dashboard home
            handleRedirection('/dashboard/home');
        }
    }
};

// Call the function to check for the auth_token and handle redirection
checkUserStatusAndRedirect();
