
import { db } from "@/db/drizzle";
import { userSubscription } from "@/db/schema";
import { stripe } from "@/lib/stripe";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {                                // Stripe enviará información a este webhook cuando se finalice una sesión de pago.
  
  const body = await req.text();                                          // Se lee el cuerpo de la solicitud HTTP y se almacena en la variable body.

  const signature = headers().get("Stripe-Signature") as string;          // Aquí se extrae y valida la firma del encabezado Stripe-Signature.
                                                                          // Stripe firma los eventos que envía a los webhooks para garantizar su autenticidad.

  let event: Stripe.Event;                                                // Inicialización del evento Stripe

  try {                                                                   // Validación de la firma del webhook:  
    event = stripe.webhooks.constructEvent(                               // constructEvent valida y decodifica el evento enviado por Stripe.    
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new NextResponse(`Webhook error: ${err.message}`, {
      status: 400,
    });
  }

  const session = event.data.object as Stripe.Checkout.Session;           // Se extrae la información de la sesión de pago contenida en el evento

  if (event.type === "checkout.session.completed") {                      // Si el evento es completar una sesión de pagos exitosamente,
    const subscription = await stripe.subscriptions.retrieve(             // se recupera la suscripción asociada a la sesión de pago completada. 
      session.subscription as string                                      // Para ello Se utiliza el ID de la suscripción extraído de la sesión de pago (metadata: userId en actions)
    );

    if (!session?.metadata?.userId) {                                     // Se verifica si existe un userId en los metadatos de la sesión de pago
      return new NextResponse("User ID is required !", { status: 400 });
    }

    await db.insert(userSubscription).values({                            // Se inserta en bd (userSuscription) la información relevante  
      userId: session.metadata.userId,                                                  // El ID del usuario asociado a la sesión de pago (userId de metadata en action).
      stripeSubscriptionId: subscription.id,                                            // El ID de la suscripción en stripe 
      stripeCustomerId: subscription.customer as string,                                // El ID del cliente en Stripe asociado a la suscripción.
      stripePriceId: subscription.items.data[0].price.id,                               // El ID del precio asociado a la suscripción.
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),         // La fecha de finalización del periodo actual de la suscripción, convertida a un objeto Date
    });
  }

  if (event.type === "invoice.payment_succeeded") {                       // Si el evento es el pago de una factura exitoso (renovación de la suscripción)
    const subscription = await stripe.subscriptions.retrieve(             // Se vuelve a recuperar la información de la suscripción asociada al evento
      session.subscription as string                                      // Aquí se esta obteniendo la información de la suscripción a partir del ID de la suscripción almacenado en la sesión de pago 
    );

    await db                                                              // Se actualiza 
      .update(userSubscription)                                           // en bd userSuscription  
      .set({                                                                
        stripePriceId: subscription.items.data[0].price.id,               // El ID del precio asociado a la suscripción.
        stripeCurrentPeriodEnd: new Date(                                 // La nueva fecha de finalización del periodo actual de la suscripción  
          subscription.current_period_end * 1000
        ),
      })
      .where(eq(userSubscription.stripeSubscriptionId, subscription.id)); //  Establece la condición para la actualización: stripeSubscriptionId coincida con el ID de la suscripción recuperado de Stripe.
  }

  return new NextResponse(null, { status: 200 });
}