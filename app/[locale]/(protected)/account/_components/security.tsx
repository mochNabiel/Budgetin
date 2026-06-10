"use client"

import { useMemo, useState, useTransition } from "react"

import { AlertTriangle, LogOut, Trash2, Loader2 } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Input } from "@/components/ui/input"

import { logout } from "@/lib/actions/auth"

export function SecuritySection() {
  const [deleteText, setDeleteText] = useState("")
  const [isPending, startTransition] = useTransition()

  const isDeleteValid = useMemo(() => {
    return deleteText.trim().toLowerCase() === "hapus akun saya"
  }, [deleteText])

  return (
    <Card size="sm">
      <CardHeader className="gap-0">
        <CardTitle>Akses Akun</CardTitle>

        <CardDescription>
          Atur akses akun, logout dari sesi aktif, atau hapus akun Anda secara
          permanen.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* LOGOUT */}
        <div className="flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <LogOut className="size-4 text-muted-foreground" />

              <h3 className="font-medium">Logout dari akun</h3>
            </div>

            <p className="text-sm text-muted-foreground">
              Keluar dari sesi aktif pada perangkat ini.
            </p>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                Logout
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Logout dari akun?</AlertDialogTitle>

                <AlertDialogDescription>
                  Anda perlu login kembali untuk mengakses akun dan data
                  finansial Anda.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>

                <AlertDialogAction
                  onClick={() => {
                    startTransition(async () => {
                      await logout()
                    })
                  }}
                >
                  {isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    "Logout"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* DELETE ACCOUNT */}
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <AlertTriangle className="size-4 text-destructive" />

                <h3 className="font-medium text-destructive">Hapus akun</h3>
              </div>

              <p className="max-w-xl text-sm text-muted-foreground">
                Tindakan ini tidak dapat dibatalkan. Seluruh data akun,
                transaksi, dan riwayat finansial Anda akan dihapus secara
                permanen.
              </p>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full sm:w-auto">
                  <Trash2 className="size-4" />
                  Hapus akun
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Hapus akun secara permanen?
                  </AlertDialogTitle>

                  <AlertDialogDescription className="space-y-4 pt-2">
                    <p>
                      Semua data Anda akan dihapus permanen dan tidak dapat
                      dipulihkan kembali.
                    </p>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground">
                        Ketik{" "}
                        <span className="rounded bg-muted px-1 py-0.5 font-mono">
                          hapus akun saya
                        </span>{" "}
                        untuk melanjutkan.
                      </p>

                      <Input
                        placeholder="hapus akun saya"
                        value={deleteText}
                        onChange={(e) => setDeleteText(e.target.value)}
                      />
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>

                  <AlertDialogAction
                    disabled={!isDeleteValid || isPending}
                    onClick={() => {}}
                    className="text-destructive-foreground bg-destructive hover:bg-destructive/90"
                  >
                    {isPending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <>
                        <Trash2 className="size-4" />
                        Hapus permanen
                      </>
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
