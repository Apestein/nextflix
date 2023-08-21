import type { Stripe } from "stripe"
import { stripe } from "~/lib/stripe"
import { ScrollArea } from "~/components/ui/scroll-area"

export default async function ResultPage({
  searchParams,
}: {
  searchParams: { session_id: string }
}): Promise<JSX.Element> {
  if (!searchParams.session_id)
    throw new Error("Please provide a valid session_id (`cs_test_...`)")

  const checkoutSession = await stripe.checkout.sessions.retrieve(
    searchParams.session_id,
    {
      expand: ["line_items", "payment_intent"],
    },
  )
  // const paymentIntent = checkoutSession.payment_intent as Stripe.PaymentIntent
  const checkoutStatus = checkoutSession.payment_status
  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  })
  const amountPaid = currencyFormatter.format(
    checkoutSession.amount_subtotal! / 100,
  )
  const createdAt = new Date(checkoutSession.created)
  return (
    <main className="mt-8 space-y-4">
      <h2 className="text-xl font-semibold">
        Checkout Status: {checkoutStatus}
      </h2>
      <h3>Checkout Session Info:</h3>
      <ScrollArea className="rounded-md border p-4">
        {/* <PrintObject content={checkoutSession} /> */}
        <p>{`Email: ${checkoutSession.customer_email}`}</p>
        <p>{`Amount Total: ${amountPaid}`}</p>
        <p>{`Time: ${createdAt.toUTCString()}`}</p>
      </ScrollArea>
    </main>
  )
}

// function PrintObject({
//   content,
// }: {
//   content: Stripe.Response<Stripe.Checkout.Session>
// }): JSX.Element {
//   const formattedContent: string = JSON.stringify(content, null, 2)
//   return <pre>{formattedContent}</pre>
// }
