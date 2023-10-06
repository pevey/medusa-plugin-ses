import { Lifetime } from "awilix"
import { TransactionBaseService } from "@medusajs/medusa"
import { humanizeAmount, zeroDecimalCurrencies } from "medusa-core-utils"
import type { 
   BatchJobService,
   CartService, 
   ClaimService, 
   FulfillmentService, 
   FulfillmentProviderService, 
   GiftCardService,
   LineItemService, 
   OrderService, 
   ProductVariantService, 
   ReturnService, 
   StoreService, 
   SwapService, 
   TotalsService,
   UserService
} from '@medusajs/medusa/dist/services'

class NotificationDataService extends TransactionBaseService {
   static identifier = "notificationDataService"
   static LIFE_TIME = Lifetime.SCOPED

   protected readonly batchJobService_: BatchJobService
   protected readonly cartService_: CartService
   protected readonly claimService_: ClaimService
   protected readonly fulfillmentService_: FulfillmentService
   protected readonly fulfillmentProviderService_: FulfillmentProviderService
   protected readonly giftCardService_: GiftCardService
   protected readonly lineItemService_: LineItemService
   protected readonly orderService_: OrderService
   protected readonly productVariantService_: ProductVariantService
   protected readonly returnService_: ReturnService
   protected readonly storeService_: StoreService
   protected readonly swapService_: SwapService
   protected readonly totalsService_: TotalsService
   protected readonly userService_: UserService

   constructor({
      cartService,
      claimService,
      fulfillmentService,
      fulfillmentProviderService,
      giftCardService,
      lineItemService,
      orderService,
      productVariantService,
      returnService,
      storeService,
      swapService,
      totalsService,
      userService
   }) {
      super(arguments[0])
      this.cartService_ = cartService
      this.claimService_ = claimService
      this.fulfillmentService_ = fulfillmentService
      this.fulfillmentProviderService_ = fulfillmentProviderService
      this.giftCardService_ = giftCardService
      this.lineItemService_ = lineItemService
      this.orderService_ = orderService
      this.productVariantService_ = productVariantService
      this.returnService_ = returnService
      this.storeService_ = storeService
      this.swapService_ = swapService
      this.totalsService_ = totalsService,
      this.userService_ = userService
   }

   async fetchData(event, data, attachmentGenerator) {
      const noun = event.split(".")[0]
      switch (noun) {
         case "batch":
            return await this.getBatchData(event, data, attachmentGenerator)
         case "claim":
            return await this.getClaimData(event, data, attachmentGenerator)
         case "customer":
            return this.getCustomerData(event, data, attachmentGenerator)
         case "gift_card":
            return await this.getGiftCardData(event, data, attachmentGenerator)
         case"invite":
            return this.getInviteData(event, data, attachmentGenerator)
         case "order":
            return await this.getOrderData(event, data, attachmentGenerator)
         case "restock-notification":
            return await this.getRestockNotificationData(event, data, attachmentGenerator)
         case "swap":
            return await this.getSwapData(event, data, attachmentGenerator)
         case "user":
            return this.getUserData(event, data, attachmentGenerator)
         default:
            return {}
      }
   }

   async getBatchData(event, data, attachmentGenerator) {
      const job = await this.batchJobService_.retrieve(data.id)
      if (!job.created_by) return
      const user = await this.userService_.retrieve(job.created_by)
      if (!user) return
      return { ...data, ...job, email: user.email }
   }

   async getClaimData(event, data, attachmentGenerator) {
      const verb = event.split(".")[1]
      const claim = await this.claimService_.retrieve(data.id, {
         relations: ["order", "order.items", "order.shipping_address"]
      })
      const locale = await this.extractLocale(claim.order)
      const shipment = (verb == "shipment_created")
         ? await this.fulfillmentService_.retrieve(data.fulfillment_id, {
               relations: ["tracking_links"]
            })
         : null
      return {
         locale,
         email: claim.order.email,
         claim,
         order: claim.order,
         fulfillment: shipment,
         tracking_links: shipment.tracking_links,
         tracking_number: shipment.tracking_numbers.join(", "),
      }
   }

   getCustomerData(event, data, attachmentGenerator) {
      return data
   }

