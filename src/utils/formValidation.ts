
// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

// Post title validation
export const isValidTitle = (title: string): boolean => {
  return title.trim().length >= 5;
};

// Post content validation
export const isValidContent = (content: string): boolean => {
  return content.trim().length >= 20;
};

// Form validation helper
export const validateForm = (formData: Record<string, string>): Record<string, string> => {
  const errors: Record<string, string> = {};

  // Iterate through form fields and validate
  Object.entries(formData).forEach(([key, value]) => {
    if (!value.trim()) {
      errors[key] = "This field is required";
    } else if (key === "email" && !isValidEmail(value)) {
      errors[key] = "Please enter a valid email address";
    } else if (key === "password" && !isValidPassword(value)) {
      errors[key] = "Password must be at least 6 characters long";
    } else if (key === "title" && !isValidTitle(value)) {
      errors[key] = "Title must be at least 5 characters long";
    } else if (key === "content" && !isValidContent(value)) {
      errors[key] = "Content must be at least 20 characters long";
    }
  });

  return errors;
};
