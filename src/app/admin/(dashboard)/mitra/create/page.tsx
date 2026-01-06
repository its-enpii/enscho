import { createPartner } from "../actions";
import PartnerForm from "../_components/PartnerForm";

export default function CreatePartnerPage() {
  return (
    <PartnerForm action={createPartner} titleText="Tambah Mitra Industri" />
  );
}
