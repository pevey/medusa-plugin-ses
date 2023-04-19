import { Router } from "express"
import bodyParser from "body-parser"
import { MedusaError } from "medusa-core-utils"
import {z } from "zod"

const router = Router()

export default (app) => {
	router.use(bodyParser.json())

	router.post("/ses/send",(req, res) => {
		const sesService = req.scope.resolve("sesService")

		const schema = z.object({
			template_id: z.string().min(1),
			from: z.string().min(1),
			to: z.string().min(1),
			data: z.object({}).required().default({}),
		})

		const { success, error, data } = schema.safeParse(req.body)
		if (!success) {
			throw new MedusaError(MedusaError.Types.INVALID_DATA, error)
		}

		//return res.json(data)

		sesService.sendEmail(data.template_id, data.from, data.to, data.data).then((result) => {
			return res.json({
			result
			})
		})
	})

	return router
}