import { Card, CardContent } from "@/components/ui/primitives";

export function EmptyState({
  title,
  body,
  children,
  heading = "h2",
}: {
  title: string;
  body: string;
  children?: React.ReactNode;
  heading?: "h1" | "h2";
}) {
  const Title = heading;
  return (
    <Card>
      <CardContent className="space-y-4">
        <Title className={heading === "h1" ? "font-display text-4xl" : "font-display text-2xl"}>{title}</Title>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{body}</p>
        {children}
      </CardContent>
    </Card>
  );
}
