import { DropdownMenu } from "@medusajs/ui"

const ActionMenu = (props:any) => {
   return (
      <DropdownMenu>
         <DropdownMenu.Trigger className="text-right ml-auto">Trigger</DropdownMenu.Trigger>
         <DropdownMenu.Content>
            <DropdownMenu.Item>Edit</DropdownMenu.Item>
            <DropdownMenu.Item>Add</DropdownMenu.Item>
            <DropdownMenu.Item>Delete</DropdownMenu.Item>
         </DropdownMenu.Content>
      </DropdownMenu>
   )
}

export default ActionMenu