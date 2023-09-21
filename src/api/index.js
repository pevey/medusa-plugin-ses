import cors from "cors"
import configLoader from "@medusajs/medusa/dist/loaders/config"
import { Router } from "express"
import bodyParser from "body-parser"
import { MedusaError } from "@medusajs/utils"
import { z } from "zod"

const router = Router()

export default (rootDirectory) => {
   const config = configLoader(rootDirectory)
   const pluginConfig = config.plugins.find((p) => p.resolve === "medusa-plugin-ses")
   const passKey = pluginConfig?.options.enable_endpoint

   router.use("/ses/send", bodyParser.json())
   router.post("/ses/send", (req, res) => {
      if (!passKey) {
         res.sendStatus(404)
      }

      const schema = z.object({
         passKey: z.string().min(1),
         template_id: z.string().min(1),
         from: z.string().min(1),
         to: z.string().min(1),
         data: z.object({}).passthrough(),
      })
      
      const { success, error, data } = schema.safeParse(req.body)
      if (!success) {
         throw new MedusaError(MedusaError.Types.INVALID_DATA, error)
      }

      if (passKey !== data.pass_key) {
         throw new MedusaError(MedusaError.Types.INVALID_DATA, 'Invalid passKey')
      }

      const sesService = req.scope.resolve("sesService")

      sesService.sendEmail(data.template_id, data.from, data.to, data.data).then((result) => {
         return res.json({
            result
         })
      })
   })

   return router
}