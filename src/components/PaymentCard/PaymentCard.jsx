import "./PaymentCard.css";

function PaymentCard({
  cardNumber,
  cardHolder,
  expiry
}) {

  return (
    <div className="payment-card">

      <p className="card-label">
        PAYMENT CARD
      </p>

      <div className="card-number">
        {cardNumber || "•••• •••• •••• ••••"}
      </div>

      <div className="card-footer">

        <div>

          <p>Card Holder</p>

          <h3>
            {cardHolder
              ? cardHolder.toUpperCase()
              : "ALEX RIVERA"}
          </h3>

        </div>

        <div className="expiry">

          <p>Expires</p>

          <h3>
            {expiry || "MM/YY"}
          </h3>

        </div>

      </div>

    </div>
  );
}

export default PaymentCard;