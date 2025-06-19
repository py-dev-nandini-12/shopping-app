"use server";

interface CheckoutState {
  success: boolean;
  error?: string;
  orderId?: string;
  step?: number;
}

export async function processCheckoutAction(
  prevState: CheckoutState,
  formData: FormData
): Promise<CheckoutState> {
  const step = parseInt(formData.get("step") as string) || 1;

  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (step === 1) {
    // Validate shipping information
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const address = formData.get("address") as string;

    if (!firstName || !lastName || !email || !address) {
      return {
        success: false,
        error: "Please fill in all required shipping fields",
        step: 1,
      };
    }

    return {
      success: true,
      step: 2,
    };
  }

  if (step === 2) {
    // Validate payment information
    const cardNumber = formData.get("cardNumber") as string;
    const expiryDate = formData.get("expiryDate") as string;
    const cvv = formData.get("cvv") as string;
    const nameOnCard = formData.get("nameOnCard") as string;

    if (!cardNumber || !expiryDate || !cvv || !nameOnCard) {
      return {
        success: false,
        error: "Please fill in all required payment fields",
        step: 2,
      };
    }

    // Validate expiry date format
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      return {
        success: false,
        error: "Please enter expiry date in MM/YY format",
        step: 2,
      };
    }

    const [month, year] = expiryDate.split("/");
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;

    if (parseInt(month) < 1 || parseInt(month) > 12) {
      return {
        success: false,
        error: "Please enter a valid month (01-12)",
        step: 2,
      };
    }

    if (
      parseInt(year) < currentYear ||
      (parseInt(year) === currentYear && parseInt(month) < currentMonth)
    ) {
      return {
        success: false,
        error: "Card has expired",
        step: 2,
      };
    }

    // Simulate payment processing
    const orderId = `ORDER-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    return {
      success: true,
      orderId,
      step: 3,
    };
  }

  return {
    success: false,
    error: "Invalid step",
    step: 1,
  };
}

export async function validateShippingAction(
  prevState: CheckoutState,
  formData: FormData
): Promise<CheckoutState> {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const address = formData.get("address") as string;
  const city = formData.get("city") as string;
  const state = formData.get("state") as string;
  const zipCode = formData.get("zipCode") as string;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !address ||
    !city ||
    !state ||
    !zipCode
  ) {
    return {
      success: false,
      error: "Please fill in all required fields",
      step: 1,
    };
  }

  if (!email.includes("@")) {
    return {
      success: false,
      error: "Please enter a valid email address",
      step: 1,
    };
  }

  return {
    success: true,
    step: 2,
  };
}

export async function validatePaymentAction(
  prevState: CheckoutState,
  formData: FormData
): Promise<CheckoutState> {
  const cardNumber = formData.get("cardNumber") as string;
  const expiryDate = formData.get("expiryDate") as string;
  const cvv = formData.get("cvv") as string;
  const nameOnCard = formData.get("nameOnCard") as string;

  if (!cardNumber || !expiryDate || !cvv || !nameOnCard) {
    return {
      success: false,
      error: "Please fill in all required payment fields",
      step: 2,
    };
  }

  // Clean and validate card number
  const cleanCardNumber = cardNumber.replace(/\s/g, "");
  if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
    return {
      success: false,
      error: "Please enter a valid card number (13-19 digits)",
      step: 2,
    };
  }

  if (!/^\d+$/.test(cleanCardNumber)) {
    return {
      success: false,
      error: "Card number should contain only digits",
      step: 2,
    };
  }

  if (cvv.length < 3 || cvv.length > 4) {
    return {
      success: false,
      error: "Please enter a valid CVV (3-4 digits)",
      step: 2,
    };
  }

  // Validate expiry date format
  if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
    return {
      success: false,
      error: "Please enter expiry date in MM/YY format",
      step: 2,
    };
  }

  const [month, year] = expiryDate.split("/");
  const currentYear = new Date().getFullYear() % 100;
  const currentMonth = new Date().getMonth() + 1;

  if (parseInt(month) < 1 || parseInt(month) > 12) {
    return {
      success: false,
      error: "Please enter a valid month (01-12)",
      step: 2,
    };
  }

  if (
    parseInt(year) < currentYear ||
    (parseInt(year) === currentYear && parseInt(month) < currentMonth)
  ) {
    return {
      success: false,
      error: "Card has expired",
      step: 2,
    };
  }

  // Simulate payment processing
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const orderId = `ORDER-${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 9)}`;

  return {
    success: true,
    orderId,
    step: 3,
  };
}
