import { Button } from "../components/ui/button";

export function ThemePreviewPage() {
  return (
    <main class="p-margin flex flex-col gap-margin text-center">
      <h1 class="font-bold text-2xl">Button</h1>
      <h2 class="mb-2 font-semibold">Small</h2>
      <div class="flex gap-gutter justify-center">
        <Button variant="neutral" size="sm">
          Neutral
        </Button>
        <Button variant="accent" size="sm">
          Accent
        </Button>
        <Button variant="success" size="sm">
          Success
        </Button>
        <Button variant="warning" size="sm">
          Warning
        </Button>
        <Button variant="danger" size="sm">
          Danger
        </Button>
      </div>
      <h2 class="mb-2 font-semibold">Default</h2>
      <div class="flex gap-gutter justify-center">
        <Button variant="neutral">Neutral</Button>
        <Button variant="accent">Accent</Button>
        <Button variant="success">Success</Button>
        <Button variant="warning">Warning</Button>
        <Button variant="danger">Danger</Button>
      </div>
      <h2 class="mb-2 font-semibold">Large</h2>
      <div class="flex gap-gutter justify-center">
        <Button variant="neutral" size="lg">
          Neutral
        </Button>
        <Button variant="accent" size="lg">
          Accent
        </Button>
        <Button variant="success" size="lg">
          Success
        </Button>
        <Button variant="warning" size="lg">
          Warning
        </Button>
        <Button variant="danger" size="lg">
          Danger
        </Button>
      </div>
    </main>
  );
}
