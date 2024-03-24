import { Button } from "@/components/ui/button"

const ButtonsPage = () => {
  return (
    <div className="p-4 space-y-4 flex flex-col max-w-[200px]">
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
      <Button variant="danger">
        Secondary
      </Button>
      <Button variant="dangerOutline">
        Secondary Outline
      </Button>
      <Button variant="super">
        Super
      </Button>
      <Button variant="superOutline">
        Super Outline
      </Button>
      <Button variant="ghost">
        Ghost
      </Button>
      <Button variant="sidebar">
        Super
      </Button>
      <Button variant="sidebarOutline">
        Super Outline
      </Button>
    </div>  
  )
}

export default ButtonsPage