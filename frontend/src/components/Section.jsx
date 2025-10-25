import VacancyPreview from "./VacancyPreview";

export default function Section() {
  return (
    <section className="flex flex-col max-w-4xl mx-auto py-4">
      <h1 className="mb-2 text-2xl font-semibold">Vacantes disponibles</h1>
      <VacancyPreview />
      <VacancyPreview />
      <VacancyPreview />
    </section>
  );
}
