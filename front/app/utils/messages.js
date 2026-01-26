export const MESSAGES = {
    AUTH: {
        LOGIN_SUCCESS: "Welcome back! You have successfully logged into your account.",
        LOGIN_ERROR: "Access denied. Please check your credentials and try again.",
        LOGOUT_CONFIRM: "Are you sure you want to log out? You will need to sign in again to access your account.",
        REGISTRATION_SUCCESS: "Your account has been created successfully. Welcome to our community!",
        REGISTRATION_ERROR: "We couldn't create your account. This email might already be in use.",
        PASSWORD_UPDATE_SUCCESS: "Your password has been updated successfully.",
        PASSWORD_UPDATE_ERROR: "Failed to update your password. Please ensure it meets the security requirements.",
    },
    USER: {
        PROFILE_UPDATE_SUCCESS: "Your profile information has been successfully updated.",
        PROFILE_UPDATE_ERROR: "We encountered an error while updating your profile. Please try again.",
        PHOTO_UPDATE_SUCCESS: "Your profile picture has been updated.",
        PHOTO_UPDATE_ERROR: "Failed to upload your profile picture. Please try a different image.",
        FOLLOW_SUCCESS: (username) => `You are now following ${username}.`,
        UNFOLLOW_SUCCESS: (username) => `You have unfollowed ${username}.`,
        PRIVACY_UPDATE: (isPrivate) => `Your account is now ${isPrivate ? 'private' : 'public'}.`,
    },
    POST: {
        CREATE_SUCCESS: "Your post has been published successfully.",
        CREATE_ERROR: "Something went wrong while publishing your post.",
        DELETE_SUCCESS: "The post has been successfully removed.",
        DELETE_ERROR: "We couldn't delete the post at this time.",
        UPDATE_SUCCESS: "Your changes have been saved.",
        PIN_SUCCESS: "The post has been pinned to your profile.",
    },
    JOB: {
        CREATE_SUCCESS: "The job position has been posted successfully.",
        DELETE_SUCCESS: "The job post has been removed and is no longer visible to candidates.",
        APPLY_SUCCESS: "Your application has been submitted successfully. Good luck!",
        APPLY_ERROR: "Failed to submit your application. Please try again later.",
    },
    COMMON: {
        ERROR_OCCURRED: "An unexpected error occurred. Our team has been notified.",
        UNAUTHORIZED: "You don't have permission to perform this action.",
        LOADING: "Processing your request...",
        SAVED: "Saved successfully.",
    }
};
