export function getRenewalEmailHtml(params: {
  toName: string;
  serviceType: string;
  domain: string | null;
  expiryDate: string;
  daysUntil: number;
  price: string | null;
  currency: string | null;
}) {
  const serviceName = params.domain ? params.domain : params.serviceType;

  // Format price
  let formattedPrice = "Por definir";
  if (params.price) {
    const numPrice = Number(params.price);
    formattedPrice = new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: params.currency || "COP",
      minimumFractionDigits: 0,
    }).format(numPrice);
  }

  // Format date
  const dateObj = new Date(params.expiryDate);
  // Add timezone offset to prevent off-by-one day issues
  const localDate = new Date(
    dateObj.getTime() + dateObj.getTimezoneOffset() * 60000,
  );
  const formattedDate = new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(localDate);

  const titleWord = params.daysUntil <= 0 ? "Vencimiento" : "Renovación";
  const actionWord = params.daysUntil <= 0 ? "venció" : "será";

  // URL de WhatsApp de Mauricio Correa (Asegúrate de cambiar este número por el real)
  const whatsappUrl = "https://wa.me/573023725631";

  const isExpired = params.daysUntil <= 0;
  const isUrgent = params.daysUntil > 0 && params.daysUntil <= 7;

  let accentColor = "#2c5fa8"; // Default blue
  let accentBg = "#eaf0f7"; // Light blue
  if (isExpired) {
    accentColor = "#b03030";
    accentBg = "#faeaea";
  } else if (isUrgent) {
    accentColor = "#c8620a";
    accentBg = "#fdf0e6";
  }

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Inter', system-ui, -apple-system, sans-serif; color: #262626; line-height: 1.6; margin: 0; padding: 40px 20px; background-color: #fafbfc;">
  <div style="max-width: 520px; margin: 0 auto; background: #ffffff; padding: 40px; border: 1px solid #e6e6e6;">
    <div style="font-size: 24px; font-weight: 500; margin-bottom: 24px; color: #262626; letter-spacing: -0.02em;">
      <span style="background-color: ${accentBg}; color: ${accentColor}; padding: 2px 6px; border-radius: 2px; font-weight: 500;">${titleWord}</span> de tu ${params.serviceType === "website" ? "sitio web" : "servicio"}
    </div>
    
    <div style="font-size: 15px; color: #262626; margin-bottom: 24px;">
      Hola ${params.toName},<br><br>
      Te escribo para recordarte que la <span style="color: ${accentColor}; font-weight: 600;">renovación</span> anual de tu servicio <a href="${params.domain ? "https://" + params.domain : "#"}" style="color: #2c5fa8; text-decoration: underline; font-weight: 500;">${serviceName}</a> ${actionWord} el <strong>${formattedDate}</strong>, es decir, en <strong>${params.daysUntil} días</strong>.
    </div>

    <div style="border-top: 1px solid #e6e6e6; border-bottom: 1px solid #e6e6e6; padding: 20px 0; margin: 32px 0;">
      <div style="margin-bottom: 24px;">
        <span style="color: #8c8c8c; font-size: 12px; text-transform: uppercase; letter-spacing: 0.06em; font-weight: 500; display: block; margin-bottom: 4px;">Monto de la renovación</span>
        <span style="font-size: 18px; font-weight: 300; letter-spacing: -0.02em; display: block; color: #262626;">${formattedPrice}</span>
      </div>
      <div>
        <span style="color: #8c8c8c; font-size: 12px; text-transform: uppercase; letter-spacing: 0.06em; font-weight: 500; display: block; margin-bottom: 4px;">Fecha límite de pago</span>
        <span style="font-size: 18px; font-weight: 300; letter-spacing: -0.02em; display: block; color: #262626;">${formattedDate}</span>
      </div>
    </div>

    <div style="font-size: 15px; color: #262626; margin-bottom: 24px;">
      Para realizar el pago o solicitar la cancelación del servicio antes de la fecha límite, escríbeme por WhatsApp. Te enviaré los datos bancarios o el enlace de pago, o tramitaré la cancelación según prefieras:
      <br><br>
      <a href="${whatsappUrl}" style="display: inline-block; background-color: #262626; color: #ffffff; font-size: 14px; font-weight: 500; padding: 12px 24px; border-radius: 3px; text-decoration: none; margin-top: 16px;">Contactar por WhatsApp</a>
    </div>

    <div style="font-size: 15px; color: #8c8c8c; margin-bottom: 32px;">
      Un abrazo,<br>
      <div style="color: #262626; margin-top: 24px; font-weight: 500;">Mauricio Correa</div>
      <div style="color: #8c8c8c; font-size: 13px;">Web Designer & Developer</div>
    </div>
  </div>
  
  <div style="font-size: 12px; color: #8c8c8c; font-style: italic; margin-top: 40px; text-align: center;">
    Este mensaje ha sido generado de manera automática para el control de tus servicios.<br>
    Si necesitas ayuda, puedes responder directamente a este correo o vía WhatsApp.
  </div>
</body>
</html>
  `;
}
