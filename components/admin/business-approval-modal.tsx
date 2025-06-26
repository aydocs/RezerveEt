"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle, Eye } from "lucide-react"

interface BusinessApprovalModalProps {
  business: any
  isOpen: boolean
  onClose: () => void
  onApprove: (businessId: string, note?: string) => void
  onReject: (businessId: string, reason: string) => void
}

export function BusinessApprovalModal({ business, isOpen, onClose, onApprove, onReject }: BusinessApprovalModalProps) {
  const [action, setAction] = useState<"approve" | "reject" | null>(null)
  const [note, setNote] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!action) return

    setLoading(true)
    try {
      if (action === "approve") {
        await onApprove(business._id, note)
      } else {
        await onReject(business._id, note)
      }
      onClose()
    } catch (error) {
      console.error("Action failed:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!business) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">İşletme Başvuru Detayı</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* İşletme Bilgileri */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">İşletme Bilgileri</h3>
              <div className="space-y-2">
                <div>
                  <Label className="font-medium">İşletme Adı:</Label>
                  <p>{business.name}</p>
                </div>
                <div>
                  <Label className="font-medium">Kategori:</Label>
                  <Badge variant="outline">{business.category}</Badge>
                </div>
                <div>
                  <Label className="font-medium">Açıklama:</Label>
                  <p className="text-sm text-gray-600">{business.description}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">İletişim Bilgileri</h3>
              <div className="space-y-2">
                <div>
                  <Label className="font-medium">E-posta:</Label>
                  <p>{business.email}</p>
                </div>
                <div>
                  <Label className="font-medium">Telefon:</Label>
                  <p>{business.phone}</p>
                </div>
                <div>
                  <Label className="font-medium">Adres:</Label>
                  <p className="text-sm">
                    {business.address}, {business.district}, {business.city}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sahibi Bilgileri */}
          <div>
            <h3 className="text-lg font-semibold mb-3">İşletme Sahibi</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="font-medium">Ad Soyad:</Label>
                <p>{business.ownerName}</p>
              </div>
              <div>
                <Label className="font-medium">Vergi Numarası:</Label>
                <p>{business.taxNumber}</p>
              </div>
            </div>
          </div>

          {/* Belgeler */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Yüklenen Belgeler</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {business.documents?.map((doc: any, index: number) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{doc.name}</span>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      Görüntüle
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600">{doc.type}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Aksiyon Seçimi */}
          {!action && (
            <div className="flex gap-4 justify-center">
              <Button onClick={() => setAction("approve")} className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="h-4 w-4 mr-2" />
                Onayla
              </Button>
              <Button onClick={() => setAction("reject")} variant="destructive">
                <XCircle className="h-4 w-4 mr-2" />
                Reddet
              </Button>
            </div>
          )}

          {/* Not/Sebep Girişi */}
          {action && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="note">{action === "approve" ? "Onay Notu (Opsiyonel)" : "Red Sebebi (Zorunlu)"}</Label>
                <Textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={action === "approve" ? "Onay ile ilgili notunuz..." : "Red sebebinizi açıklayın..."}
                  rows={4}
                />
              </div>
              <div className="flex gap-4 justify-end">
                <Button variant="outline" onClick={() => setAction(null)}>
                  Geri
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={loading || (action === "reject" && !note.trim())}
                  className={action === "approve" ? "bg-green-600 hover:bg-green-700" : ""}
                  variant={action === "reject" ? "destructive" : "default"}
                >
                  {loading ? "İşleniyor..." : action === "approve" ? "Onayla" : "Reddet"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
