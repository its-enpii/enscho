import { createPage } from "../actions";
import PageForm from "../_components/PageForm";

export default function CreatePageForm() {
  return <PageForm action={createPage} titleText="Tambah Halaman Baru" />;
}
