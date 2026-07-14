export const formatThousands = (val: string) =>
  val.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".")
