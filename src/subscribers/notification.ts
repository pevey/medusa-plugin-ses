import { NotificationService } from "@medusajs/medusa"

class NotificationSubscriber {
   protected readonly notificationService_: NotificationService

   constructor({ notificationService }) {
      this.notificationService_ = notificationService
      this.notificationService_.subscribe("batch.created", "ses")
      this.notificationService_.subscribe("batch.updated", "ses")
      this.notificationService_.subscribe("batch.canceled", "ses")
      this.notificationService_.subscribe("batch.pre_processed", "ses")
      this.notificationService_.subscribe("batch.confirmed", "ses")
      this.notificationService_.subscribe("batch.processing", "ses")
      this.notificationService_.subscribe("batch.completed", "ses")
      this.notificationService_.subscribe("batch.failed", "ses")
      this.notificationService_.subscribe("claim.created", "ses")
      this.notificationService_.subscribe("claim.updated", "ses")
      this.notificationService_.subscribe("claim.canceled", "ses")
      this.notificationService_.subscribe("claim.fulfillment_created", "ses")
      this.notificationService_.subscribe("claim.shipment_created", "ses")
      this.notificationService_.subscribe("claim.refund_processed", "ses")
      this.notificationService_.subscribe("customer.created", "ses")
      this.notificationService_.subscribe("customer.updated", "ses")
      this.notificationService_.subscribe("customer.password_reset", "ses")
      this.notificationService_.subscribe("gift_card.created", "ses")
      this.notificationService_.subscribe("invite.created", "ses")
      this.notificationService_.subscribe("order.placed", "ses")
      this.notificationService_.subscribe("order.updated", "ses")
      this.notificationService_.subscribe("order.canceled", "ses")
      this.notificationService_.subscribe("order.completed", "ses")
      this.notificationService_.subscribe("order.orders_claimed", "ses")
      this.notificationService_.subscribe("order.gift_card_created", "ses")
      this.notificationService_.subscribe("order.payment_captured", "ses")
      this.notificationService_.subscribe("order.payment_capture_failed", "ses")
      this.notificationService_.subscribe("order.fulfillment_created", "ses")
      this.notificationService_.subscribe("order.shipment_created", "ses")
      this.notificationService_.subscribe("order.fulfillment_canceled", "ses")
      this.notificationService_.subscribe("order.return_requested", "ses")
      this.notificationService_.subscribe("order.items_returned", "ses")
      this.notificationService_.subscribe("order.return_action_required", "ses")
      this.notificationService_.subscribe("order.refund_created", "ses")
      this.notificationService_.subscribe("order.refund_failed", "ses")
      this.notificationService_.subscribe("order.swap_created", "ses")
      this.notificationService_.subscribe("swap.created", "ses")
      this.notificationService_.subscribe("swap.received", "ses")
      this.notificationService_.subscribe("swap.fulfillment_created", "ses")
      this.notificationService_.subscribe("swap.shipment_created", "ses")
      this.notificationService_.subscribe("swap.payment_completed", "ses")
      this.notificationService_.subscribe("swap.payment_captured", "ses")
      this.notificationService_.subscribe("swap.payment_capture_failed", "ses")
      this.notificationService_.subscribe("swap.refund_processed", "ses")
      this.notificationService_.subscribe("swap.process_refund_failed", "ses")
      this.notificationService_.subscribe("user.created", "ses")
      this.notificationService_.subscribe("user.updated", "ses")
      this.notificationService_.subscribe("user.password_reset", "ses")
      this.notificationService_.subscribe("user.deleted", "ses")
   }
}
 
export default NotificationSubscriber