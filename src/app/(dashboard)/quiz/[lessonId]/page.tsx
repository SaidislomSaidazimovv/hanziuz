import QuizClient from "./QuizClient";

export const metadata = {
  title: "Test — HanziUz",
};

export default async function QuizPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  return <QuizClient lessonId={lessonId} />;
}
