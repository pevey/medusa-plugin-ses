import cors from "cors"
import { json, Router } from "express"
import { z } from "zod"
import { getConfigFile } from "medusa-core-utils"
import { ConfigModule, authenticate } from "@medusajs/medusa"
import { MedusaError } from "@medusajs/utils"
import { SESOptions } from "../services/ses"

const router = Router()

export default (rootDirectory: string): Router | Router[] => {
   // const { configModule } = getConfigFile<ConfigModule>(rootDirectory, "medusa-config")
   // const { projectConfig } = configModule
   const { configModule: { projectConfig, plugins } } = getConfigFile(rootDirectory, "medusa-config") as { configModule: ConfigModule }
   const adminCorsOptions = { origin: projectConfig.admin_cors.split(","), credentials: true }
   // const sesConfig: SESOptions = configModule.plugins.find((p: any) => p.resolve === "medusa-plugin-ses")['options']
   const sesConfig: SESOptions = plugins.find((p: any) => p.resolve === "medusa-plugin-ses")['options']
   const passKey = sesConfig.enable_endpoint

   router.use("/admin/ses/", cors(adminCorsOptions), authenticate())

   // ADMIN - GET TEMPLATE PREVIEW
   router.get("/admin/ses/templates/:id/preview", async (req, res) => {
      const schema = z.object({
         id: z.string().min(1).max(100),
      })
      // @ts-ignore
      const { success, error, data } = schema.safeParse({ id: req.params.id })
      if (!success) {
         throw new MedusaError(MedusaError.Types.INVALID_DATA, error)
      }
      const sesService = req.scope.resolve("sesService")
      let template = await sesService.getTemplate(data.id)
      res.set('Content-Type', 'text/html')
      res.send(Buffer.from(template.html))
   })

   // ADMIN - GET TEMPLATE
   router.get("/admin/ses/templates/:id", async (req, res) => {
      const schema = z.object({
         id: z.string().min(1).max(100),
      })
      // @ts-ignore
      const { success, error, data } = schema.safeParse({ id: req.params.id })
      if (!success) {
         throw new MedusaError(MedusaError.Types.INVALID_DATA, error)
      }
      const sesService = req.scope.resolve("sesService")
      let template = await sesService.getTemplate(data.id)
      return res.json({ template })
   })

   // ADMIN - DELETE TEMPLATE
   router.delete("/admin/ses/templates/:id", async (req, res) => {
      const schema = z.object({
         id: z.string().min(1).max(100),
      })
      // @ts-ignore
      const { success, error, data } = schema.safeParse({ id: req.params.id })
      if (!success) {
         throw new MedusaError(MedusaError.Types.INVALID_DATA, error)
      }
      const sesService = req.scope.resolve("sesService")
      let result = await sesService.deleteTemplate(data.id)
      return res.json({ result })
   })

   // ADMIN - CREATE TEMPLATE
   router.use("/admin/ses/templates", json())
   router.post("/admin/ses/templates", async (req, res) => {
      const schema = z.object({
         templateId: z.string().min(1),
         subject: z.string(),
         html: z.string(),
         text: z.string(),
      })
      // @ts-ignore
      const { success, error, data } = schema.safeParse(req.body)
      if (!success) {
         throw new MedusaError(MedusaError.Types.INVALID_DATA, error)
      }
      const sesService = req.scope.resolve("sesService")
      let template = await sesService.createTemplate(data.templateId, data.subject, data.html, data.text)
      return res.json({ template })
   })

   // ADMIN - UPDATE TEMPLATE
   router.use("/admin/ses/templates/:id", json())
   router.post("/admin/ses/templates/:id", async (req, res) => {
      const schema = z.object({
         templateId: z.string().min(1),
         subject: z.string(),
         html: z.string(),
         text: z.string(),
      })
      // @ts-ignore
      const { success, error, data } = schema.safeParse({...req.body, templateId: req.params.id })
      if (!success) {
         throw new MedusaError(MedusaError.Types.INVALID_DATA, error)
      }
      const sesService = req.scope.resolve("sesService")
      let template = await sesService.updateTemplate(req.params.id, data.subject, data.html, data.text)
      return res.json({ template })
   })
   
   // ADMIN - GET ALL ACTIVE TEMPLATES
   router.get("/admin/ses/templates", async (req, res) => {   
      const sesService = req.scope.resolve("sesService")
      let response = await sesService.listTemplates()
      return res.json(response)
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