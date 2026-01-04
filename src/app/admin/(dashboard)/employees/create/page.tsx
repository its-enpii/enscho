import { createEmployee } from "../actions";
import EmployeeForm from "../_components/EmployeeForm";

export default function CreateEmployeePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Tambah Guru / Staf Baru</h1>
      <EmployeeForm action={createEmployee} />
    </div>
  );
}
