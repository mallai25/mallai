import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { doc, setDoc } from "firebase/firestore"
import { FIREBASE_DB } from "../../../../FirebaseConfig"

// Initialize Stripe with the secret key
const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY ||
    "sk_test_51RFY8D2HjbKnsaOZaiq0RJwCwrZVP8127A1RBBFVjasNk0RVqrSKGQrvWTdFz0S0ZQUnx3jzvVKKVMHrv56j1SbZ00r9MXHrGF",
  {
    apiVersion: "2025-02-24.acacia", // Updated to the required API version
  },
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { cartItems } = body

    // Create line items for Stripe
    const lineItems = cartItems.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          description: item.description || `${item.brand || ""} ${item.category || ""}`.trim(),
          images: item.imageUrl ? [item.imageUrl] : [],
        },
        unit_amount: Math.round(Number.parseFloat(String(item.price).replace("$", "")) * 100), // Convert to cents
      },
      quantity: item.quantity,
    }))

    // Generate a unique order ID
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

    // Create the checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${request.headers.get("origin")}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancel_url: `${request.headers.get("origin")}/checkout/cancel`,
      shipping_address_collection: { allowed_countries: ["US", "CA", "GB", "AU"] },
      billing_address_collection: "auto",
      metadata: {
        orderId: orderId,
      },
    })

    // Store initial order information in Firebase
    try {
      const orderRef = doc(FIREBASE_DB, "orders", orderId)
      await setDoc(orderRef, {
        id: orderId,
        items: cartItems,
        total: cartItems.reduce(
          (sum: number, item: any) => sum + Number.parseFloat(String(item.price).replace("$", "")) * item.quantity,
          0,
        ),
        status: "pending",
        createdAt: new Date().toISOString(),
        sessionId: session.id,
      })
    } catch (error) {
      console.error("Error storing order in Firebase:", error)
      // Continue even if Firebase storage fails
    }

    // Return the session URL for redirection
    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json({ error: "Error creating checkout session" }, { status: 500 })
  }
}
