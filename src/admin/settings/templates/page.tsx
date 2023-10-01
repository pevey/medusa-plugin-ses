import React from "react"
import { Container, Button, DropdownMenu } from "@medusajs/ui"
import { getTemplateSummary } from "../../hooks"
import { SettingConfig } from "@medusajs/admin"

const TemplateSettingsPage = () => {
   const response = getTemplateSummary()
console.log(response)
   const handleSelect = (event: Event) => {

   }

   return (
      <Container className="mb-4">
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