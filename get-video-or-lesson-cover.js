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

  // Function to get URL parameters
  function getUrlParameter(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  // Get the auth token from the cookie
  const authToken = getAuthToken();
  
  // Get course_slug and lesson_slug from URL params
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

        // Delay the fade-out for 1.5 seconds
        setTimeout(() => {
          const skeletonLoader = document.querySelector('[wized="dashboard_lesson_media_skeletonLoader"]');
          if (skeletonLoader) {
            skeletonLoader.classList.add("fade-out");
          }
        }, 500); // 1.5 second delay

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

        // Delay the fade-out for 1.5 seconds
        setTimeout(() => {
          const skeletonLoader = document.querySelector('[wized="dashboard_lesson_media_skeletonLoader"]');
          if (skeletonLoader) {
            skeletonLoader.classList.add("fade-out");
          }
        }, 500); // 1.5 second delay
      }
    })
    .catch(error => {
      console.error("Error occurred while fetching or processing the API response", error);
    });
  }
