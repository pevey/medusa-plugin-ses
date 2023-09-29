import { EventBusService, NotificationService } from "@medusajs/medusa"

class RestockNotification {
   protected readonly eventBus_: EventBusService
   protected readonly sesService_: NotificationService

   constructor({ eventBusService, sesService }) {
      this.eventBus_ = eventBusService   
      this.sesService_ = sesService  
      
      eventBusService.subscribe(
         "restock-notification.restocked",
         async (eventData) => {
            const templateId = await sesService.getTemplateId("restock-notification.restocked")
            if (!templateId) return
   
            const data = await sesService.fetchData("restock-notification.restocked", eventData, null)
            if (!data.emails) return
   
            return await Promise.all(
               data.emails.map(async (e) => {
                  const sendOptions = {
                     template_id: templateId,
                     from: sesService.options_.from,
                     to: e,
                     dynamic_template_data: data,
                  }
                  return await sesService.sendEmail(sendOptions)
               })
            )
         }
      )
   }
}
 
export default RestockNotification