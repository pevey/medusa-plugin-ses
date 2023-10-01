import { RouteConfig } from "@medusajs/admin"
import Star from "../../components/star"

const MailPage = () => {
  return (
    <div>
      This is my custom route
    </div>
  )
}

export const config: RouteConfig = {
  link: {
    label: "Templates",
    icon: Star,
  },
}

export default MailPage