   async getGiftCardData(event, data, attachmentGenerator) {
      const giftCard = await this.giftCardService_.retrieve(data.id, { relations: ["region", "order"] })
      const taxRate = giftCard.region.tax_rate / 100
      const locale = giftCard.order? await this.extractLocale(giftCard.order) : null
      const email = giftCard.order? giftCard.order.email : giftCard.metadata.email
      return { 
         ...giftCard, 
         locale, 
         email, 
         display_value: `${this.humanPrice_(giftCard.value * 1 + taxRate, giftCard.region.currency_code)} ${giftCard.region.currency_code}`,
         message: giftCard.metadata?.message || giftCard.metadata?.personal_message 
      } 
   }

   getInviteData(event, data, attachmentGenerator) {
      return { ...data, email: data.user_email }
   }

   async getOrderData(event, data, attachmentGenerator) {
      const verb = event.split(".")[1]
      if (verb === "refund_created") {
         const order = await this.orderService_.retrieveWithTotals(data.id, {
            select: [
               "total",
            ],
            relations: [
               "refunds",
               "items",
            ]
         })
         const refund = order.refunds.find((refund) => refund.id === data.refund_id)
         return {
            order,
            refund,
            refund_amount: `${this.humanPrice_(refund.amount, order.currency_code)} ${order.currency_code}`,
            email: order.email
         }
      } else {
         const order = await this.orderService_.retrieve(data.id, {
            select: [
               "shipping_total",
               "discount_total",
               "tax_total",
               "refunded_total",
               "gift_card_total",
               "subtotal",
               "total",
            ],
            relations: [
               "customer",
               "billing_address",
               "shipping_address",
               "discounts",
               "discounts.rule",
               "shipping_methods",
               "shipping_methods.shipping_option",
               "payments",
               "fulfillments",
               "returns",
               "gift_cards",
               "gift_card_transactions",
            ],
         })
         const currencyCode = order.currency_code.toUpperCase()
         const locale = await this.extractLocale(order)
         if (verb === "return_requested" || verb === "items_returned" || verb === "return_action_required") {
            const returnRequest = await this.returnService_.retrieve(data.return_id, {
               relations: [
                  "items",
                  "items.item",
                  "items.item.tax_lines",
                  "items.item.variant",
                  "items.item.variant.product",
                  "shipping_method",
                  "shipping_method.tax_lines",
                  "shipping_method.shipping_option",
               ],
            })
            const allItems = await this.lineItemService_.list(
               { id: returnRequest.items.map(({ item_id }) => item_id)},
               { relations: ["tax_lines"] }
            )
            // Calculate which items are in the return
            let items = await Promise.all(
               returnRequest.items.map(async (i) => {
                  const found: any = allItems.find((oi) => oi.id === i.item_id)
                  found.quantity = i.quantity
                  found.thumbnail = this.normalizeThumbUrl_(found.thumbnail)
                  found.totals = await this.totalsService_.getLineItemTotals(
                     found,
                     order,
                     {
                        include_tax: true,
                        use_tax_lines: true,
                     }
                  )
                  found.price = `${this.humanPrice_(
                     found.totals.total,
                     currencyCode
                  )} ${currencyCode}`
                  found.tax_lines = found.totals.tax_lines
                  return found
               })
            )
            const item_subtotal = items.reduce(
               (acc, next) => acc + next.totals.total,
               0
            )
            let shippingTotal = 0
            if (returnRequest.shipping_method) {
               const base = returnRequest.shipping_method.price
               shippingTotal =
               base +
               returnRequest.shipping_method.tax_lines.reduce((acc, next) => {
                  return Math.round(acc + base * (next.rate / 100))
               }, 0)
            }
            return {
               locale,
               has_shipping: !!returnRequest.shipping_method,
               email: order.email,
               items,
               subtotal: `${this.humanPrice_(item_subtotal, currencyCode)} ${currencyCode}`,
               shipping_total: `${this.humanPrice_(shippingTotal, currencyCode)} ${currencyCode}`,
               refund_amount: `${this.humanPrice_(returnRequest.refund_amount, currencyCode)} ${currencyCode}`,
               return_request: {
                  ...returnRequest,
                  refund_amount: `${this.humanPrice_(returnRequest.refund_amount, currencyCode)} ${currencyCode}`,
               },
               order,
               date: returnRequest.updated_at.toDateString(),
            }
         } else {
            const taxRate = order.tax_rate / 100
            let items = await Promise.all(
               order.items.map(async (i: any) => {
                  i.totals = await this.totalsService_.getLineItemTotals(i, order, {
                     include_tax: true,
                     use_tax_lines: true,
                  })
                  i.thumbnail = this.normalizeThumbUrl_(i.thumbnail)
                  i.discounted_price = `${this.humanPrice_(i.totals.total / i.quantity, currencyCode)} ${currencyCode}`
                  i.price = `${this.humanPrice_(i.totals.original_total / i.quantity, currencyCode)} ${currencyCode}`
                  return i
               })
            )
            let discounts = []
            if (order.discounts) {
               discounts = order.discounts.map((discount) => {
                  return {
                     is_giftcard: false,
                     code: discount.code,
                     descriptor: `${discount.rule.value}${
                        discount.rule.type === "percentage" ? "%" : ` ${currencyCode}`
                     }`,
                  }
               })
            }
            let giftCards = []
            if (order.gift_cards) {
               giftCards = order.gift_cards.map((gc) => {
                  return {
                     is_giftcard: true,
                     code: gc.code,
                     descriptor: `${gc.value} ${currencyCode}`,
                  }
               })
               discounts.concat(giftCards)
            }
            return {
               ...order,
               locale,
               has_discounts: order.discounts.length,
               has_gift_cards: order.gift_cards.length,
               date: order.created_at.toDateString(),
               items,
               discounts,
               subtotal: `${this.humanPrice_(order.subtotal * (1 + taxRate), currencyCode)} ${currencyCode}`,
               gift_card_total: `${this.humanPrice_(order.gift_card_total * (1 + taxRate), currencyCode)} ${currencyCode}`,
               tax_total: `${this.humanPrice_(order.tax_total, currencyCode)} ${currencyCode}`,
               discount_total: `${this.humanPrice_(order.discount_total * (1 + taxRate), currencyCode)} ${currencyCode}`,
               shipping_total: `${this.humanPrice_(order.shipping_total * (1 + taxRate), currencyCode)} ${currencyCode}`,
               total: `${this.humanPrice_(order.total, currencyCode)} ${currencyCode}`,
            }
         }
      }
   }

