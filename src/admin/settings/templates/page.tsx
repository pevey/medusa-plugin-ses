import { useState } from "react"
import { Heading, Tabs, Table, Container, Button, DropdownMenu, FocusModal, Select, useToggleState, Textarea, usePrompt } from "@medusajs/ui"
import { PlusMini, XMark, Check, EllipsisHorizontal, PencilSquare, ComputerDesktop, Trash } from "@medusajs/icons"
import { SettingConfig } from "@medusajs/admin"
import { useSesTemplates, useSesTemplate, useSesTemplateDelete } from "../../hooks"
import NoSubjectTooltip from "../../components/NoSubjectTooltip"
import NoTextTooltip from "../../components/NoTextTooltip"
import NoHtmlTooltip from "../../components/NoHtmlTooltip"
import NoBodyTooltip from "../../components/NoBodyTooltip"
import CodeMirror, { oneDark } from '@uiw/react-codemirror'

const TemplateEditor = function({ 
   editOpen,
   closeEdit,
   activeTemplateId
}) {
   "use client"
   const response = useSesTemplate(activeTemplateId)
   const activeTemplate = response?.data?.template

   const onChange = function(val) {
      console.log(val)
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
               <CodeMirror value={activeTemplate?.html || ''} height="auto" onChange={(val) => onChange(val)} theme={oneDark} className="text-[1rem]" />
            </FocusModal.Body>
         </FocusModal.Content>
      </FocusModal>
   )
}

const TemplateSettingsPage = function() {
   "use client"
   const response = useSesTemplates()

   const [editOpen, showEdit, closeEdit] = useToggleState()
   const [activeTemplateId, setActiveTemplate] = useState<string>()
   const editTemplate = (value) => {
      console.log(activeTemplateId)
      setActiveTemplate(value)
      console.log(activeTemplateId)
      showEdit()
   }

   const dialog = usePrompt()
   async function deleteTemplate(templateId) {
      const userHasConfirmed = await dialog({
         title: "Delete Template",
         description: "Are you sure you want to completely delete this template?",
       })
       if (userHasConfirmed) {
         useSesTemplateDelete(templateId)
       }
   }

   return (
      <Container className="mb-4">
         <TemplateEditor editOpen={editOpen} closeEdit={closeEdit} activeTemplateId={activeTemplateId} />
         <div className="flex items-start justify-between mb-6">
            <div>
               <h1 className="inter-xlarge-semibold text-grey-90">Email Templates</h1>
               <h3 className="inter-small-regular text-grey-50 pt-1.5">
                  Manage your email templates
               </h3>
            </div>
            <div className="flex items-center space-x-2">
              {/* <DropdownMenu>
                  <DropdownMenu.Trigger asChild>
                     <Button variant="secondary"><PlusMini /> Add Template</Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content align="end">
                     <DropdownMenu.Item className="gap-x-2">
                        <div className="flex flex-nowrap">
                           <PlusMini className="text-ui-fg-subtle mr-2" />Create New Template
                        </div>
                     </DropdownMenu.Item>
                     <DropdownMenu.Item className="gap-x-2">
                        <div className="flex flex-nowrap">
                           <PlusMini className="text-ui-fg-subtle mr-2" />Create Template from Existing
                        </div>
                     </DropdownMenu.Item>
                  </DropdownMenu.Content>
               </DropdownMenu> */}
               <Select onValueChange={editTemplate}>
                  <Select.Trigger>
                     <PlusMini /> Add Template &nbsp;
                  </Select.Trigger>
                  <Select.Content align="end">
                  {!response.isLoading && response.data.missing?.map((template) => {
                     return (
                        <Select.Item key={template} value={template}>{template}</Select.Item>
                     )
                  })}
                  </Select.Content>
               </Select>
            </div>
          </div>
         <Table>
            <Table.Header>
               <Table.Row>
                  <Table.HeaderCell>Event ID</Table.HeaderCell>
                  <Table.HeaderCell className="text-center">Subject</Table.HeaderCell>
                  <Table.HeaderCell className="text-center">Text</Table.HeaderCell>
                  <Table.HeaderCell className="text-center">HTML</Table.HeaderCell>
                  <Table.HeaderCell></Table.HeaderCell>
               </Table.Row>
            </Table.Header>
            <Table.Body>
            {!response.isLoading && response.data.templates?.map((template) => {
               return (
                  <Table.Row key={template.eventId} className="[&_td:last-child]:w-[1%] [&_td:last-child]:whitespace-nowrap pr-0 mr-0">
                     <Table.Cell>{template.eventId}</Table.Cell>
                     <Table.Cell>
                        {template.subject && <Check className="text-emerald-600 mx-auto" />}
                        {!template.subject && <NoSubjectTooltip><XMark className="text-rose-700 mx-auto" /></NoSubjectTooltip>}
                     </Table.Cell>
                     <Table.Cell>
                        {template.text && <Check className="text-emerald-600 mx-auto" />}
                        {!template.text && template.html && <NoTextTooltip><XMark className="text-amber-500 mx-auto" /></NoTextTooltip>}
                        {!template.text && !template.html && <NoBodyTooltip><XMark className="text-rose-700 mx-auto" /></NoBodyTooltip>}
                        </Table.Cell>
                     <Table.Cell>
                        {template.html && <Check className="text-emerald-600 mx-auto" />}
                        {!template.html && template.text && <NoHtmlTooltip><XMark className="text-amber-500 mx-auto" /></NoHtmlTooltip>}
                        {!template.html && !template.text && <NoBodyTooltip><XMark className="text-rose-700 mx-auto" /></NoBodyTooltip>}
                        </Table.Cell>
                     <Table.Cell className="text-right mr-0 pr-0">
                        <DropdownMenu>
                           <DropdownMenu.Trigger asChild>
                              <button>
                                 <EllipsisHorizontal />
                              </button>
                           </DropdownMenu.Trigger>
                           <DropdownMenu.Content align="end">
                              <DropdownMenu.Item className="gap-x-2">
                                 <button className="flex flex-nowrap">
                                    <ComputerDesktop className="text-ui-fg-subtle mr-2" />Preview
                                 </button>
                              </DropdownMenu.Item>
                              <DropdownMenu.Item className="gap-x-2">
                                 <button onClick={async() => editTemplate(template.templateId)} className="flex flex-nowrap">
                                    <PencilSquare className="text-ui-fg-subtle mr-2" />Edit
                                 </button>
                              </DropdownMenu.Item>
                              <DropdownMenu.Separator />
                              <DropdownMenu.Item className="gap-x-2 text-rose-700">
                                 <button onClick={async () => deleteTemplate(template.templateId)} className="flex flex-nowrap">
                                    <Trash className="text-rose-700 text-ui-fg-subtle mr-2" />Delete
                                 </button>
                              </DropdownMenu.Item>
                           </DropdownMenu.Content>
                        </DropdownMenu>
                     </Table.Cell>
                  </Table.Row>
               )
            })}
            </Table.Body>
         </Table>
      </Container>
   )
}

export default TemplateSettingsPage

export const config: SettingConfig = {
   card: {
      label: "Email Templates",
      description: "Manage some custom settings",
   }
}