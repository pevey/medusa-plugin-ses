import { Tooltip } from "@medusajs/ui"

const NoBodyTooltip = (props:any) => {
   return (
      <Tooltip content="This notification WILL NOT be sent.  An HTML template or text template for the message body must be present for a message to be sent.">
         {props.children}
      </Tooltip>
   )
}

export default NoBodyTooltip