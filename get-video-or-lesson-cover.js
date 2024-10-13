
  // Function to get the auth token from the cookie
  function getAuthToken() {
    const name = "auth_token=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i].trim();
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return null;
  }

  // Function to get URL parameters, including proxied URLs
  function getUrlParameter(name) {
    const params = new URLSearchParams(window.location.search);
    let paramValue = params.get(name);

    // Check if the URL is being proxied by Wized (e.g., includes 'url=' in the query)
    if (!paramValue && params.get('url')) {
      // Decode the proxied URL and extract parameters from it
      const proxiedUrl = decodeURIComponent(params.get('url'));
      const proxiedParams = new URLSearchParams(proxiedUrl.split('?')[1]);
      paramValue = proxiedParams.get(name);
    }

    return paramValue;
  }

  // Get the auth token from the cookie
  const authToken = getAuthToken();
  
  // Get course_slug and lesson_slug from URL params (handles both normal and proxied URLs)
  const courseSlug = getUrlParameter("course");
  const lessonSlug = getUrlParameter("lesson");

  if (!authToken || !courseSlug || !lessonSlug) {
    console.error("Missing required information: Auth token, course_slug, or lesson_slug");
  } else {
    // Make the request to the Xano API with course_slug and lesson_slug in the query params
    fetch(`https://backend.norcommunity.com/api:08RmoMpl/dashboard/lesson/get-video-or-lesson-cover?course_slug=${courseSlug}&lesson_slug=${lessonSlug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to fetch data from the API: " + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      const videoUrl = data.video_url;
      const lessonCover = data.lesson_cover;
      const courseName = data.course_name; // New variable for course name
      const lessonName = data.lesson_name; // New variable for lesson name

      // Logic to handle video or lesson cover
      if (lessonCover === null && videoUrl) {
        // If lessonCover is null and videoUrl is available, update the Vimeo embed
        const vimeoEmbed = document.querySelector('[wized="dashboard_lesson_media_vimeo"] iframe');
        if (vimeoEmbed) {
          vimeoEmbed.src = videoUrl; // Set the new video URL
        }

        // Add custom attribute 'custom-cloak' to the element with wized=dashboard_lesson_media_coverWrapper
        const coverWrapper = document.querySelector('[wized="dashboard_lesson_media_coverWrapper"]');
        if (coverWrapper) {
          coverWrapper.setAttribute("custom-cloak", "");
        }

        // Delay the fade-out for 500 milliseconds
        setTimeout(() => {
          const skeletonLoader = document.querySelector('[wized="dashboard_lesson_media_skeletonLoader"]');
          if (skeletonLoader) {
            skeletonLoader.classList.add("fade-out");
          }
        }, 500); // 500 ms delay

      } else if (lessonCover && !videoUrl) {
        // If lessonCover is available and videoUrl is null, update the image
        const lessonMediaCover = document.querySelector('[wized="dashboard_lesson_media_cover"]');
        if (lessonMediaCover) {
          lessonMediaCover.src = lessonCover; // Set the new lesson cover image
          lessonMediaCover.srcset = `${lessonCover} 500w, ${lessonCover} 1000w`; // Update srcset for responsive images
        }

        // Add custom attribute 'custom-cloak' to the element with wized=dashboard_lesson_media_vimeoWrapper
        const vimeoWrapper = document.querySelector('[wized="dashboard_lesson_media_vimeoWrapper"]');
        if (vimeoWrapper) {
          vimeoWrapper.setAttribute("custom-cloak", "");
        }

        // Delay the fade-out for 500 milliseconds
        setTimeout(() => {
          const skeletonLoader = document.querySelector('[wized="dashboard_lesson_media_skeletonLoader"]');
          if (skeletonLoader) {
            skeletonLoader.classList.add("fade-out");
          }
        }, 500); // 500 ms delay
      }

      // Set the course name and URL in the breadcrumb
      const courseLinkElement = document.querySelector('[wized="dashboard_lesson_breadCrumb_courseLink"]');
      if (courseLinkElement) {
        courseLinkElement.textContent = courseName; // Set the text to course_name

        // Use proxy URL with fully-qualified URL (like the working example)
        const fullCourseUrl = `https://nor-staging.webflow.io/dashboard/course?course=${courseSlug}`;
        courseLinkElement.href = `/v2/page/proxy?url=${encodeURIComponent(fullCourseUrl)}`;
      }

      // Set the lesson name and current URL in the breadcrumb
      const activeLinkElement = document.querySelector('[wized="dashboard_lesson_breadCrumb_activeLink"]');
      if (activeLinkElement) {
        activeLinkElement.textContent = lessonName; // Set the text to lesson_name

        // Use proxy URL with fully-qualified URL (like the working example)
        const fullLessonUrl = `https://nor-staging.webflow.io/dashboard/lesson?course=${courseSlug}&lesson=${lessonSlug}`;
        activeLinkElement.href = `/v2/page/proxy?url=${encodeURIComponent(fullLessonUrl)}`;
      }
    })
    .catch(error => {
      console.error("Error occurred while fetching or processing the API response", error);
    });
  }

