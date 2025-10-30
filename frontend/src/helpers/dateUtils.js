import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export function transformTime(dateString) {
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return "Fecha inválida";
  }

  const timeAgo = formatDistanceToNow(date, {
    addSuffix: true,
    locale: es,
  });

  const capitalizedTimeAgo = timeAgo.charAt(0).toUpperCase() + timeAgo.slice(1);

  return capitalizedTimeAgo;
}