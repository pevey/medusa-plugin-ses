import { Heading, Button, FocusModal, Textarea, Tabs, usePrompt } from "@medusajs/ui"
import { PlusMini, XMark, Check, EllipsisHorizontal, PencilSquare, ComputerDesktop, Trash } from "@medusajs/icons"
import { useSesTemplate, useSesTemplateUpdate } from "../hooks"
import CodeEditor from "./CodeEditor"

const EditTemplateModal = ({
   editOpen,
   closeEdit,
   activeTemplateId
}) => {
   const response: any = useSesTemplate(activeTemplateId)
   const activeTemplate = response?.data?.template

   async function saveTemplate(event) {
      event.preventDefault()
      console.log(event)
      let data = Object.fromEntries(new FormData(event.currentTarget))
      console.log(data)
      // do entity update, etc.
      closeEdit()
   } 

   return (
      <FocusModal open={editOpen} onOpenChange={(modalOpened) => {
         if (!modalOpened) {
            closeEdit()
         }
      }}>
         <FocusModal.Content>
            <FocusModal.Header>
               <Button variant="secondary">Cancel</Button>
               <Button className="ml-2">Save</Button>
            </FocusModal.Header>
            <FocusModal.Body className="m-4 overflow-y-auto">
               <Heading level="h1" className="text-center">{activeTemplateId}</Heading>
               <CodeEditor />            
               <Tabs defaultValue="subject">
                  <Tabs.List className="my-4">
                     <Tabs.Trigger value="subject">Subject</Tabs.Trigger>
                     <Tabs.Trigger value="text">Text</Tabs.Trigger>
                     <Tabs.Trigger value="html">HTML</Tabs.Trigger>
                  </Tabs.List>
                  <Tabs.Content value="subject">
                     <Textarea value={activeTemplate?.subject} />
                  </Tabs.Content>
                  <Tabs.Content value="text">
                     <Textarea rows={20} value={activeTemplate?.text} />
                  </Tabs.Content>
                  <Tabs.Content value="html">
                     <Textarea rows={20} className="resize rounded-xl" value={activeTemplate?.html} />
                  </Tabs.Content>
               </Tabs>
               <div className="flex items-center justify-end mt-6">
                  <Button variant="secondary">Cancel</Button>
                  <Button className="ml-2">Save</Button>
               </div>
            </FocusModal.Body>
         </FocusModal.Content>
      </FocusModal>
   )
}

export default EditTemplateModal

