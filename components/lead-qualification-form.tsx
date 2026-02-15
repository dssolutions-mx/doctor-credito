"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { GlassCard } from "@/components/glass-card"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

interface LeadQualificationFormProps {
  leadId: string
  lead?: {
    has_other_employment?: boolean
    has_company?: boolean
    company_name?: string
    has_cosigner?: boolean
    has_driver_license?: boolean
    has_id?: boolean
    has_passport?: boolean
    has_ssn?: boolean
    has_tax_id?: boolean
    lead_employments?: Array<{
      id: string
      employer_name: string | null
      payment_method: string | null
      payment_period: string | null
      income_value: number | null
      tenure_months: number | null
      is_primary: boolean | null
    }>
    lead_bank_accounts?: Array<{
      id: string
      bank_name: string | null
      tenure_months: number | null
      is_shared_account: boolean | null
      is_company_account: boolean | null
    }>
    lead_vehicle_interests?: Array<{
      id: string
      make: string | null
      model: string | null
      color: string | null
      vehicle_type: string | null
      year: number | null
    }>
  }
  onSuccess?: () => void
}

export function LeadQualificationForm({ leadId, lead, onSuccess }: LeadQualificationFormProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [primaryJob, setPrimaryJob] = useState({
    employer_name: "",
    payment_method: "",
    payment_period: "",
    income_value: "",
    tenure_months: "",
  })
  const [secondaryJob, setSecondaryJob] = useState({
    employer_name: "",
    payment_method: "",
    payment_period: "",
    income_value: "",
    tenure_months: "",
  })
  const [hasOtherEmployment, setHasOtherEmployment] = useState(false)
  const [hasCompany, setHasCompany] = useState(false)
  const [companyName, setCompanyName] = useState("")
  const [bankAccount, setBankAccount] = useState({
    bank_name: "",
    tenure_months: "",
    is_shared_account: false,
    is_company_account: false,
  })
  const [legalDocs, setLegalDocs] = useState({
    has_driver_license: false,
    has_id: false,
    has_passport: false,
    has_ssn: false,
    has_tax_id: false,
  })
  const [vehicleInterests, setVehicleInterests] = useState<Array<{ make: string; model: string; color: string; vehicle_type: string }>>([{ make: "", model: "", color: "", vehicle_type: "" }])
  const [hasCosigner, setHasCosigner] = useState(false)

  useEffect(() => {
    if (lead) {
      setHasOtherEmployment(lead.has_other_employment ?? false)
      setHasCompany(lead.has_company ?? false)
      setCompanyName(lead.company_name || "")
      setHasCosigner(lead.has_cosigner ?? false)
      setLegalDocs({
        has_driver_license: lead.has_driver_license ?? false,
        has_id: lead.has_id ?? false,
        has_passport: lead.has_passport ?? false,
        has_ssn: lead.has_ssn ?? false,
        has_tax_id: lead.has_tax_id ?? false,
      })
      if (lead.lead_employments?.length) {
        const primary = lead.lead_employments.find((e) => e.is_primary) || lead.lead_employments[0]
        setPrimaryJob({
          employer_name: primary.employer_name || "",
          payment_method: primary.payment_method || "",
          payment_period: primary.payment_period || "",
          income_value: primary.income_value?.toString() || "",
          tenure_months: primary.tenure_months?.toString() || "",
        })
        const secondary = lead.lead_employments.find((e) => !e.is_primary)
        if (secondary) {
          setHasOtherEmployment(true)
          setSecondaryJob({
            employer_name: secondary.employer_name || "",
            payment_method: secondary.payment_method || "",
            payment_period: secondary.payment_period || "",
            income_value: secondary.income_value?.toString() || "",
            tenure_months: secondary.tenure_months?.toString() || "",
          })
        }
      }
      if (lead.lead_bank_accounts?.length) {
        const b = lead.lead_bank_accounts[0]
        setBankAccount({
          bank_name: b.bank_name || "",
          tenure_months: b.tenure_months?.toString() || "",
          is_shared_account: b.is_shared_account ?? false,
          is_company_account: b.is_company_account ?? false,
        })
      }
      if (lead.lead_vehicle_interests?.length) {
        setVehicleInterests(
          lead.lead_vehicle_interests.map((v) => ({
            make: v.make || "",
            model: v.model || "",
            color: v.color || "",
            vehicle_type: v.vehicle_type || "",
          }))
        )
      }
    }
  }, [lead])

  const addVehicle = () => {
    setVehicleInterests((prev) => [...prev, { make: "", model: "", color: "", vehicle_type: "" }])
  }

  const removeVehicle = (idx: number) => {
    setVehicleInterests((prev) => prev.filter((_, i) => i !== idx))
  }

  const updateVehicle = (idx: number, field: string, value: string) => {
    setVehicleInterests((prev) =>
      prev.map((v, i) => (i === idx ? { ...v, [field]: value } : v))
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          has_other_employment: hasOtherEmployment,
          has_company: hasCompany,
          company_name: hasCompany ? companyName : null,
          has_cosigner: hasCosigner,
          has_driver_license: legalDocs.has_driver_license,
          has_id: legalDocs.has_id,
          has_passport: legalDocs.has_passport,
          has_ssn: legalDocs.has_ssn,
          has_tax_id: legalDocs.has_tax_id,
        }),
      })

      const employments = [primaryJob]
      if (hasOtherEmployment) employments.push(secondaryJob)
      await fetch(`/api/leads/${leadId}/employments`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employments: employments.map((e, i) => ({
            employer_name: e.employer_name || null,
            payment_method: e.payment_method || null,
            payment_period: e.payment_period || null,
            income_value: e.income_value ? parseFloat(e.income_value.replace(/[^0-9.-]/g, "")) : null,
            tenure_months: e.tenure_months ? parseInt(e.tenure_months, 10) : null,
            is_primary: i === 0,
          })),
        }),
      })

      await fetch(`/api/leads/${leadId}/bank-accounts`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bank_accounts: [
            {
              bank_name: bankAccount.bank_name || null,
              tenure_months: bankAccount.tenure_months ? parseInt(bankAccount.tenure_months, 10) : null,
              is_shared_account: bankAccount.is_shared_account,
              is_company_account: bankAccount.is_company_account,
            },
          ],
        }),
      })

      await fetch(`/api/leads/${leadId}/vehicle-interests`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicle_interests: vehicleInterests
            .filter((v) => v.make || v.model)
            .map((v) => ({
              make: v.make || null,
              model: v.model || null,
              color: v.color || null,
              vehicle_type: v.vehicle_type || null,
            })),
        }),
      })

      toast.success("Calificación guardada")
      onSuccess?.()
      if (typeof window !== "undefined") window.location.reload()
    } catch (err) {
      console.error(err)
      toast.error("Error al guardar la calificación")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <GlassCard>
        <CardHeader>
          <CardTitle>Empleo Principal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Nombre del empleador</Label>
              <Input
                value={primaryJob.employer_name}
                onChange={(e) => setPrimaryJob({ ...primaryJob, employer_name: e.target.value })}
                placeholder="Ej: Restaurante La Casa"
              />
            </div>
            <div className="space-y-2">
              <Label>Forma de pago</Label>
              <Select value={primaryJob.payment_method} onValueChange={(v) => setPrimaryJob({ ...primaryJob, payment_method: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cheque">Cheque</SelectItem>
                  <SelectItem value="deposito_directo">Depósito directo</SelectItem>
                  <SelectItem value="efectivo">Efectivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Periodo de pago</Label>
              <Select value={primaryJob.payment_period} onValueChange={(v) => setPrimaryJob({ ...primaryJob, payment_period: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semanal">Semanal</SelectItem>
                  <SelectItem value="quincenal">Quincenal</SelectItem>
                  <SelectItem value="mensual">Mensual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Valor / Ingreso ($)</Label>
              <Input
                type="text"
                value={primaryJob.income_value}
                onChange={(e) => setPrimaryJob({ ...primaryJob, income_value: e.target.value })}
                placeholder="4000"
              />
            </div>
            <div className="space-y-2">
              <Label>Tiempo (meses)</Label>
              <Input
                type="text"
                value={primaryJob.tenure_months}
                onChange={(e) => setPrimaryJob({ ...primaryJob, tenure_months: e.target.value })}
                placeholder="24"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Checkbox id="otherJob" checked={hasOtherEmployment} onCheckedChange={(c) => setHasOtherEmployment(c as boolean)} />
            <Label htmlFor="otherJob" className="cursor-pointer">Tiene otro empleo</Label>
          </div>
          {hasOtherEmployment && (
            <div className="grid gap-4 md:grid-cols-2 border-t pt-4">
              <div className="space-y-2">
                <Label>Empleador secundario</Label>
                <Input
                  value={secondaryJob.employer_name}
                  onChange={(e) => setSecondaryJob({ ...secondaryJob, employer_name: e.target.value })}
                  placeholder="Ej: Uber"
                />
              </div>
              <div className="space-y-2">
                <Label>Forma de pago</Label>
                <Select value={secondaryJob.payment_method} onValueChange={(v) => setSecondaryJob({ ...secondaryJob, payment_method: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cheque">Cheque</SelectItem>
                    <SelectItem value="deposito_directo">Depósito directo</SelectItem>
                    <SelectItem value="efectivo">Efectivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Periodo</Label>
                <Select value={secondaryJob.payment_period} onValueChange={(v) => setSecondaryJob({ ...secondaryJob, payment_period: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="semanal">Semanal</SelectItem>
                    <SelectItem value="quincenal">Quincenal</SelectItem>
                    <SelectItem value="mensual">Mensual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Ingreso ($)</Label>
                <Input
                  type="text"
                  value={secondaryJob.income_value}
                  onChange={(e) => setSecondaryJob({ ...secondaryJob, income_value: e.target.value })}
                  placeholder="1500"
                />
              </div>
              <div className="space-y-2">
                <Label>Tiempo (meses)</Label>
                <Input
                  type="text"
                  value={secondaryJob.tenure_months}
                  onChange={(e) => setSecondaryJob({ ...secondaryJob, tenure_months: e.target.value })}
                  placeholder="12"
                />
              </div>
            </div>
          )}
          <div className="flex items-center gap-4">
            <Checkbox id="hasCompany" checked={hasCompany} onCheckedChange={(c) => setHasCompany(c as boolean)} />
            <Label htmlFor="hasCompany" className="cursor-pointer">Tiene compañía</Label>
          </div>
          {hasCompany && (
            <div className="space-y-2">
              <Label>Nombre de la compañía</Label>
              <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Ej: López y Asociados" />
            </div>
          )}
        </CardContent>
      </GlassCard>

      <GlassCard>
        <CardHeader>
          <CardTitle>Cuenta de Banco</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Nombre del banco</Label>
              <Input
                value={bankAccount.bank_name}
                onChange={(e) => setBankAccount({ ...bankAccount, bank_name: e.target.value })}
                placeholder="Ej: Chase, Bank of America"
              />
            </div>
            <div className="space-y-2">
              <Label>Tiempo (meses)</Label>
              <Input
                type="text"
                value={bankAccount.tenure_months}
                onChange={(e) => setBankAccount({ ...bankAccount, tenure_months: e.target.value })}
                placeholder="36"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <Checkbox
                id="shared"
                checked={bankAccount.is_shared_account}
                onCheckedChange={(c) => setBankAccount({ ...bankAccount, is_shared_account: c as boolean })}
              />
              <Label htmlFor="shared" className="cursor-pointer">Cuenta compartida</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="companyAcct"
                checked={bankAccount.is_company_account}
                onCheckedChange={(c) => setBankAccount({ ...bankAccount, is_company_account: c as boolean })}
              />
              <Label htmlFor="companyAcct" className="cursor-pointer">Cuenta de compañía</Label>
            </div>
          </div>
        </CardContent>
      </GlassCard>

      <GlassCard>
        <CardHeader>
          <CardTitle>Documentos Legales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <Checkbox
                id="dl"
                checked={legalDocs.has_driver_license}
                onCheckedChange={(c) => setLegalDocs({ ...legalDocs, has_driver_license: c as boolean })}
              />
              <Label htmlFor="dl" className="cursor-pointer">Driver License</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="id" checked={legalDocs.has_id} onCheckedChange={(c) => setLegalDocs({ ...legalDocs, has_id: c as boolean })} />
              <Label htmlFor="id" className="cursor-pointer">ID</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="passport"
                checked={legalDocs.has_passport}
                onCheckedChange={(c) => setLegalDocs({ ...legalDocs, has_passport: c as boolean })}
              />
              <Label htmlFor="passport" className="cursor-pointer">Pasaporte</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="ssn" checked={legalDocs.has_ssn} onCheckedChange={(c) => setLegalDocs({ ...legalDocs, has_ssn: c as boolean })} />
              <Label htmlFor="ssn" className="cursor-pointer">Social Security</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="itin"
                checked={legalDocs.has_tax_id}
                onCheckedChange={(c) => setLegalDocs({ ...legalDocs, has_tax_id: c as boolean })}
              />
              <Label htmlFor="itin" className="cursor-pointer">Tax ID (ITIN)</Label>
            </div>
          </div>
        </CardContent>
      </GlassCard>

      <GlassCard>
        <CardHeader>
          <CardTitle>Vehículos de Interés</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {vehicleInterests.map((v, idx) => (
            <div key={idx} className="grid gap-4 md:grid-cols-4 items-end">
              <Input
                placeholder="Marca"
                value={v.make}
                onChange={(e) => updateVehicle(idx, "make", e.target.value)}
              />
              <Input
                placeholder="Modelo"
                value={v.model}
                onChange={(e) => updateVehicle(idx, "model", e.target.value)}
              />
              <Input
                placeholder="Color"
                value={v.color}
                onChange={(e) => updateVehicle(idx, "color", e.target.value)}
              />
              <Input
                placeholder="Tipo (SUV, sedan...)"
                value={v.vehicle_type}
                onChange={(e) => updateVehicle(idx, "vehicle_type", e.target.value)}
              />
              <Button type="button" variant="ghost" size="sm" onClick={() => removeVehicle(idx)} disabled={vehicleInterests.length === 1}>
                Eliminar
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addVehicle}>
            Agregar vehículo
          </Button>
        </CardContent>
      </GlassCard>

      <GlassCard>
        <CardHeader>
          <CardTitle>Co-signer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Checkbox id="cosigner" checked={hasCosigner} onCheckedChange={(c) => setHasCosigner(c as boolean)} />
            <Label htmlFor="cosigner" className="cursor-pointer">Tiene co-signer</Label>
          </div>
        </CardContent>
      </GlassCard>

      <Button type="submit" disabled={isSaving} className="w-full">
        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Guardar Calificación
      </Button>
    </form>
  )
}
