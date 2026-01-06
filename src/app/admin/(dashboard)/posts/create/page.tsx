import { createPost } from "../actions";
import PostForm from "../_components/PostForm";

export default function CreatePostPage() {
  return <PostForm action={createPost} titleText="Tulis Berita Baru" />;
}
