class UserSubscriber {
   constructor({ sesService, eventBusService }) {
      this.sesService_ = sesService
   
      this.eventBus_ = eventBusService
   
      this.eventBus_.subscribe("user.password_reset", async (data) => {
         await this.sesService_.sendNotification(
            "user.password_reset",
            data,
            null
         )
      })
   }
 }
 
 export default UserSubscriber