   async getRestockNotificationData(event, data, attachmentGenerator) {
      const variant = await this.productVariantService_.retrieve(data.variant_id, {
         relations: ["product"],
      })

      const thumb = (variant.product.thumbnail)? this.normalizeThumbUrl_(variant.product.thumbnail) : null

      return {
         product: {
            ...variant.product,
            thumbnail: thumb,
         },
         variant,
         variant_id: data.variant_id,
         emails: data.emails,
      }
   }

   async getSwapData(event, data, attachmentGenerator) {
      const store = await this.storeService_.retrieve()
      const swap = await this.swapService_.retrieve(data.id, {
         relations: [
            "additional_items",
            "additional_items.tax_lines",
            "return_order",
            "return_order.items",
            "return_order.items.item",
            "return_order.shipping_method",
            "return_order.shipping_method.shipping_option",
         ],
      })

      const returnRequest = swap.return_order

      const items = await this.lineItemService_.list(
         {
            id: returnRequest.items.map(({ item_id }) => item_id),
         },
         {
            relations: ["tax_lines"],
         }
      )

      returnRequest.items = returnRequest.items.map((item) => {
         const found = items.find((i) => i.id === item.item_id)
         return {
            ...item,
            item: found,
         }
      })

      const swapLink = store.swap_link_template.replace(/\{cart_id\}/, swap.cart_id)

      const order = await this.orderService_.retrieve(swap.order_id, {
         select: ["total"],
         relations: [
            "items",
            "items.tax_lines",
            "discounts",
            "discounts.rule",
            "shipping_address",
            "swaps",
            "swaps.additional_items",
            "swaps.additional_items.tax_lines",
         ],
      })

      const cart = await this.cartService_.retrieve(swap.cart_id, {
         select: [
            "total",
            "tax_total",
            "discount_total",
            "shipping_total",
            "subtotal",
         ],
      })
      const currencyCode = order.currency_code.toUpperCase()

      const decoratedItems = await Promise.all(
         cart.items.map(async (i) => {
         const totals = await this.totalsService_.getLineItemTotals(i, cart, {
            include_tax: true,
         })

         return {
            ...i,
            totals,
            tax_lines: totals.tax_lines,
            price: `${this.humanPrice_(totals.original_total / i.quantity, currencyCode)} ${currencyCode}`,
            discounted_price: `${this.humanPrice_(totals.total / i.quantity, currencyCode)} ${currencyCode}`,
         }
         })
      )

      const returnTotal = decoratedItems.reduce((acc, next) => {
         const { total } = next.totals
         if (next.is_return && next.variant_id) {
            return acc + -1 * total
         }
         return acc
      }, 0)

      const additionalTotal = decoratedItems.reduce((acc, next) => {
         const { total } = next.totals
         if (!next.is_return) {
            return acc + total
         }
         return acc
      }, 0)

      const refundAmount = swap.return_order.refund_amount

      const locale = await this.extractLocale(order)

      return {
         locale,
         swap,
         order,
         return_request: returnRequest,
         date: swap.updated_at.toDateString(),
         swap_link: swapLink,
         email: order.email,
         items: decoratedItems.filter((di) => !di.is_return),
         return_items: decoratedItems.filter((di) => di.is_return),
         return_total: `${this.humanPrice_(returnTotal, currencyCode)} ${currencyCode}`,
         refund_amount: `${this.humanPrice_(refundAmount, currencyCode)} ${currencyCode}`,
         additional_total: `${this.humanPrice_(additionalTotal, currencyCode)} ${currencyCode}`,
      }
   }

