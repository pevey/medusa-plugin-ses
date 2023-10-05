import { FocusModal, DropdownMenu } from "@medusajs/ui"
import { EllipsisHorizontal, PencilSquare, ComputerDesktop, Trash } from "@medusajs/icons"
import { useSesTemplateCreate } from "../hooks"

const CreateTemplateModal = async (templateId) => {

   const response = await useSesTemplateCreate(templateId)

   return (
      <FocusModal>
         <FocusModal.Trigger>Trigger</FocusModal.Trigger>
         <FocusModal.Content>
            <FocusModal.Header>Title</FocusModal.Header>
            <FocusModal.Body>Content</FocusModal.Body>
         </FocusModal.Content>
      </FocusModal>
   )
}

export default CreateTemplateModal
