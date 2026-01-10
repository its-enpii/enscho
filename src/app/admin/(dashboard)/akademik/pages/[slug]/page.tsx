import { prisma } from "@/lib/prisma";
import EditSubPageForm from "./_components/EditSubPageForm";

export default async function EditSubPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const page = await prisma.page.findUnique({
    where: { slug },
  });

  return <EditSubPageForm slug={slug} page={page} />;
}
