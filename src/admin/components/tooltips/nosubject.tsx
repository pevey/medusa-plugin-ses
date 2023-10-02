import { Tooltip } from "@medusajs/ui"

const NoSubjectTooltip = (props:any) => {
   return (
      <Tooltip content="This notification WILL NOT be sent.  A subject template must be present for a message to be sent.">
         {props.children}
      </Tooltip>
   )
}

export default NoSubjectTooltip