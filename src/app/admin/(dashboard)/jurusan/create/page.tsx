import { createMajor } from "../actions";
import MajorForm from "../_components/MajorForm";

export default function CreateMajorPage() {
  return <MajorForm action={createMajor} titleText="Tambah Jurusan Baru" />;
}
