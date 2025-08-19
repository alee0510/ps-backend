import * as Yup from "yup";

export const CreateArticleSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  content: Yup.string().required("Content is required"),
  authorId: Yup.string().required("Author is required"),
});
