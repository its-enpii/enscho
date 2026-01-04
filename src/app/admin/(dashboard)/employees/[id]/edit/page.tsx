import { updateEmployee } from "../../actions";
import EmployeeForm from "../../_components/EmployeeForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditEmployeePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const employee = await prisma.employee.findUnique({
    where: { id }
  });

  if (!employee) {
    return notFound();
  }

  // Bind the ID to the update action
  const updateAction = updateEmployee.bind(null, id);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Edit Data Guru / Staf</h1>
      <EmployeeForm action={updateAction} initialData={employee} />
    </div>
  );
}
