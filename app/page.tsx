import { Button } from "@/components/ui/button";


export default function Home() {
  return (
    <div>
      <Button>Default</Button>
      <Button variant="primary">
        Primary
      </Button>
      <Button variant="primaryOutline">
        Primary Outline
      </Button>
      <Button variant="secondary">
        Secondary
      </Button>
      <Button variant="secondaryOutline">
        Secondary Outline
      </Button>
    </div>
  );
}
