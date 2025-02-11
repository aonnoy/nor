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

// Function to check for both the course and lesson parameters in the URL or Wized environment
const checkCourseAndLessonParameters = () => {
    const currentOrigin = window.location.origin;

    // If inside Wized environment, check n.parameters for course and lesson
    if (currentOrigin === 'https://server.wized.com') {
        return new Promise((resolve) => {
            window.Wized = window.Wized || [];
            window.Wized.push((Wized) => {
                const course = Wized.data.n.parameter.course;
                const lesson = Wized.data.n.parameter.lesson;

                // Resolve true if both course and lesson parameters exist
                resolve(!!(course && lesson));
            });
        });
    } else {
        // If outside Wized, check URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        return Promise.resolve(urlParams.has('course') && urlParams.has('lesson'));
    }
};

// Function to handle the main redirection logic
const checkUserStatusAndRedirect = async () => {
    // Check if the auth_token cookie exists
    const authToken = getCookie('auth_token');

    // If auth_token doesn't exist, clear localStorage and redirect to the homepage
    if (!authToken) {
        localStorage.clear(); // Clear everything from localStorage
        handleRedirection('/auth/redirect-to-login');
        return;
    }

    // Get the values of the required localStorage keys
    const dashboardAccess = localStorage.getItem('dashboard-access') === 'true';
    const onboardingStatus = localStorage.getItem('onboarding-status') === 'true';

    // Redirection logic based on the localStorage values
    if (!dashboardAccess && !onboardingStatus) {
        // If both dashboardAccess and onboardingStatus are false
        handleRedirection('/membership/pick-a-plan');
    } else if (dashboardAccess && !onboardingStatus) {
        // If dashboardAccess is true and onboardingStatus is false
        handleRedirection('/auth/onboarding');
    } else if (!dashboardAccess && onboardingStatus) {
        // If dashboardAccess is false and onboardingStatus is true
        handleRedirection('/membership/subscription-error');
    } else {
        // The next step is to check if both "course" and "lesson" parameters exist in the URL or Wized
        const courseAndLessonExist = await checkCourseAndLessonParameters();
        if (!courseAndLessonExist) {
            // If either "course" or "lesson" parameter is missing, redirect to the dashboard home page
            handleRedirection('/dashboard/home');
        }
    }
};

// Execute the function immediately to handle redirection logic
checkUserStatusAndRedirect();
