import cors from "cors"
import { json, Router } from "express"
import { z } from "zod"
import { getConfigFile } from "medusa-core-utils"
import { ConfigModule, authenticate } from "@medusajs/medusa"
import { MedusaError } from "@medusajs/utils"
import { SESOptions } from "../services/ses"

const router = Router()

export default (rootDirectory: string): Router | Router[] => {
   const { configModule } = getConfigFile<ConfigModule>(rootDirectory, "medusa-config")
   const { projectConfig } = configModule
   const adminCorsOptions = { origin: projectConfig.admin_cors.split(","), credentials: true }
   const sesConfig: SESOptions = configModule.plugins.find((p: any) => p.resolve === "medusa-plugin-ses")['options']
   const passKey = sesConfig.enable_endpoint
   // const templatePath = pluginConfig.template_path
   // const partialPath = pluginConfig.partial_path

   router.use("/admin/ses/", cors(adminCorsOptions, authenticate()))
   
   // ADMIN - GET ALL ACTIVE TEMPLATES
   router.get("/admin/ses/active-templates", async (req, res) => {   
      const sesService = req.scope.resolve("sesService")
      let templates = await sesService.listActiveTemplates()
      console.log(templates)
      return res.json({ templates })
   })








   // ENDPOINT FOR TESTING TEMPLATES - NO AUTH!!! - REQUIRES PASSKEY
   router.post("/ses/send", json(), async (req, res) => {
      if (!passKey) {
         res.sendStatus(404)
      }
      const schema = z.object({
         pass_key: z.string().min(1),
         template_id: z.string().min(1),
         from: z.string().min(1),
         to: z.string().min(1),
         data: z.object({}).passthrough(),
      })
      // @ts-ignore
      const { success, error, data } = schema.safeParse(req.body)
      if (!success) {
         throw new MedusaError(MedusaError.Types.INVALID_DATA, error)
      }
      if (passKey !== data.pass_key) {
         throw new MedusaError(MedusaError.Types.INVALID_DATA, 'Invalid passKey')
      }
      const sesService = req.scope.resolve("sesService")
      sesService.sendEmail(data.template_id, data.from, data.to, data.data, true).then((result) => {
         return res.json({ result })
      })
   })

   return router
}