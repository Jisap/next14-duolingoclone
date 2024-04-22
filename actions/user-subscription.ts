"use server";

import { auth, currentUser } from "@clerk/nextjs";

import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";
import { getUserSubscription } from "@/db/queries";

const returnUrl = absoluteUrl("/shop");       // http://localhost:3000/shop (en desarrollo)

export const createStripeUrl = async () => {  //  Se encarga de crear una sesión de pago en Stripe y devolver la URL asociada a esa sesión.
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    throw new Error("Unauthorized");
  }

  const userSubscription = await getUserSubscription();                 // Se obtiene la información de la suscripción del usuario desde la base de datos.

  if (userSubscription && userSubscription.stripeCustomerId) {          // Si el userSuscription existe y tiene un stripeCustomerId -> usuario ya esta vinculado a un cliente stripe
    const stripeSession = await stripe.billingPortal.sessions.create({  // Entonces se crea una nueva sesión (stripeSession) de portal de facturación de Stripe 
      customer: userSubscription.stripeCustomerId,                      // Esta sesión contendrá el ID del cliente de stripe
      return_url: returnUrl,                                            // y la url a donde se redirigirá al usuario después de completar o cancelar el proceso de pago, 
    });

    return { data: stripeSession.url };                                 // Se devuelve la stripeSession.url, URL de esta sesión -> usuario puede administrar su suscripción 
  }

  
  const stripeSession = await stripe.checkout.sessions.create({         // Si no existía una userSuscription se procede a crear una
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: user.emailAddresses[0].emailAddress,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "USD",
          product_data: {
            name: "Lingo Pro",
            description: "Unlimited Hearts",
          },
          unit_amount: 2000, // $20.00 USD
          recurring: {
            interval: "month",
          },
        },
      },
    ],
    metadata: {
      userId, // Este userId se usará en el webhook 
    },
    success_url: returnUrl, // URL a las que se redirigirá al usuario después de completar o cancelar el proceso de pago,
    cancel_url: returnUrl,
  });

  return { data: stripeSession.url }; // Se devuelve la stripeSession.url, URL de esta sesión -> usuario puede administrar su suscripción
};