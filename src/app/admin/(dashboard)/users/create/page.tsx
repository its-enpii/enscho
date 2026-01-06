import { createUser } from "../actions";
import UserForm from "../_components/UserForm";

export default function CreateUserPage() {
  return (
    <UserForm
      action={createUser}
      titleText="Tambah Pengguna Baru"
      subtitleText="Buat akun pengguna baru untuk sistem"
      isEdit={false}
    />
  );
}
