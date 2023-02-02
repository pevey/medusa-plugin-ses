"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = require("express");
var _bodyParser = _interopRequireDefault(require("body-parser"));
var _medusaCoreUtils = require("medusa-core-utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var router = (0, _express.Router)();
var _default = function _default(app) {
  router.use(_bodyParser["default"].json());
  router.post("/ses/send", function (req, res) {
    var sesService = req.scope.resolve("sesService");
    var schema = _medusaCoreUtils.Validator.object().keys({
      template_id: _medusaCoreUtils.Validator.string().required(),
      from: _medusaCoreUtils.Validator.string().required(),
      to: _medusaCoreUtils.Validator.string().required(),
      data: _medusaCoreUtils.Validator.object().optional()["default"]({})
    });
    var _schema$validate = schema.validate(req.body),
      value = _schema$validate.value,
      error = _schema$validate.error;
    if (error) {
      throw new _medusaCoreUtils.MedusaError(_medusaCoreUtils.MedusaError.Types.INVALID_DATA, error.details);
    }
    sesService.sendEmail(value.template_id, value.from, value.to, value.data).then(function (result) {
      return res.json({
        result: result
      });
    });
  });
  return router;
};
exports["default"] = _default;