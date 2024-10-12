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

// Function to check for the course parameter in the URL
const checkCourseParameter = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('course');
};

// Function to handle the main redirection logic
const checkUserStatusAndRedirect = () => {
    // Check if the auth_token cookie exists
    const authToken = getCookie('auth_token');

    // If auth_token doesn't exist, redirect to the homepage
    if (!authToken) {
        handleRedirection('/');
        return;
    }

    // Get the values of the required localStorage keys
    const verificationStatus = localStorage.getItem('verification-status') === 'true';
    const dashboardAccess = localStorage.getItem('dashboard-access') === 'true';
    const onboardingStatus = localStorage.getItem('onboarding-status') === 'true';

    // Redirection logic based on the localStorage values
    if (!verificationStatus && !dashboardAccess && !onboardingStatus) {
        // If verification, onboarding, and dashboard are all false
        handleRedirection('/auth/verification');
    } else if (verificationStatus && !dashboardAccess && !onboardingStatus) {
        // If verification is true, but dashboard and onboarding are false
        handleRedirection('/membership/pick-a-plan');
    } else if (verificationStatus && dashboardAccess && !onboardingStatus) {
        // If verification and dashboard are true, but onboarding is false
        handleRedirection('/auth/onboarding');
    } else if (verificationStatus && onboardingStatus && !dashboardAccess) {
        // If verification and onboarding are true, but dashboard is false
        handleRedirection('/membership/subscription-error');
    } else {
        // The next step is to check if the "course" parameter exists in the URL
        if (!checkCourseParameter()) {
            // If "course" parameter does not exist, redirect to the dashboard home page
            handleRedirection('/dashboard/home');
        }
    }
};

// Execute the function immediately to handle redirection logic
checkUserStatusAndRedirect();
