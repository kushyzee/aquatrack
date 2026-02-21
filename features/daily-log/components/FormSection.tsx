interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

export default function FormSection({ title, children }: FormSectionProps) {
  return (
    <section>
      <h3 className="mb-3 text-base font-medium">{title}</h3>
      <div className="space-y-5">{children}</div>
    </section>
  );
}
