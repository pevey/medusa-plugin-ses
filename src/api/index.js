import { Router } from "express"
import bodyParser from "body-parser"
import { Validator, MedusaError } from "medusa-core-utils"

const router = Router()

export default (app) => {
  router.use(bodyParser.json())

  router.post("/ses/send",(req, res) => {
    const sesService = req.scope.resolve("sesService")

    const schema = Validator.object().keys({
      template_id: Validator.string().required(),
      from: Validator.string().required(),
      to: Validator.string().required(),
      data: Validator.object().optional().default({}),
    })
  
    const { value, error } = schema.validate(req.body)
    if (error) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
    }

    sesService.sendEmail(req.body.template_id, req.body.from, req.body.to, req.body.data).then((result) => {
      return res.json({
        result
      })
    })
  })

  return router
}