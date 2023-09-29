import { NotificationService } from "@medusajs/medusa"

class NotificationSubscriber {
   protected readonly notificationService_: NotificationService

   constructor({ notificationService }) {
      this.notificationService_ = notificationService
      this.notificationService_.subscribe("claim.shipment_created", "ses")
      this.notificationService_.subscribe("customer.password_reset", "ses")
      this.notificationService_.subscribe("order.canceled", "ses")
      this.notificationService_.subscribe("order.gift_card_created", "ses")
      this.notificationService_.subscribe("order.items_returned", "ses")
      this.notificationService_.subscribe("order.placed", "ses")
      this.notificationService_.subscribe("order.refund_created", "ses")
      this.notificationService_.subscribe("order.return_requested", "ses")
      this.notificationService_.subscribe("order.shipment_created", "ses")
   }
}
 
export default NotificationSubscriber