   getUserData(event, data, attachmentGenerator) {
      return data
   }

   async fetchAttachments(event, data, attachmentGenerator) {
      switch (event) {
         case "swap.created":
         case "order.return_requested": {
            let attachments = []
            const { shipping_method, shipping_data } = data.return_request
            if (shipping_method) {
               const provider = shipping_method.shipping_option.provider_id

               const lbl = await this.fulfillmentProviderService_.retrieveDocuments(
                  provider,
                  shipping_data,
                  "label"
               )

               attachments = attachments.concat(
                  lbl.map((d) => ({
                     name: "return-label",
                     base64: d.base_64,
                     type: d.type,
                  }))
               )
            }

            if (attachmentGenerator && attachmentGenerator.createReturnInvoice) {
               const base64 = await attachmentGenerator.createReturnInvoice(
                  data.order,
                  data.return_request.items
               )
               attachments.push({
                  name: "invoice",
                  base64,
                  type: "application/pdf",
               })
            }

            return attachments
         }
         default:
         return []
      }
   }

   processItems_(items, taxRate, currencyCode) {
      return items.map((i) => {
         return {
            ...i,
            thumbnail: this.normalizeThumbUrl_(i.thumbnail),
            price: `${this.humanPrice_(i.unit_price * (1 + taxRate), currencyCode)} ${currencyCode}`,
         }
      })
   }

   humanPrice_(amount, currency) {
      if (!amount) {
         return "0.00"
      }

      const normalized = humanizeAmount(amount, currency)
      return normalized.toFixed(
         zeroDecimalCurrencies.includes(currency.toLowerCase()) ? 0 : 2
      )
   }

   normalizeThumbUrl_(url) {
      if (!url) {
         return null
      }

      if (url.startsWith("http")) {
         return url
      } else if (url.startsWith("//")) {
         return `https:${url}`
      }
      return url
   }

   async extractLocale(fromOrder) {
      if (fromOrder.cart_id) {
         try {
            const cart = await this.cartService_.retrieve(fromOrder.cart_id, {
               select: ["id", "context"],
            })

            if (cart.context && cart.context.locale) {
               return cart.context.locale
            }
         } catch (err) {
            console.log(err)
            console.warn("Failed to gather context for order")
            return null
         }
      }
      return null
   }
}

export default NotificationDataService