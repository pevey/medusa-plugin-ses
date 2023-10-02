import { Tooltip } from "@medusajs/ui"

const NoTextTooltip = (props:any) => {
   return (
      <Tooltip content="It is recommended to also send a text version of the message for better accessibility.  Both versions of a message can be sent, and a recipient's email client will determine which version is presented.">
         {props.children}
      </Tooltip>
   )
}

export default NoTextTooltip