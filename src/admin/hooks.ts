import { useAdminCustomQuery, useAdminCustomPost, useAdminCustomDelete } from "medusa-react"

export const getTemplateSummary = () => {
   return useAdminCustomQuery (`/admin/ses/active-templates`, ["ses", "id"])
}

const useAdminOrderReactionSummary = (id: string) => {
   return useAdminCustomQuery<never, AdminGetOrderReactionOrderSummaryRes>(
     `/admin/order-reactions/${id}/summary`,
     ["order_reaction", id]
   );
 };
 
 const useAdminOrderReactions = (query: OrderReactionsFilterableFields) => {
   return useAdminCustomQuery<
     OrderReactionsFilterableFields,
     AdminListOrderReactionsRes
   >(`/admin/order-reactions`, ["order_reaction", "list"], query);
 };
 
 const useAdminOrderReactionDelete = (orderId: string, id: string) => {
   return useAdminCustomDelete(`/admin/order-reactions/${id}`, [
     "order_reaction",
     orderId,
   ]);
 };
 
 const useAdminCreateOrderReaction = (id: string) => {
   return useAdminCustomPost<
     AdminPostOrderReactionsOrderReq,
     AdminPostOrderReactionsOrderRes
   >(`/admin/order-reactions/${id}`, ["order_reaction", id]);
 };
 
 export {
   useAdminOrderReactionDelete,
   useAdminCreateOrderReaction,
   useAdminOrderReactionSummary,
   useAdminOrderReactions,
 }

 export type OrderReactionCreateData = {
   order_id: string;
   reaction: string;
   user_id: string;
 };
 
 export type OrderReactionsFilterableFields = {
   order_id?: string;
   reaction?: string;
   user_id?: string;
 };
 
 export type OrderReaction = {
   id: string;
   order_id: string;
   reaction: string;
   user_id: string;
   created_at: Date;
   updated_at: Date;
 };
 
 export type OrderReactionWithUser = OrderReaction & {
   user?: {
     id: string;
     name: string;
     email: string;
   };
 };
 
 export type AdminPostOrderReactionsOrderRes = {
   reaction: OrderReaction;
 };
 
 export type AdminPostOrderReactionsOrderReq = {
   reaction: string;
 };
 
 export type AdminListOrderReactionsRes = {
   reactions: OrderReactionWithUser[];
   count: number;
 };
 
 export type AdminGetOrderReactionOrderSummaryRes = {
   summary: OrderReactionSummary;
 };
 
 export type OrderReactionSummary = {
   reaction: string;
   count: number;
   user_has_reacted: boolean;
   user_reaction_id: string;
 }[];