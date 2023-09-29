import configLoader from "@medusajs/medusa/dist/loaders/config"
import { json, Router } from "express"
import { MedusaError } from "@medusajs/utils"
import { z } from "zod"
import { SESOptions } from "../services/ses"

const router = Router()

export default (rootDirectory: string): Router | Router[] => {
   const config = configLoader(rootDirectory)
   const pluginConfig: SESOptions = config.plugins.find((p: any) => p.resolve === "medusa-plugin-ses")['options']
   const passKey = pluginConfig.enable_endpoint

   router.use("/ses/send", json())
   router.post("/ses/send", (req, res) => {
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
         return res.json({
            result
         })
      })
   })

   return router
}