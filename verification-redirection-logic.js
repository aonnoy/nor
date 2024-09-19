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

    // If auth_token doesn't exist, redirect to the main page
    if (!authToken) {
        handleRedirection('/');
    } else {
        // auth_token is present, check localStorage keys
        const verificationStatus = localStorage.getItem('verification-status') === 'true';
        const membershipActive = localStorage.getItem('membership-active') === 'true';
        const onboardingStatus = localStorage.getItem('onboarding-status') === 'true';

        // Handle redirection logic based on localStorage values
        if (!verificationStatus) {
            // If verification-status is false, no redirection is needed
            return;
        } else if (verificationStatus && !membershipActive && !onboardingStatus) {
            // If verification-status is true, but membership-active is false and onboarding-status is false
            handleRedirection('/membership/pick-a-plan');
        } else if (membershipActive && !onboardingStatus) {
            // If membership-active is true and onboarding-status is false
            handleRedirection('/auth/onboarding');
        } else if (membershipActive && onboardingStatus && verificationStatus) {
            // If membership-active, onboarding-status, and verification-status are all true
            handleRedirection('/dashboard/home');
        }
    }
};

// Call the function to check for the auth_token and handle redirection
checkUserStatusAndRedirect();
