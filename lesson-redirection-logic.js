// Function to check for both the course and lesson parameters in the URL or Wized environment
const checkCourseAndLessonParameters = () => {
    const currentOrigin = window.location.origin;

    // If inside Wized environment, check n.parameters for course and lesson
    if (currentOrigin === 'https://server.wized.com') {
        window.Wized = window.Wized || [];
        window.Wized.push((Wized) => {
            const course = Wized.data.n.parameter.course;
            const lesson = Wized.data.n.parameter.lesson;

            // Return true if either course or lesson parameter exists
            return course || lesson;
        });
    } else {
        // If outside Wized, check URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.has('course') || urlParams.has('lesson');
    }
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
        // The next step is to check if the "course" or "lesson" parameters exist in the URL or Wized
        window.Wized = window.Wized || [];
        window.Wized.push(() => {
            if (!checkCourseAndLessonParameters()) {
                // If neither "course" nor "lesson" parameter exists, redirect to the dashboard home page
                handleRedirection('/dashboard/home');
            }
        });
    }
};

// Execute the function immediately to handle redirection logic
checkUserStatusAndRedirect();
