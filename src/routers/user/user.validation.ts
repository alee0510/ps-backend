import * as Yup from "yup";
export const RegisterSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});
export const UpdateUserSchema = Yup.object().shape({
  name: Yup.string(),
  email: Yup.string().email("Invalid email format"),
});
