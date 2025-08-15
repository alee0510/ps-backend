import * as Yup from "yup";

export const ValidationError = Yup.ValidationError;
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
export const CreateArticleSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  content: Yup.string().required("Content is required"),
  authorId: Yup.string().required("Author is required"),
});
