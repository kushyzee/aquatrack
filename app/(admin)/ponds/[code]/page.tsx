export default async function PondDetailPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  console.log("Pond code from URL:", code);
  return <div>{code}</div>;
}
