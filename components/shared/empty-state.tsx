export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="glass-card p-8 text-center">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-3 text-sm text-foreground/70">{description}</p>
    </div>
  );
}
