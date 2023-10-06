import { useState } from "react"
import { Heading, Input, Label, Tabs, Table, Container, Button, IconButton, DropdownMenu, FocusModal, Select, useToggleState, usePrompt } from "@medusajs/ui"
import { PlusMini, XMark, Check, EllipsisHorizontal, PencilSquare, ComputerDesktop, Trash, CommandLine, BookOpen, Eye  } from "@medusajs/icons"
import { SettingConfig } from "@medusajs/admin"
import CodeMirror, { oneDark } from '@uiw/react-codemirror'
import { useSesTemplates, useSesTemplate, useSesTemplateDelete } from "../../hooks"
import NoSubjectTooltip from "../../components/NoSubjectTooltip"
import NoTextTooltip from "../../components/NoTextTooltip"
import NoHtmlTooltip from "../../components/NoHtmlTooltip"
import NoBodyTooltip from "../../components/NoBodyTooltip"
import defaultTemplates from "../../../constants/defaultTemplates"

const TemplateEditor = function({ 
   editOpen,
   closeEdit,
   activeTemplateId
}) {
   "use client"
   const response = useSesTemplate(activeTemplateId)
   const activeTemplate = response?.data?.template
   const initialSubject = activeTemplate?.subject || defaultTemplates[activeTemplateId]?.subject || defaultTemplates['fallback']?.subject
   const initialValue = activeTemplate?.mjml || defaultTemplates[activeTemplateId]?.mjml || defaultTemplates['fallback']?.mjml
   if (activeTemplate?.html && !activeTemplate?.mjml) {
      // warning
   }

   const onChange = function(val) {
      console.log(val)
   }

   const saveEdit = function() {
      console.log('save')
   }

   return (
      <FocusModal open={editOpen} onOpenChange={(modalOpened) => {
         if (!modalOpened) {
            closeEdit()
         }
      }}>
         <FocusModal.Content>
            <FocusModal.Header className="flex items-end">
               <div>
                  <Button onClick={closeEdit} variant="secondary">Discard</Button>
                  <Button onClick={saveEdit} className="ml-2">Save</Button>
               </div>
            </FocusModal.Header>
            <FocusModal.Body className="p-4 overflow-y-auto">
               <Heading level="h1" className="text-center">{activeTemplateId}</Heading>
               <div className="flex px-1 items-end">                     
                  <div className="flex-grow py-6">
                     <Label className="mt-4" weight="plus" htmlFor="subject">Subject</Label>
                     <Input name="subject" value={initialSubject} />
                  </div>
                  <div className="py-6 pl-2 ml-auto">
                     <IconButton size="large"><Eye /></IconButton>
                     <IconButton size="large" className="ml-2"><BookOpen /></IconButton>
                  </div>
               </div>
               <CodeMirror value={initialValue} height="auto" onChange={(val) => onChange(val)} theme={oneDark} className="text-[1rem] rounded-lg overflow-hidden" />
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
      setActiveTemplate(value)
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
               <Heading level="h1">Email Templates</Heading>
               <Heading level="h3" className="text-grey-50 pt-1.5">
                  Manage your email templates
               </Heading>
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
      description: "Manage email templates for notifications",
   }
}