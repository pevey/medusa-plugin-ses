import { Tooltip } from "@medusajs/ui"

const NoHtmlTooltip = (props:any) => {
   return (
      <Tooltip content="No HTML version of the message body is present.">
         {props.children}
      </Tooltip>
   )
}

export default NoHtmlTooltip