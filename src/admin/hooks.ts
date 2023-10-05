import { useAdminCustomQuery, useAdminCustomPost, useAdminCustomDelete } from "medusa-react"

export const useSesTemplate = (id: string) => {
   if (!id) return {}
   return useAdminCustomQuery (`/admin/ses/templates/${id}`, ["ses", id])
}

export const useSesTemplatePreview = (id: string) => {
   return useAdminCustomQuery (`/admin/ses/templates/${id}/preview`, ["ses", id])
}

export const useSesTemplateDelete = (id: string) => {
   return useAdminCustomDelete (`/admin/ses/templates/${id}`, ["ses", id])
}

export const useSesTemplateCreate = ({ templateId, subject, html, text }) => {
   return useAdminCustomPost (`/admin/ses/templates`, ["ses", "create"])
}

export const useSesTemplateUpdate = ({ templateId, subject, html, text }) => {
   return useAdminCustomPost (`/admin/ses/templates/${templateId}`, ["ses", "update"])
}

export const useSesTemplates = () => {
   return useAdminCustomQuery (`/admin/ses/templates`, ["ses", "list"])
}