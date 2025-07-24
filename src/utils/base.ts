export const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("es-ES", {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(new Date(dateString))
}