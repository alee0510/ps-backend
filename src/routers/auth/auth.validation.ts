import * as Yup from "yup";

export const RegisterSchema = Yup.object().shape({
  username: Yup.string().min(6).required("Username is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    )
    .required("Password is required"),
});

export const LoginSchema = RegisterSchema.omit(["username"]);

export const SendVerificationEmailSchema = RegisterSchema.omit([
  "username",
  "password",
]);
