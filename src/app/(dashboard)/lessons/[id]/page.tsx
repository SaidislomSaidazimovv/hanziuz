import SingleLessonClient from "./SingleLessonClient";

export const metadata = {
  title: "Dars — HanziUz",
};

export default async function SingleLessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <SingleLessonClient lessonId={id} />;
}
