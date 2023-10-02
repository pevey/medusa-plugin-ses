import { Table, Container, Badge, Button, DropdownMenu } from "@medusajs/ui"
import { PlusMini, XMark, Check } from "@medusajs/icons"
import NoSubjectTooltip from "../../components/tooltips/nosubject"
import NoTextTooltip from "../../components/tooltips/notext"
import NoHtmlTooltip from "../../components/tooltips/nohtml"
import NoBodyTooltip from "../../components/tooltips/nobody"
import ActionMenu from "../../components/actionmenu"
import { getTemplateSummary } from "../../hooks"
import { SettingConfig } from "@medusajs/admin"

const TemplateSettingsPage = () => {
   "use client"
   const response = getTemplateSummary()
console.log(response)
   const handleSelect = (event: Event) => {

   }

   return (
      <Container className="mb-4">
         <div className="flex items-start justify-between mb-6">
            <div>
               <h1 className="inter-xlarge-semibold text-grey-90">Email Templates</h1>
               <h3 className="inter-small-regular text-grey-50 pt-1.5">
                  Manage your email templates
               </h3>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="secondary"><PlusMini /> Add Notification</Button>
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
                  <Table.Row key={template.name} className="[&_td:last-child]:w-[1%] [&_td:last-child]:whitespace-nowrap pr-0 mr-0">
                     <Table.Cell>{template.name}</Table.Cell>
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
                        <ActionMenu />
                     </Table.Cell>
                  </Table.Row>
               )
            })}
            </Table.Body>
         </Table>
         <div className="flex gap-2">
            {/* {!response.isLoading &&
               response.data.summary?.map((reaction) => (
                  <ReactionBadge
                     key={reaction.reaction}
                     orderId={order.id}
                     reaction={reaction.reaction}
                     count={reaction.count}
                     userHasReacted={reaction.user_has_reacted}
                     userReactionId={reaction.user_reaction_id}
                  />
            ))} */}
            <DropdownMenu>
               <DropdownMenu.Trigger>
                  <Button variant="transparent">
                     {/* <FaceSmile /> */}
                  </Button>
               </DropdownMenu.Trigger>
               <DropdownMenu.Content className="flex">
                  <DropdownMenu.Item onSelect={handleSelect}>👍</DropdownMenu.Item>
                  <DropdownMenu.Item onSelect={handleSelect}>💰</DropdownMenu.Item>
                  <DropdownMenu.Item onSelect={handleSelect}>😍</DropdownMenu.Item>
                  <DropdownMenu.Item onSelect={handleSelect}>🎉</DropdownMenu.Item>
                  <DropdownMenu.Item onSelect={handleSelect}>🚀</DropdownMenu.Item>
                  <DropdownMenu.Item onSelect={handleSelect}>🛑</DropdownMenu.Item>
                  <DropdownMenu.Item onSelect={handleSelect}>👎</DropdownMenu.Item>
                  <DropdownMenu.Item onSelect={handleSelect}>😭</DropdownMenu.Item>
               </DropdownMenu.Content>
            </DropdownMenu>
         </div>
      </Container>
   )
}

export default TemplateSettingsPage

export const config: SettingConfig = {
   card: {
      label: "Email Templates",
      description: "Manage some custom settings",
   },
}