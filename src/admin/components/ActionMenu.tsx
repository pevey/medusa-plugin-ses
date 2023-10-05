import { DropdownMenu, usePrompt } from "@medusajs/ui"
import { EllipsisHorizontal, PencilSquare, ComputerDesktop, Trash } from "@medusajs/icons"
import { useSesTemplateDelete } from "../hooks"


const ActionMenu = (templateId) => {
   const dialog = usePrompt()
   const deleteTemplate = async (templateId) => {
      const userHasConfirmed = await dialog({
         title: "Delete Template",
         description: "Are you sure you want to completely delete this template?",
       })
       if (userHasConfirmed) {
         const response = await useSesTemplateDelete(templateId)
console.log(response)
       }
   }
   return (
      <DropdownMenu>
         <DropdownMenu.Trigger asChild>
            <button>
               <EllipsisHorizontal />
            </button>
         </DropdownMenu.Trigger>
         <DropdownMenu.Content align="end">
            <DropdownMenu.Item className="gap-x-2">
               <div className="flex flex-nowrap">
                  <ComputerDesktop className="text-ui-fg-subtle mr-2" />Preview
               </div>
            </DropdownMenu.Item>
            <DropdownMenu.Item className="gap-x-2">
               <div className="flex flex-nowrap">
                  <PencilSquare className="text-ui-fg-subtle mr-2" />Edit
               </div>
            </DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item className="gap-x-2 text-rose-700">
               <button onClick={async () => deleteTemplate(templateId)} className="flex flex-nowrap">
                  <Trash className="text-rose-700 text-ui-fg-subtle mr-2" />Delete
               </button>
            </DropdownMenu.Item>
         </DropdownMenu.Content>
      </DropdownMenu>
   )
}

export default ActionMenu