export function PageHeader({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <header className="mb-6 max-w-3xl">
      <h1 className="font-display text-4xl text-foreground">{title}</h1>
      {children ? <div className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">{children}</div> : null}
    </header>
  );
}
